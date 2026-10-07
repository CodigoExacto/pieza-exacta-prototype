/**
 * Builds a printable consultation report from chat messages.
 */

const labels = {
  uk: {
    title: 'Pieza Exacta — звіт консультації',
    kicker: 'Фіксація розмови з ШІ-консультантом · PiezaExacta',
    badge: 'Макет · дані з консультації',
    number: 'Номер',
    date: 'Дата',
    generated: 'Сформовано',
    placeholder: 'Зміст звіту буде доповнено. Це чернетка для скачування.',
    summary: 'Підсумок',
    partNumbers: 'Номери запчастин',
    description: 'Опис',
    context: 'Контекст консультації',
    products: 'Знайдені пропозиції на Avto.pro',
    vehicle: 'Автомобіль',
    seller: 'Продавець',
    availability: 'Наявність',
    city: 'Місто',
    price: 'Ціна',
    openProduct: 'Відкрити товар на Avto.pro',
    empty: 'Поки немає даних',
    filePrefix: 'pieza-exacta-zvit',
  },
  es: {
    title: 'Pieza Exacta — informe de consulta',
    kicker: 'Registro de la conversación con el consultor IA · PiezaExacta',
    badge: 'Maquetación · datos de la consulta',
    number: 'Número',
    date: 'Fecha',
    generated: 'Generado',
    placeholder: 'El contenido del informe se completará más adelante. Esto es un borrador descargable.',
    summary: 'Resumen',
    partNumbers: 'Números de pieza',
    description: 'Descripción',
    context: 'Contexto de la consulta',
    products: 'Ofertas encontradas en Avto.pro',
    vehicle: 'Vehículo',
    seller: 'Vendedor',
    availability: 'Disponibilidad',
    city: 'Ciudad',
    price: 'Precio',
    openProduct: 'Ver producto en Avto.pro',
    empty: 'Aún no hay datos',
    filePrefix: 'pieza-exacta-informe',
  },
  en: {
    title: 'Pieza Exacta — consultation report',
    kicker: 'Record of the conversation with the AI consultant · PiezaExacta',
    badge: 'Layout · consultation data',
    number: 'Number',
    date: 'Date',
    generated: 'Generated',
    placeholder: 'Report contents will be completed later. This is a downloadable draft.',
    summary: 'Summary',
    partNumbers: 'Part numbers',
    description: 'Description',
    context: 'Consultation context',
    products: 'Avto.pro offers found',
    vehicle: 'Vehicle',
    seller: 'Seller',
    availability: 'Availability',
    city: 'City',
    price: 'Price',
    openProduct: 'Open product on Avto.pro',
    empty: 'No data yet',
    filePrefix: 'pieza-exacta-report',
  },
};

function unique(values) {
  return [...new Set(values.map((value) => String(value).trim()).filter(Boolean))];
}

