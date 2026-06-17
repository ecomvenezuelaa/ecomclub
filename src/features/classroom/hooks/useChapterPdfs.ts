import { useState, useEffect, useCallback } from "react";
import { useApiFetch } from "../../../lib/api";
import { ChapterPdf } from "../../../types";

export function useChapterPdfs(chapterId: string | undefined) {
  const [pdfs, setPdfs] = useState<ChapterPdf[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const api = useApiFetch();

  const fetchPdfs = useCallback(async () => {
    if (!chapterId) return;
    setIsLoading(true);
    try {
      const payload = await api<ChapterPdf[]>(`/api/classroom/chapters/${chapterId}/pdfs`);
      // @ts-ignore
      setPdfs(payload.data || payload || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar PDFs");
    } finally {
      setIsLoading(false);
    }
  }, [api, chapterId]);

  useEffect(() => {
    fetchPdfs();
  }, [fetchPdfs]);

  return { pdfs, isLoading, error, refetch: fetchPdfs };
}
