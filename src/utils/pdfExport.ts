import { jsPDF } from 'jspdf';
import { TranslationSegment } from '../types';
import { getLanguage } from '../data/languages';

export function exportTranscriptToPDF(
  title: string,
  sourceLang: string,
  targetLang: string,
  segments: TranslationSegment[]
) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const sourceLangObj = getLanguage(sourceLang);
  const targetLangObj = getLanguage(targetLang);

  // Header background
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, 210, 38, 'F');

  // Title & Brand
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('LinguaLive — Real-Time Translation Transcript', 14, 18);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184); // slate-400
  const dateStr = new Date().toLocaleString();
  doc.text(`Generated: ${dateStr} • Pair: ${sourceLangObj.name} (${sourceLang.toUpperCase()}) ⇄ ${targetLangObj.name} (${targetLang.toUpperCase()})`, 14, 28);

  let y = 50;
  const pageHeight = doc.internal.pageSize.height;

  if (segments.length === 0) {
    doc.setTextColor(100, 116, 139);
    doc.setFontSize(12);
    doc.text('No conversation segments recorded in this session.', 14, y);
    doc.save(`LinguaLive_Transcript_${Date.now()}.pdf`);
    return;
  }

  segments.forEach((seg, index) => {
    // Check page overflow
    if (y > pageHeight - 35) {
      doc.addPage();
      y = 20;
    }

    const isSpeakerA = seg.speaker === 'speaker_a';
    const speakerLabel = isSpeakerA
      ? `Speaker A [${getLanguage(seg.sourceLang).name}]`
      : `Speaker B [${getLanguage(seg.sourceLang).name}]`;

    // Speaker tag box
    doc.setFillColor(isSpeakerA ? 238 : 241, isSpeakerA ? 242 : 245, isSpeakerA ? 255 : 249);
    doc.rect(14, y - 4, 182, 7, 'F');

    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(isSpeakerA ? 79 : 13, isSpeakerA ? 70 : 148, isSpeakerA ? 229 : 136);
    doc.text(`${index + 1}. ${speakerLabel} • ${seg.timestamp} • Tone: ${seg.tone || 'standard'}`, 16, y + 1);

    y += 8;

    // Original Text
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42); // slate-900
    const originalLines = doc.splitTextToSize(`Original: "${seg.originalText}"`, 175);
    doc.text(originalLines, 16, y);
    y += originalLines.length * 5;

    // Translated Text
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(37, 99, 235); // blue-600
    const translatedLines = doc.splitTextToSize(`Translated: "${seg.translatedText}"`, 175);
    doc.text(translatedLines, 16, y);
    y += translatedLines.length * 5;

    if (seg.romanization) {
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text(`Pronunciation: ${seg.romanization}`, 16, y);
      y += 5;
    }

    y += 6; // Spacing between messages
  });

  // Footer on current page
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text('LinguaLive Secure Conversation Transcript • End-to-End Encrypted Session', 14, pageHeight - 10);

  doc.save(`LinguaLive_Transcript_${sourceLang}_${targetLang}_${new Date().toISOString().slice(0, 10)}.pdf`);
}

export function exportTranscriptToMarkdown(
  title: string,
  sourceLang: string,
  targetLang: string,
  segments: TranslationSegment[]
): string {
  const dateStr = new Date().toLocaleString();
  let md = `# LinguaLive Conversation Transcript\n\n`;
  md += `- **Date:** ${dateStr}\n`;
  md += `- **Languages:** ${getLanguage(sourceLang).name} (${sourceLang.toUpperCase()}) ⇄ ${getLanguage(targetLang).name} (${targetLang.toUpperCase()})\n`;
  md += `- **Total Segments:** ${segments.length}\n\n`;
  md += `---\n\n`;

  segments.forEach((seg, idx) => {
    const isSpeakerA = seg.speaker === 'speaker_a';
    const speaker = isSpeakerA ? 'Speaker A' : 'Speaker B';
    const lang = getLanguage(seg.sourceLang).name;
    const target = getLanguage(seg.targetLang).name;

    md += `### ${idx + 1}. ${speaker} (${lang} ➔ ${target})\n`;
    md += `*Time: ${seg.timestamp} | Tone: ${seg.tone || 'standard'}*\n\n`;
    md += `> **Original:** ${seg.originalText}\n\n`;
    md += `> **Translation:** ${seg.translatedText}\n\n`;
    if (seg.romanization) {
      md += `*Pronunciation Guide:* \`${seg.romanization}\`\n\n`;
    }
    md += `\n`;
  });

  return md;
}

export function downloadTextFile(filename: string, content: string, mimeType = 'text/plain') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
