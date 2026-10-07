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

function sectionHtml(title, body, emptyLabel) {
  const text = String(body || '').trim() || emptyLabel;
  return `<section><h2>${escapeHtml(title)}</h2><p>${escapeHtml(text)}</p></section>`;
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
  return `<section class="products"><h2>${escapeHtml(copy.products)}</h2>${products.map((card) => {
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
    .product-card { display: flex; gap: 16px; align-items: flex-start; break-inside: avoid; margin: 12px 0; padding: 14px; border: 1px solid #d7dadd; border-radius: 10px; background: #fff; }
    .product-card img { width: 82px; height: 82px; flex: none; object-fit: contain; border: 1px solid #e1e3e5; border-radius: 8px; background: #f4f5f6; }
    .product-info { min-width: 0; flex: 1; }
    .product-info h3 { margin: 0; font-size: 15px; }
    .product-info p { margin: 3px 0; font-size: 11px; }
    .product-info .brand-name, .product-info .part-number { color: #62686c; }
    .product-info a { display: inline-block; margin-top: 8px; color: #202427; font-size: 12px; font-weight: 700; }
    .product-info del { color: #7a8084; }
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
  ${productCardsHtml(report.cards, copy, report.locale)}
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
