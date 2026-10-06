/**
 * Builds a consultation report from chat messages.
 * Edit section mapping here when the report contents are agreed.
 * Swap downloadConsultationReport later if a real PDF layout is needed.
 */

const labels = {
  uk: {
    title: 'Pieza Exacta — звіт консультації',
    generated: 'Сформовано',
    placeholder: 'Зміст звіту буде доповнено. Це чернетка для скачування.',
    summary: 'Підсумок',
    partNumbers: 'Номери запчастин',
    description: 'Опис',
    context: 'Контекст консультації',
    empty: 'Поки немає даних',
    filePrefix: 'pieza-exacta-zvit',
  },
  es: {
    title: 'Pieza Exacta — informe de consulta',
    generated: 'Generado',
    placeholder: 'El contenido del informe se completará más adelante. Esto es un borrador descargable.',
    summary: 'Resumen',
    partNumbers: 'Números de pieza',
    description: 'Descripción',
    context: 'Contexto de la consulta',
    empty: 'Aún no hay datos',
    filePrefix: 'pieza-exacta-informe',
  },
  en: {
    title: 'Pieza Exacta — consultation report',
    generated: 'Generated',
    placeholder: 'Report contents will be completed later. This is a downloadable draft.',
    summary: 'Summary',
    partNumbers: 'Part numbers',
    description: 'Description',
    context: 'Consultation context',
    empty: 'No data yet',
    filePrefix: 'pieza-exacta-report',
  },
};

function unique(values) {
  return [...new Set(values.map((value) => String(value).trim()).filter(Boolean))];
}

export function buildConsultationReport({ messages = [], locale = 'es' } = {}) {
  const copy = labels[locale] || labels.es;
  const assistant = [...messages].reverse().find((item) => item.role === 'assistant' && item.result);
  const result = assistant?.result || {};
  const partNumbers = unique([
    ...(result.oem || []),
    ...(result.cards || []).flatMap((card) => [card.partNumber, ...(card.oem || [])]),
  ]);
  const description = result.cards?.[0]
    ? [result.cards[0].title, result.cards[0].brand, result.cards[0].evidence].filter(Boolean).join(' — ')
    : '';
  const context = messages
    .filter((item) => item.role === 'user' && item.text)
    .map((item) => item.text)
    .slice(-4)
    .join(' · ');

  return {
    locale: copy === labels[locale] ? locale : 'es',
    title: copy.title,
    generatedAt: new Date().toISOString(),
    placeholder: copy.placeholder,
    summary: result.answer || '',
    partNumbers,
    description,
    context,
    labels: copy,
  };
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function sectionHtml(title, body, emptyLabel) {
  const text = String(body || '').trim() || emptyLabel;
  return `<section><h2>${escapeHtml(title)}</h2><p>${escapeHtml(text)}</p></section>`;
}

export function renderConsultationReportHtml(report) {
  const copy = report.labels || labels.es;
  const generated = report.generatedAt ? new Date(report.generatedAt).toLocaleString() : '';
  const parts = report.partNumbers?.length ? report.partNumbers.join(' · ') : '';
  return `<!DOCTYPE html>
<html lang="${escapeHtml(report.locale || 'es')}">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(report.title)}</title>
  <style>
    body { font-family: Georgia, "Times New Roman", serif; max-width: 720px; margin: 40px auto; color: #1a1f2e; line-height: 1.45; }
    h1 { font-size: 22px; }
    h2 { font-size: 14px; text-transform: uppercase; letter-spacing: 0.06em; color: #1044cb; }
    p { white-space: pre-wrap; }
    .meta, .note { color: #5b6475; font-size: 13px; }
    @media print { body { margin: 16px; } }
  </style>
</head>
<body>
  <h1>${escapeHtml(report.title)}</h1>
  <p class="meta">${escapeHtml(copy.generated)}: ${escapeHtml(generated)}</p>
  <p class="note">${escapeHtml(report.placeholder)}</p>
  ${sectionHtml(copy.summary, report.summary, copy.empty)}
  ${sectionHtml(copy.partNumbers, parts, copy.empty)}
  ${sectionHtml(copy.description, report.description, copy.empty)}
  ${sectionHtml(copy.context, report.context, copy.empty)}
</body>
</html>`;
}

export function downloadConsultationReport(report) {
  const copy = report.labels || labels.es;
  const html = renderConsultationReportHtml(report);
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const stamp = (report.generatedAt || new Date().toISOString()).slice(0, 10);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${copy.filePrefix}-${stamp}.html`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
