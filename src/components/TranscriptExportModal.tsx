import React, { useState } from 'react';
import { TranslationSegment, Language } from '../types';
import { exportTranscriptToPDF, exportTranscriptToMarkdown, downloadTextFile } from '../utils/pdfExport';
import {
  Share2,
  FileText,
  Download,
  Copy,
  Check,
  X,
  FileCode,
  Shield,
  FileSpreadsheet
} from 'lucide-react';

interface TranscriptExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  segments: TranslationSegment[];
  sourceLang: Language;
  targetLang: Language;
}

export const TranscriptExportModal: React.FC<TranscriptExportModalProps> = ({
  isOpen,
  onClose,
  segments,
  sourceLang,
  targetLang
}) => {
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleExportPDF = () => {
    exportTranscriptToPDF(
      'LinguaLive Real-Time Conversation Transcript',
      sourceLang.code,
      targetLang.code,
      segments
    );
  };

  const handleExportMarkdown = () => {
    const md = exportTranscriptToMarkdown(
      'LinguaLive Transcript',
      sourceLang.code,
      targetLang.code,
      segments
    );
    downloadTextFile(`LinguaLive_Transcript_${Date.now()}.md`, md, 'text/markdown');
  };

  const handleExportJSON = () => {
    const jsonStr = JSON.stringify(
      {
        app: 'LinguaLive',
        version: '1.0',
        exportedAt: new Date().toISOString(),
        languages: {
          source: sourceLang,
          target: targetLang
        },
        segmentCount: segments.length,
        segments
      },
      null,
      2
    );
    downloadTextFile(`LinguaLive_Transcript_${Date.now()}.json`, jsonStr, 'application/json');
  };

  const handleExportTXT = () => {
    const lines = segments
      .map(
        (s, i) =>
          `[${s.timestamp}] ${s.speaker === 'speaker_a' ? 'Speaker A' : 'Speaker B'}:\nOriginal: ${s.originalText}\nTranslation: ${s.translatedText}\n`
      )
      .join('\n');
    downloadTextFile(`LinguaLive_Transcript_${Date.now()}.txt`, lines, 'text/plain');
  };

  const handleCopyMarkdown = () => {
    const md = exportTranscriptToMarkdown(
      'LinguaLive Transcript',
      sourceLang.code,
      targetLang.code,
      segments
    );
    navigator.clipboard.writeText(md);
    setCopiedFormat('md');
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  return (
    <div
      id="export-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        id="export-modal"
        className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[85vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Export Conversation Transcript</h2>
              <p className="text-xs text-slate-500">
                {segments.length} segment{segments.length === 1 ? '' : 's'} recorded • Encrypted session
              </p>
            </div>
          </div>
          <button
            id="close-export-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formats Grid */}
        <div className="p-5 space-y-3 flex-1 overflow-y-auto">
          {/* PDF Format */}
          <button
            id="export-format-pdf-btn"
            onClick={handleExportPDF}
            className="w-full p-4 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200 hover:border-indigo-300 flex items-center justify-between transition-all group text-left shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-900 group-hover:text-indigo-700 tracking-tight">
                  Formatted PDF Document (.pdf)
                </div>
                <div className="text-xs text-slate-500 font-normal leading-normal">
                  Professional two-tone meeting & conversation summary with timestamps
                </div>
              </div>
            </div>
            <Download className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 shrink-0" />
          </button>

          {/* Markdown Format */}
          <button
            id="export-format-md-btn"
            onClick={handleExportMarkdown}
            className="w-full p-4 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200 hover:border-indigo-300 flex items-center justify-between transition-all group text-left shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                <FileCode className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-900 group-hover:text-indigo-700 tracking-tight">
                  Markdown File (.md)
                </div>
                <div className="text-xs text-slate-500 font-normal leading-normal">
                  Perfect for Notion, Obsidian, GitHub docs, or email notes
                </div>
              </div>
            </div>
            <Download className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 shrink-0" />
          </button>

          {/* Plain Text Format */}
          <button
            id="export-format-txt-btn"
            onClick={handleExportTXT}
            className="w-full p-4 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200 hover:border-indigo-300 flex items-center justify-between transition-all group text-left shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-900 group-hover:text-indigo-700 tracking-tight">
                  Plain Text File (.txt)
                </div>
                <div className="text-xs text-slate-500 font-normal leading-normal">
                  Lightweight chronological transcript for any text editor
                </div>
              </div>
            </div>
            <Download className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 shrink-0" />
          </button>

          {/* JSON Structured Format */}
          <button
            id="export-format-json-btn"
            onClick={handleExportJSON}
            className="w-full p-4 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200 hover:border-indigo-300 flex items-center justify-between transition-all group text-left shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
                <FileCode className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-900 group-hover:text-indigo-700 tracking-tight">
                  Developer JSON Payload (.json)
                </div>
                <div className="text-xs text-slate-500 font-normal leading-normal">
                  Full segment objects with latency benchmarks and metadata
                </div>
              </div>
            </div>
            <Download className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 shrink-0" />
          </button>
        </div>

        {/* Footer & Clipboard Action */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <button
            id="copy-transcript-to-clipboard-btn"
            onClick={handleCopyMarkdown}
            className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            {copiedFormat === 'md' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-600">Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy to Clipboard</span>
              </>
            )}
          </button>

          <button
            id="done-export-modal-btn"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
