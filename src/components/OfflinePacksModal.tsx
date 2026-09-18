import React, { useState } from 'react';
import { OfflineLanguagePack } from '../types';
import {
  HardDrive,
  Download,
  Trash2,
  CheckCircle2,
  X,
  ShieldCheck,
  Zap,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

interface OfflinePacksModalProps {
  isOpen: boolean;
  onClose: () => void;
  packs: OfflineLanguagePack[];
  onUpdatePack: (updatedPack: OfflineLanguagePack) => void;
  onDeletePack: (packId: string) => void;
}

export const OfflinePacksModal: React.FC<OfflinePacksModalProps> = ({
  isOpen,
  onClose,
  packs,
  onUpdatePack,
  onDeletePack
}) => {
  const [downloadingPackId, setDownloadingPackId] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);

  if (!isOpen) return null;

  const totalStorageMB = 2048; // 2GB virtual local allocation
  const usedStorageMB = packs
    .filter((p) => p.downloaded)
    .reduce((sum, p) => sum + p.sizeMB, 0);
  const storagePercentage = Math.round((usedStorageMB / totalStorageMB) * 100);

  const startDownload = (pack: OfflineLanguagePack) => {
    setDownloadingPackId(pack.packId);
    setDownloadProgress(10);

    let progress = 10;
    const interval = setInterval(() => {
      progress += 20;
      setDownloadProgress(Math.min(progress, 100));

      if (progress >= 100) {
        clearInterval(interval);
        setDownloadingPackId(null);
        onUpdatePack({
          ...pack,
          downloaded: true,
          lastUpdated: new Date().toISOString().slice(0, 10)
        });
      }
    }, 300);
  };

  return (
    <div
      id="offline-packs-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        id="offline-packs-modal"
        className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[85vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <HardDrive className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Offline Language Packs</h2>
              <p className="text-xs text-slate-500">
                Quantized on-device transformer models (&lt;150MB per pack) for zero-connectivity travel.
              </p>
            </div>
          </div>
          <button
            id="close-offline-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Local Storage Meter */}
        <div className="p-4 bg-slate-50 border-b border-slate-100 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700">Device Storage Allocation</span>
            <span className="text-indigo-600 font-mono font-medium tabular-nums">
              {usedStorageMB} MB used / {totalStorageMB} MB ({storagePercentage}%)
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
            <div
              style={{ width: `${storagePercentage}%` }}
              className="bg-indigo-600 h-full rounded-full transition-all duration-300"
            />
          </div>
        </div>

        {/* Language Packs List */}
        <div className="overflow-y-auto p-4 space-y-2.5 flex-1">
          {packs.map((pack) => {
            const isCurrentlyDownloading = downloadingPackId === pack.packId;

            return (
              <div
                key={pack.packId}
                id={`pack-row-${pack.code}`}
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{pack.flag}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-slate-900 tracking-tight">{pack.name}</span>
                        <span className="text-xs text-slate-500 font-mono tabular-nums">({pack.sizeMB} MB)</span>
                        {pack.downloaded && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1 font-bold uppercase tracking-wider leading-none">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Installed
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1 mt-0.5 leading-none">
                        <ShieldCheck className="w-3 h-3 text-indigo-600" />
                        <span>{pack.version} • {pack.checksum}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div>
                    {pack.downloaded ? (
                      <button
                        id={`delete-pack-${pack.code}`}
                        onClick={() => onDeletePack(pack.packId)}
                        className="p-2 rounded-xl bg-white border border-slate-200 text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition-colors shadow-sm"
                        title="Delete Pack to Free Storage"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    ) : isCurrentlyDownloading ? (
                      <div className="px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-mono font-semibold tabular-nums animate-pulse">
                        {downloadProgress}%
                      </div>
                    ) : (
                      <button
                        id={`download-pack-${pack.code}`}
                        onClick={() => startDownload(pack)}
                        className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Progress Bar for Active Download */}
                {isCurrentlyDownloading && (
                  <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                    <div
                      style={{ width: `${downloadProgress}%` }}
                      className="bg-indigo-600 h-full rounded-full transition-all duration-200"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-indigo-600" />
            <span>Automatic fallback activates when offline</span>
          </div>
          <button
            id="done-offline-packs-btn"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
