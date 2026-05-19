import { Router } from "express";
import supabase from "../lib/supabase";

const router = Router();

router.get("/", async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 10, 50);
  const cursor = req.query.cursor as string | undefined;

  let query = supabase
    .from("posts_view")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (cursor) {
    query = query.lt("created_at", cursor);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching posts:", error.message);
    return res.status(500).json({ error: error.message });
  }

  const posts = data ?? [];
  const nextCursor = posts.length === limit ? posts[posts.length - 1].created_at : null;

  res.json({ posts, nextCursor });
});

router.post("/", async (req, res) => {
  const { content, userId } = req.body;

  if (!content || typeof content !== "string" || content.trim() === "") {
    return res.status(400).json({ error: "El contenido es requerido" });
  }
  if (!userId) {
    return res.status(400).json({ error: "userId es requerido" });
  }

  const { data, error } = await supabase
    .from("posts")
    .insert({ user_id: userId, content: content.trim() })
    .select("id, user_id, content, tags, created_at")
    .single();

  if (error) {
    console.error("Error creating post:", error.message);
    return res.status(500).json({ error: error.message });
  }

  const { data: fullPost } = await supabase
    .from("posts_view")
    .select("*")
    .eq("id", data.id)
    .single();

  res.status(201).json(fullPost ?? data);
});

router.post("/:id/like", async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  if (!userId) return res.status(400).json({ error: "userId requerido" });

  const { data: existing } = await supabase
    .from("post_likes")
    .select("id")
    .eq("post_id", id)
    .eq("user_id", userId)
    .maybeSingle();

  if (existing) {
    await supabase.from("post_likes").delete().eq("id", existing.id);
  } else {
    await supabase.from("post_likes").insert({ post_id: id, user_id: userId });
  }

  const { count } = await supabase
    .from("post_likes")
    .select("*", { count: "exact", head: true })
    .eq("post_id", id);

  res.json({ liked: !existing, likes: count ?? 0 });
});

router.get("/:id/comments", async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("post_comments")
    .select("id, post_id, user_id, content, created_at, profiles(name, avatar)")
    .eq("post_id", id)
    .order("created_at", { ascending: true });

  if (error) return res.status(500).json({ error: error.message });

  const comments = (data ?? []).map((c: any) => ({
    id: c.id,
    post_id: c.post_id,
    user_id: c.user_id,
    content: c.content,
    created_at: c.created_at,
    author: c.profiles?.name ?? "Anónimo",
    avatar: c.profiles?.avatar ?? null,
  }));

  res.json(comments);
});

router.post("/:id/comments", async (req, res) => {
  const { id } = req.params;
  const { content, userId } = req.body;

  if (!content?.trim()) return res.status(400).json({ error: "Contenido requerido" });
  if (!userId) return res.status(400).json({ error: "userId requerido" });

  const { data, error } = await supabase
    .from("post_comments")
    .insert({ post_id: id, user_id: userId, content: content.trim() })
    .select("id, post_id, user_id, content, created_at, profiles(name, avatar)")
    .single();

  if (error) return res.status(500).json({ error: error.message });

  res.status(201).json({
    id: data.id,
    post_id: data.post_id,
    user_id: data.user_id,
    content: data.content,
    created_at: data.created_at,
    author: (data as any).profiles?.name ?? "Anónimo",
    avatar: (data as any).profiles?.avatar ?? null,
  });
});

export default router;
