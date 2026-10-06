const prompts = {
  uk: {
    vin: 'Для точного підбору цієї запчастини надішліть VIN автомобіля.',
    registration: 'Якщо VIN не надаєте, введіть іспанський номерний знак у форматі 1234 ABC.',
    country: 'Введіть іспанський номерний знак у форматі 1234 ABC.',
    details: 'Якщо не надаєте VIN або реєстраційний номер, вкажіть марку, модель, рік випуску та двигун (обʼєм, тип пального і код двигуна, якщо знаєте).',
  },
  es: {
    vin: 'Para identificar la pieza con precisión, indica el VIN del vehículo.',
    registration: 'Si no quieres facilitar el VIN, introduce la matrícula española con el formato 1234 ABC.',
    country: 'Introduce la matrícula española con el formato 1234 ABC.',
    details: 'Si no facilitas el VIN ni la matrícula, indica marca, modelo, año de fabricación y motor (cilindrada, combustible y código de motor si lo conoces).',
  },
  en: {
    vin: 'For an accurate parts match, please provide the vehicle VIN.',
    registration: 'If you prefer not to provide the VIN, enter the Spanish registration plate in the format 1234 ABC.',
    country: 'Enter the Spanish registration plate in the format 1234 ABC.',
    details: 'If you do not provide a VIN or registration plate, please provide the make, model, production year and engine (displacement, fuel type and engine code if known).',
  },
};

const knownMakes = /(?<![\p{L}\p{N}])(?:mercedes(?:-benz)?|mecdes|bmw|audi|volkswagen|vw|toyota|ford|opel|vauxhall|renault|peugeot|citro[eë]n|skoda|seat|fiat|nissan|honda|hyundai|kia|mazda|volvo|subaru|mitsubishi|lexus|porsche|land rover|jaguar|mini|dacia|suzuki|tesla|jeep|dodge|chevrolet|chrysler|alfa romeo|iveco|man|scania|daf|volksvagen|фольксваген|мерседес|тойота|рено|пежо|сітроен|шкода|форд|опель|ауді|бмв)(?![\p{L}\p{N}])/iu;
const plausiblePlate = /\b(?=[A-ZА-ЯІЇЄҐ0-9-]{5,12}\b)(?=[A-ZА-ЯІЇЄҐ0-9-]*\d)(?=[A-ZА-ЯІЇЄҐ0-9-]*[A-ZА-ЯІЇЄҐ])[A-ZА-ЯІЇЄҐ0-9-]+\b/iu;
const spanishPlate = /(?<![\p{L}\p{N}])\d{4}\s?[BCDFGHJKLMNPRSTVWXYZ]{3}(?![\p{L}\p{N}])/iu;

function findVin(text) {
  return text.match(/\b[A-HJ-NPR-Z0-9]{17}\b/iu)?.[0] || null;
}

function hasFallbackDetails(text) {
  const make = knownMakes.exec(text);
  const model = make && text.slice(make.index + make[0].length).match(/^\s+([\p{L}\p{N}-]+)/u)?.[1];
  const hasMakeAndModel = Boolean(make && model && !/^(?:19|20)\d{2}$/.test(model));
  const hasYear = /\b(?:19[5-9]\d|20[0-3]\d)\b/u.test(text);
  const hasEngine = /\b(?:\d[.,]\d{1,2}\s?(?:l|л)?|[A-Z]{1,3}\d{2,4}[A-Z]?|TDI|TSI|TFSI|CDI|HDI|D-4D|дизел[ья]|бензин|diesel|petrol|gasoline|gas[oó]leo|gasolina)\b/iu.test(text);
  return hasMakeAndModel && hasYear && hasEngine;
}

export function getPartsIntake({ message, history, locale }) {
  const previous = [...history].reverse().find(item => item.role === 'assistant' && item.intakeStep)?.intakeStep;
  const userText = [...history.filter(item => item.role === 'user').map(item => item.text), message].join(' ');
  const response = step => ({ answer: prompts[locale]?.[step] || prompts.uk[step], followUp: '', oem: [], alternatives: [], cards: [], sources: [], intakeStep: step });

  const hasVin = Boolean(findVin(userText));
  if (hasVin) {
    // Once a valid VIN has been provided, never return to the opt-out prompt.
    // Let the model search/decode again or ask targeted follow-up questions.
    return null;
  }

  if (!knownMakes.test(userText) && /\b(?:OEM|OE)\s*[:#-]?\s*[A-Z0-9 -]{5,}\b/iu.test(message)) return null;

  if (spanishPlate.test(message)) return null;
  if (previous === 'registration' || previous === 'country') {
    if (plausiblePlate.test(message)) return response('registration');
    return hasFallbackDetails(userText) ? null : response('details');
  }
  if (previous === 'details') return hasFallbackDetails(userText) ? null : response('details');
  if (previous === 'vin') return response('registration');
  if (previous === 'registration' || previous === 'country' || previous === 'details') return response('details');
  return response('vin');
}
