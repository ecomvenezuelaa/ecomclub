import React from "react";
import { Camera, Save, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export interface ProfileEditForm {
  name: string;
  avatar: string;
  bio: string;
}

interface ProfileEditSheetProps {
  open: boolean;
  form: ProfileEditForm;
  isSaving: boolean;
  isUploadingImage: boolean;
  onClose: () => void;
  onChange: (form: ProfileEditForm) => void;
  onSave: () => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ProfileEditSheet({
  open,
  form,
  isSaving,
  isUploadingImage,
  onClose,
  onChange,
  onSave,
  onImageUpload,
}: ProfileEditSheetProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-[60] lg:hidden"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            className="fixed inset-x-0 bottom-0 z-[70] bg-white rounded-t-[2rem] p-6 pb-28 max-h-[85vh] overflow-y-auto lg:hidden shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-slate-900">Editar perfil</h2>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl bg-slate-100 text-slate-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">
                  Nombre público
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => onChange({ ...form, name: e.target.value })}
                  className="w-full mt-1 bg-slate-50 border-2 border-transparent focus:border-orange-200 focus:bg-white rounded-xl py-3 px-4 text-sm font-bold outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">
                  Imagen de perfil
                </label>
                <div className="flex gap-2 mt-1">
                  <input
                    type="text"
                    value={form.avatar}
                    onChange={(e) => onChange({ ...form, avatar: e.target.value })}
                    placeholder="URL o sube una imagen..."
                    className="flex-1 bg-slate-50 border-2 border-transparent focus:border-orange-200 focus:bg-white rounded-xl py-3 px-4 text-sm font-medium outline-none"
                  />
                  <label
                    className={`flex items-center justify-center px-4 rounded-xl ${
                      isUploadingImage
                        ? "bg-orange-100 text-orange-300 cursor-not-allowed"
                        : "bg-orange-100 text-orange-600 cursor-pointer hover:bg-orange-200"
                    }`}
                  >
                    {isUploadingImage ? (
                      <span className="text-xs font-bold">...</span>
                    ) : (
                      <Camera size={20} />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={onImageUpload}
                      disabled={isUploadingImage}
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">
                  Bio / subtítulo
                </label>
                <textarea
                  value={form.bio}
                  onChange={(e) => onChange({ ...form, bio: e.target.value })}
                  rows={3}
                  placeholder="Explorador de Ideas..."
                  className="w-full mt-1 bg-slate-50 border-2 border-transparent focus:border-orange-200 focus:bg-white rounded-xl py-3 px-4 text-sm font-medium outline-none resize-none"
                />
              </div>

              <button
                type="button"
                onClick={onSave}
                disabled={isSaving}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#8B5E3C] text-white font-bold rounded-2xl hover:bg-[#7a5235] disabled:opacity-50 transition-all"
              >
                {isSaving ? "Guardando..." : (
                  <>
                    <Save size={18} /> Guardar cambios
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
