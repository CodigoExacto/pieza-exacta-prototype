/**
 * Builds a printable consultation report from chat messages.
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
    * { box-sizing: border-box; }
    body { font-family: Arial, "Noto Sans", sans-serif; max-width: 760px; margin: 48px auto; padding: 0 30px; color: #1a1c1e; line-height: 1.55; }
    header { border-bottom: 2px solid #25292c; padding-bottom: 18px; margin-bottom: 28px; }
    .brand { margin: 0 0 8px; color: #565c60; font-size: 11px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; }
    h1 { margin: 0; font-size: 26px; line-height: 1.2; }
    h2 { margin: 26px 0 8px; font-size: 12px; letter-spacing: .08em; text-transform: uppercase; }
    section { break-inside: avoid; }
    p { margin: 0; white-space: pre-wrap; overflow-wrap: anywhere; font-size: 14px; }
    .meta, .note { margin-top: 9px; color: #62686c; font-size: 11px; }
    .note { padding: 12px 14px; background: #f0f1f2; border-radius: 8px; }
    @page { size: A4; margin: 18mm 16mm; }
    @media print { body { max-width: none; margin: 0; padding: 0; } }
  </style>
</head>
<body>
  <header>
    <p class="brand">Pieza Exacta</p>
    <h1>${escapeHtml(report.title)}</h1>
    <p class="meta">${escapeHtml(copy.generated)}: ${escapeHtml(generated)}</p>
  </header>
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
  const reportWindow = window.open('', '_blank');
  if (!reportWindow) {
    window.alert(report.locale === 'uk'
      ? 'Дозвольте відкривати спливаючі вікна, щоб зберегти звіт у PDF.'
      : report.locale === 'en'
        ? 'Allow pop-ups to save the report as a PDF.'
        : 'Permite las ventanas emergentes para guardar el informe como PDF.');
    return;
  }
  reportWindow.document.open();
  reportWindow.document.write(html);
  reportWindow.document.close();
  const stamp = (report.generatedAt || new Date().toISOString()).slice(0, 10);
  reportWindow.document.title = `${copy.filePrefix}-${stamp}`;
  reportWindow.focus();
  reportWindow.setTimeout(() => {
    if (!reportWindow.closed) reportWindow.print();
  }, 300);
}
