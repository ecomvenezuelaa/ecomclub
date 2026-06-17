import React, { useState, useRef } from "react";
import { Paperclip, X, Loader2, Upload, Trash2 } from "lucide-react";
import { useApiFetch } from "../../../lib/api";
import { ChapterPdf } from "../../../types";
import { useChapterPdfs } from "../hooks/useChapterPdfs";

interface ChapterPdfsAdminProps {
  chapterId: string;
}

export default function ChapterPdfsAdmin({ chapterId }: ChapterPdfsAdminProps) {
  const { pdfs, isLoading, refetch } = useChapterPdfs(chapterId);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const api = useApiFetch();

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    setError(null);
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      await api(`/api/admin/classroom/chapters/${chapterId}/pdfs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: file.name.replace(/\.[^/.]+$/, ""), // remove extension
          fileData: base64,
          fileName: file.name,
        }),
      });

      refetch();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al subir PDF");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = async (pdfId: string) => {
    if (!confirm("¿Seguro que deseas eliminar este PDF?")) return;
    try {
      await api(`/api/admin/classroom/chapters/${chapterId}/pdfs/${pdfId}`, {
        method: "DELETE",
      });
      refetch();
    } catch (err) {
      alert("Error al eliminar el PDF: " + (err instanceof Error ? err.message : "Desconocido"));
    }
  };

  return (
    <div className="mt-4 pt-4 border-t border-violet-100 space-y-3">
      <p className="text-sm font-bold text-slate-800 flex items-center gap-2">
        <Paperclip size={16} className="text-violet-500" />
        PDFs y Documentos
      </p>

      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}

      {isLoading ? (
        <div className="py-4 flex justify-center">
          <Loader2 className="animate-spin text-violet-300" size={20} />
        </div>
      ) : (
        <div className="space-y-2">
          {pdfs.map((pdf) => (
            <div key={pdf.id} className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200">
              <span className="text-xs font-medium text-slate-600 truncate flex-1">{pdf.title}</span>
              <a 
                href={pdf.fileUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-xs text-violet-600 font-bold hover:underline"
              >
                Ver
              </a>
              <button
                type="button"
                onClick={() => handleDelete(pdf.id)}
                className="text-slate-400 hover:text-red-500 ml-2"
                title="Eliminar PDF"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}

          {pdfs.length === 0 && (
            <p className="text-xs text-slate-400">No hay documentos adjuntos aún.</p>
          )}

          <div className="pt-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleUpload(file);
              }}
              accept=".pdf,.doc,.docx"
              className="hidden"
            />
            <button
              type="button"
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
              className="flex w-full items-center justify-center gap-2 px-3 py-2 bg-violet-50 text-violet-600 text-xs font-bold rounded-xl hover:bg-violet-100 transition-colors disabled:opacity-50"
            >
              {isUploading ? (
                <>
                  <Loader2 className="animate-spin" size={14} /> Subiendo...
                </>
              ) : (
                <>
                  <Upload size={14} /> Adjuntar nuevo PDF/Word
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
