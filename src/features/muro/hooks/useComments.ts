import { useState, useCallback } from "react";
import { Comment } from "../../../types";
import { useAuth } from "../../../context/AuthContext";
import { useApiFetch } from "../../../lib/api";

function countAllComments(comments: Comment[]): number {
  return comments.reduce((acc, c) => acc + 1 + countAllComments(c.replies ?? []), 0);
}

function insertReply(comments: Comment[], parentId: string, reply: Comment): Comment[] {
  return comments.map((c) => {
    if (c.id === parentId) return { ...c, replies: [...(c.replies ?? []), reply] };
    if (c.replies?.length) return { ...c, replies: insertReply(c.replies, parentId, reply) };
    return c;
  });
}

function updateReactionInTree(
  comments: Comment[],
  commentId: string,
  reactions: Record<string, number>,
  userReaction: string | null
): Comment[] {
  return comments.map((c) => {
    if (c.id === commentId) return { ...c, reactions, userReaction };
    if (c.replies?.length) return { ...c, replies: updateReactionInTree(c.replies, commentId, reactions, userReaction) };
    return c;
  });
}

export function useComments(postId: string) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const api = useApiFetch();

  const fetchComments = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await api<Comment[]>(`/api/posts/${postId}/comments`);
      setComments(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [postId, api]);

  const toggle = useCallback(() => {
    setIsOpen((prev) => {
      if (!prev) fetchComments();
      return !prev;
    });
  }, [fetchComments]);

  const addComment = useCallback(async (content: string, parentId?: string): Promise<boolean> => {
    if (!user) return false;
    try {
      const { data: newComment } = await api<Comment>(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, parentId: parentId ?? null }),
      });
      setComments((prev) =>
        parentId ? insertReply(prev, parentId, newComment) : [...prev, newComment]
      );
      return true;
    } catch {
      return false;
    }
  }, [postId, user, api]);

  const reactToComment = useCallback(async (postId: string, commentId: string, reactionType: string): Promise<void> => {
    if (!user) return;
    try {
      const { data } = await api<{ reactions: Record<string, number>; userReaction: string | null }>(
        `/api/posts/${postId}/comments/${commentId}/react`,
        { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ reactionType }) }
      );
      setComments((prev) => updateReactionInTree(prev, commentId, data.reactions, data.userReaction));
    } catch (err) {
      console.error("[reactToComment]", err);
    }
  }, [user, api]);

  const totalCount = countAllComments(comments);

  return { comments, totalCount, isLoading, isOpen, toggle, addComment, reactToComment };
}
