import React from "react";
import { FileText, Loader2 } from "lucide-react";
import { useChapterPdfs } from "../hooks/useChapterPdfs";

interface ActiveChapterPdfsProps {
  chapterId: string;
}

export default function ActiveChapterPdfs({ chapterId }: ActiveChapterPdfsProps) {
  const { pdfs, isLoading } = useChapterPdfs(chapterId);

  if (isLoading) {
    return (
      <div className="mt-3 flex items-center gap-2 text-violet-400">
        <Loader2 className="animate-spin" size={14} />
        <span className="text-xs">Cargando documentos...</span>
      </div>
    );
  }

  if (pdfs.length === 0) return null;

  return (
    <div className="mt-3 space-y-2">
      {pdfs.map((pdf) => (
        <a
          key={pdf.id}
          href={pdf.fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-2 bg-violet-100 text-violet-700 text-xs font-bold rounded-xl hover:bg-violet-200 transition-colors w-fit"
          onClick={(e) => e.stopPropagation()}
        >
          <FileText size={14} />
          {pdf.title}
        </a>
      ))}
    </div>
  );
}