export function buildConsultationReport({ messages = [], locale = 'es' } = {}) {
  const copy = labels[locale] || labels.es;
  const assistantMessages = messages.filter((item) => item.role === 'assistant' && item.result);
  const assistant = [...assistantMessages].reverse()[0];
  const result = assistant?.result || {};
  const cardsResult = [...assistantMessages].reverse().find((item) => item.result.cards?.length)?.result;
  const marketplace = locale === 'es' ? 'avtopro.es' : 'avtopro.ua';
  const cards = (cardsResult?.cards || []).filter((card) => {
    try {
      const url = new URL(card.url);
      return url.protocol === 'https:' && (url.hostname === marketplace || url.hostname.endsWith(`.${marketplace}`));
    } catch {
      return false;
    }
  });
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
    cards,
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

function sectionHtml(index, title, body, emptyLabel) {
  const text = String(body || '').trim() || emptyLabel;
  return `<div class="step">
    <span class="step-n">[${index}]</span>
    <strong>${escapeHtml(title)}</strong>
    <p>${escapeHtml(text)}</p>
  </div>`;
}

function productCardsHtml(cards = [], copy, locale) {
  const marketplace = locale === 'es' ? 'avtopro.es' : 'avtopro.ua';
  const products = cards.filter((card) => {
    try {
      const url = new URL(card.url);
      return url.protocol === 'https:' && (url.hostname === marketplace || url.hostname.endsWith(`.${marketplace}`));
    } catch {
      return false;
    }
  });
  if (!products.length) return '';
  return `<section class="products">${products.map((card) => {
    const details = [
      card.vehicle && `<p><b>${escapeHtml(copy.vehicle)}:</b> ${escapeHtml(card.vehicle)}</p>`,
      card.seller && `<p><b>${escapeHtml(copy.seller)}:</b> ${escapeHtml(card.seller)}</p>`,
      card.availability && `<p><b>${escapeHtml(copy.availability)}:</b> ${escapeHtml(card.availability)}</p>`,
      card.city && `<p><b>${escapeHtml(copy.city)}:</b> ${escapeHtml(card.city)}</p>`,
      (card.price || card.oldPrice) && `<p><b>${escapeHtml(copy.price)}:</b> ${card.oldPrice ? `<del>${escapeHtml(card.oldPrice)}${card.currency ? ` ${escapeHtml(card.currency)}` : ''}</del> ` : ''}${card.price ? `<strong>${escapeHtml(card.price)}${card.currency ? ` ${escapeHtml(card.currency)}` : ''}</strong>` : ''}</p>`,
      card.oem?.length && `<p><b>OEM:</b> ${escapeHtml(card.oem.join(' · '))}</p>`,
    ].filter(Boolean).join('');
    const image = (() => {
      try {
        const url = new URL(card.imageUrl);
        return url.protocol === 'https:' && (url.hostname === marketplace || url.hostname.endsWith(`.${marketplace}`))
          ? `<img src="${escapeHtml(url.href)}" alt="${escapeHtml(card.title || '')}" />`
          : '';
      } catch { return ''; }
    })();
    return `<article class="product-card">${image}<div class="product-info"><h3>${escapeHtml(card.title || card.partNumber || 'Avto.pro')}</h3>${card.brand ? `<p class="brand-name">${escapeHtml(card.brand)}</p>` : ''}${card.partNumber ? `<p class="part-number">${escapeHtml(card.partNumber)}</p>` : ''}${details}<a href="${escapeHtml(card.url)}">${escapeHtml(copy.openProduct)} ↗</a></div></article>`;
  }).join('')}</section>`;
}

export function renderConsultationReportHtml(report, { origin = '' } = {}) {
  const copy = report.labels || labels.es;
  const generatedAt = report.generatedAt ? new Date(report.generatedAt) : new Date();
  const localeTag = report.locale === 'uk' ? 'uk-UA' : report.locale === 'en' ? 'en-GB' : 'es-ES';
  const generatedDate = generatedAt.toLocaleDateString(localeTag);
  const generatedTime = generatedAt.toLocaleString(localeTag);
  const parts = report.partNumbers?.length ? report.partNumbers.join(' · ') : '';
  const stamp = (report.generatedAt || generatedAt.toISOString()).slice(0, 10);
  const docId = `${copy.filePrefix}-${stamp}`;
  const fontLatin = origin ? `${origin}/images/wix-latin.woff2` : '';
  const fontCyr = origin ? `${origin}/images/wix-cyrillic.woff2` : '';
  const logo = origin ? `${origin}/images/logo.svg` : '';
  const disk = origin ? `${origin}/images/Disk.png` : '';
  const titleParts = String(report.title || '').split(' — ');
  const titleHtml = titleParts.length > 1
    ? `${escapeHtml(titleParts[0])} — <b>${escapeHtml(titleParts.slice(1).join(' — '))}</b>`
    : escapeHtml(report.title);
  return `<!DOCTYPE html>
<html lang="${escapeHtml(report.locale || 'es')}">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(report.title)}</title>
  <style>
    ${fontLatin ? `@font-face { font-family: "Wix Madefor Display"; src: url("${fontLatin}") format("woff2"); font-weight: 400 800; unicode-range: U+0000-00FF; }` : ''}
    ${fontCyr ? `@font-face { font-family: "Wix Madefor Display"; src: url("${fontCyr}") format("woff2"); font-weight: 400 800; unicode-range: U+0400-045F, U+0490-0491; }` : ''}
    * { box-sizing: border-box; }
    html, body { margin: 0; }
    body {
      color: #17191b;
      background: #111315;
      font-family: "Wix Madefor Display", Arial, sans-serif;
      line-height: 1.5;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .page {
      min-height: 100vh;
      padding: 28px 20px 36px;
    }
    .topbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      max-width: 760px;
      margin: 0 auto 16px;
      color: #c0c3c5;
      font-size: 11px;
      font-weight: 700;
    }
    .topbar img { height: 22px; width: auto; filter: brightness(0) invert(1); }
    .sheet {
      max-width: 760px;
      margin: 0 auto;
      padding: 28px 28px 24px;
      border-radius: 24px;
      background: #e8ebef;
    }
    .hero {
      display: grid;
      grid-template-columns: minmax(0, 1fr) 148px;
      gap: 18px;
      align-items: start;
      margin-bottom: 18px;
    }
    .kicker {
      margin: 0 0 10px;
      color: #555a5f;
      font-size: 13px;
      font-weight: 600;
      line-height: 1.35;
    }
    h1 {
      margin: 0;
      font-size: 40px;
      line-height: 1.05;
      letter-spacing: -1.2px;
      font-weight: 400;
    }
    h1 b { font-weight: 800; }
    .disk {
      width: 148px;
      height: 148px;
      object-fit: contain;
      filter: drop-shadow(0 10px 18px rgba(15, 23, 42, 0.22));
    }
    .pills {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin: 0 0 22px;
    }
    .pills span {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 7px 12px;
      border-radius: 999px;
      background: #fff;
      color: #555a5f;
      font-size: 11px;
      font-weight: 700;
    }
    .pills b { color: #111; font-weight: 800; }
    .summary {
      margin: 0 0 22px;
      color: #3d4248;
      font-size: 14px;
      line-height: 1.65;
      white-space: pre-wrap;
      overflow-wrap: anywhere;
    }
    .summary-label {
      margin: 0 0 8px;
      color: #555a5f;
      font-size: 12px;
      font-weight: 700;
    }
    .steps { border-top: 1px solid rgba(76, 81, 86, 0.16); }
    .step {
      display: grid;
      grid-template-columns: 42px minmax(110px, 0.7fr) minmax(0, 1.4fr);
      gap: 12px;
      align-items: start;
      padding: 12px 0;
      border-bottom: 1px solid rgba(76, 81, 86, 0.16);
    }
    .step-n { color: #767c81; font-size: 12px; font-weight: 700; }
    .step strong { font-size: 13px; font-weight: 800; }
    .step p {
      margin: 0;
      color: #3d4248;
      font-size: 13px;
      white-space: pre-wrap;
      overflow-wrap: anywhere;
    }
    .products { margin-top: 16px; display: grid; gap: 10px; }
    .product-card {
      display: flex;
      gap: 14px;
      align-items: flex-start;
      break-inside: avoid;
      padding: 12px;
      border-radius: 14px;
      background: #fff;
    }
    .product-card img {
      width: 72px;
      height: 72px;
      flex: none;
      object-fit: contain;
      border-radius: 8px;
      background: #f4f5f6;
    }
    .product-info { min-width: 0; flex: 1; }
    .product-info h3 { margin: 0; font-size: 14px; font-weight: 800; }
    .product-info p { margin: 3px 0; font-size: 11px; color: #555a5f; }
    .product-info a {
      display: inline-block;
      margin-top: 8px;
      padding: 6px 10px;
      border-radius: 999px;
      background: #111;
      color: #fff;
      font-size: 10px;
      font-weight: 800;
      text-decoration: none;
    }
    .result {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      margin-top: 18px;
      padding: 14px 16px;
      border-radius: 16px;
      background: #111;
      color: #fff;
    }
    .result strong { font-size: 14px; }
    .result span {
      padding: 6px 10px;
      border-radius: 999px;
      background: #fff;
      color: #111;
      font-size: 11px;
      font-weight: 800;
    }
    .note {
      margin: 14px 0 0;
      color: #767c81;
      font-size: 10px;
      line-height: 1.45;
    }
    @page { size: A4; margin: 10mm; }
    @media print {
      .page { padding: 0; }
      .topbar { color: #555a5f; }
      .topbar img { filter: none; }
    }
    @media (max-width: 640px) {
      .hero { grid-template-columns: 1fr; }
      .disk { width: 110px; height: 110px; }
      .step { grid-template-columns: 36px 1fr; }
      .step p { grid-column: 1 / -1; padding-left: 36px; }
    }
  </style>
</head>
<body>
  <div class="page">
    <div class="topbar">
      ${logo ? `<img src="${escapeHtml(logo)}" alt="Pieza Exacta" />` : '<span>PiezaExacta</span>'}
      <span>${escapeHtml(copy.badge)}</span>
    </div>
    <div class="sheet">
      <div class="hero">
        <div>
          <h1>${titleHtml}</h1>
          <p class="kicker">${escapeHtml(copy.kicker)}</p>
        </div>
        ${disk ? `<img class="disk" src="${escapeHtml(disk)}" alt="" />` : ''}
      </div>
      <div class="pills">
        <span>${escapeHtml(copy.number)} <b>${escapeHtml(docId)}</b></span>
        <span>${escapeHtml(copy.date)} <b>${escapeHtml(generatedDate)}</b></span>
        <span>${escapeHtml(copy.generated)} <b>${escapeHtml(generatedTime)}</b></span>
      </div>
      <p class="summary-label">${escapeHtml(copy.summary)}</p>
      <p class="summary">${escapeHtml(String(report.summary || '').trim() || copy.empty)}</p>
      <div class="steps">
        ${sectionHtml(1, copy.partNumbers, parts, copy.empty)}
        ${sectionHtml(2, copy.description, report.description, copy.empty)}
        ${sectionHtml(3, copy.context, report.context, copy.empty)}
      </div>
      ${productCardsHtml(report.cards, copy, report.locale)}
      <div class="result">
        <strong>${escapeHtml(copy.title)}</strong>
        <span>${escapeHtml(docId)}</span>
      </div>
      <p class="note">${escapeHtml(report.placeholder)}</p>
    </div>
  </div>
</body>
</html>`;
}

export function downloadConsultationReport(report) {
  const copy = report.labels || labels.es;
  const html = renderConsultationReportHtml(report, { origin: window.location.origin });
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
