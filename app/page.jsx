"use client";

import { useEffect, useRef, useState } from "react";
import { buildConsultationReport, downloadConsultationReport } from "../lib/consultationReport";

const copy = {
  es: {
    org: "Organización sin ánimo de lucro",
    about: "Sobre nosotros",
    resources: "Centro de información",
    contact: "Contactos",
    eyebrow: "CENTRO DE INFORMACIÓN · PIEZA EXACTA",
    title: "Información clara para encontrar la pieza adecuada.",
    subtitle:
      "Consulta referencias originales, equivalencias y fuentes antes de decidir. Nuestro asistente te ayuda a ordenar la información técnica.",
    transparency: "Fuentes visibles",
    compatibility: "Compatibilidad explicada",
    alternativesLabel: "Equivalencias documentadas",
    chatTitle: "Asistente de recambios",
    chatSub: "Describe el vehículo y la pieza que necesitas",
    newChat: "Nueva consulta",
    emptyTitle: "¿Qué recambio necesitas?",
    emptyText:
      "Incluye marca, modelo, año, motor y, si lo tienes, el número OEM o VIN.",
    example1: "Pastillas delanteras BMW E46 316i 2001",
    example2: "Sensor de temperatura Audi A4 B8 2.0 TDI",
    example3: "Equivalencias OEM 34111165556",
    inputLabel: "Tu consulta",
    placeholder: "Escribe tu pregunta sobre una pieza o un número OEM…",
    send: "Buscar pieza",
    sourceLink: "Consultar fuente",
    loading: "Procesando tu consulta",
    sources: "Fuentes consultadas",
    original: "OEM",
    analogues: "Equivalencias",
    unknown: "Compatibilidad sin confirmar",
    possible: "Compatibilidad posible",
    verified: "Compatibilidad documentada",
    note: "Información orientativa. Confirma la referencia y la configuración exacta con documentación técnica.",
    timeout: "Ahora no puedo procesar tu consulta. ¿Quieres intentarlo más tarde?",
    section: "01 / ASISTENTE",
    imageAlt: "Automóvil",
    privacy: "Política de privacidad",
    darkTheme: "Activar tema oscuro",
    lightTheme: "Activar tema claro",
    vinPlaceholder: "Introduce el VIN (17 caracteres)",
    vinConfirm: "Confirmar VIN",
    vinReject: "Rechazar",
    vinInvalid: "El VIN debe tener 17 caracteres y no incluir I, O ni Q.",
    platePlaceholder: "1234 ABC",
    plateLabel: "Matrícula española",
    plateConfirm: "Confirmar matrícula",
    plateReject: "Rechazar",
    plateInvalid: "Introduce una matrícula española válida, por ejemplo 1234 ABC.",
    attachPhoto: "Adjuntar foto",
    removePhoto: "Quitar foto",
    photoTooLarge: "La imagen debe pesar menos de 4 MB.",
    photoType: "Usa JPEG, PNG o WebP.",
    startVoice: "Dictar",
    stopVoice: "Detener dictado",
    voiceUnsupported: "El dictado está disponible en Chrome o Edge.",
    voiceBlocked: "Permite el micrófono para dictar.",
    listening: "Escuchando…",
    generateReport: "Generar informe",
    expertTitle: "Revisión por un experto",
    expertDescription: "Si quieres, podemos enviar esta consulta a un experto para que revise el vehículo y la pieza.",
    expertPhone: "Tu número de WhatsApp",
    expertPhonePlaceholder: "+34 600 000 000",
    expertConsent: "Acepto compartir mi número y los datos de esta consulta para su revisión por un experto.",
    expertSubmit: "Enviar solicitud",
    expertPhoneInvalid: "Introduce un número de teléfono.",
    expertConsentRequired: "Confirma que aceptas compartir estos datos.",
    expertAccepted: "Solicitud aceptada para su revisión. Te enviaremos el resultado al número indicado.",
  },
  uk: {
    org: "Некомерційна організація",
    about: "Про нас",
    resources: "Інформаційний центр",
    contact: "Контакти",
    eyebrow: "ІНФОРМАЦІЙНИЙ ЦЕНТР · PIEZA EXACTA",
    title: "Зрозумілі дані, щоб знайти потрібну деталь.",
    subtitle:
      "Звіряйте оригінальні номери, аналоги й джерела перед вибором. Помічник упорядкує технічну інформацію.",
    transparency: "Видимі джерела",
    compatibility: "Пояснення сумісності",
    alternativesLabel: "Підтверджені аналоги",
    chatTitle: "Помічник із запчастин",
    chatSub: "Опишіть авто й потрібну деталь",
    newChat: "Новий запит",
    emptyTitle: "Яку запчастину ви шукаєте?",
    emptyText:
      "Укажіть марку, модель, рік, двигун і, якщо є, номер OEM або VIN.",
    example1: "Передні колодки BMW E46 316i 2001",
    example2: "Датчик температури Audi A4 B8 2.0 TDI",
    example3: "Аналоги OEM 34111165556",
    inputLabel: "Ваш запит",
    placeholder: "Запитайте про деталь або номер OEM…",
    send: "Знайти деталь",
    sourceLink: "Переглянути джерело",
    loading: "Обробляю ваш запит",
    sources: "Переглянуті джерела",
    original: "OEM",
    analogues: "Аналоги",
    unknown: "Сумісність не підтверджена",
    possible: "Імовірна сумісність",
    verified: "Сумісність підтверджена джерелом",
    note: "Дані мають інформаційний характер. Звіряйте номер і комплектацію з технічною документацією.",
    timeout: "Зараз не можу обробити ваш запит. Бажаєте спробувати пізніше?",
    section: "01 / ПОМІЧНИК",
    imageAlt: "Автомобіль",
    privacy: "Політика конфіденційності",
    darkTheme: "Увімкнути темну тему",
    lightTheme: "Увімкнути світлу тему",
    vinPlaceholder: "Введіть VIN (17 символів)",
    vinConfirm: "Підтвердити",
    vinReject: "Відхилити",
    vinInvalid: "VIN має містити 17 символів без літер I, O та Q.",
    platePlaceholder: "1234 ABC",
    plateLabel: "Іспанський номерний знак",
    plateConfirm: "Підтвердити",
    plateReject: "Відхилити",
    plateInvalid: "Введіть коректний номер іспанського зразка, наприклад 1234 ABC.",
    attachPhoto: "Додати фото",
    removePhoto: "Прибрати фото",
    photoTooLarge: "Зображення має бути до 4 МБ.",
    photoType: "Потрібен JPEG, PNG або WebP.",
    startVoice: "Диктувати",
    stopVoice: "Зупинити диктант",
    voiceUnsupported: "Диктант доступний у Chrome або Edge.",
    voiceBlocked: "Дозвольте мікрофон, щоб диктувати.",
    listening: "Слухаю…",
    generateReport: "Сформувати звіт",
    expertTitle: "Перевірка експертом",
    expertDescription: "За бажанням передамо цей запит експерту, щоб він перевірив автомобіль і запчастину.",
    expertPhone: "Ваш номер WhatsApp",
    expertPhonePlaceholder: "+34 600 000 000",
    expertConsent: "Погоджуюся передати експерту мій номер і дані цього запиту для перевірки.",
    expertSubmit: "Надіслати запит",
    expertPhoneInvalid: "Введіть номер телефону.",
    expertConsentRequired: "Підтвердьте згоду на передавання цих даних.",
    expertAccepted: "Запит прийнято на обробку. Результат надішлють на вказаний номер.",
  },
  en: {
    org: "Non-profit organisation",
    about: "About us",
    resources: "Information centre",
    contact: "Contact",
    eyebrow: "INFORMATION CENTRE · PIEZA EXACTA",
    title: "Clear information to find the right part.",
    subtitle:
      "Check original numbers, alternatives and sources before deciding. Our assistant helps organise the technical details.",
    transparency: "Visible sources",
    compatibility: "Explained fitment",
    alternativesLabel: "Documented alternatives",
    chatTitle: "Parts assistant",
    chatSub: "Describe the vehicle and part you need",
    newChat: "New inquiry",
    emptyTitle: "What part do you need?",
    emptyText:
      "Include the make, model, year, engine and, if available, the OEM number or VIN.",
    example1: "Front pads BMW E46 316i 2001",
    example2: "Temperature sensor Audi A4 B8 2.0 TDI",
    example3: "OEM 34111165556 alternatives",
    inputLabel: "Your inquiry",
    placeholder: "Ask about a part or OEM number…",
    send: "Find part",
    sourceLink: "View source",
    loading: "Processing your request",
    sources: "Sources consulted",
    original: "OEM",
    analogues: "Alternatives",
    unknown: "Fitment unconfirmed",
    possible: "Possible fitment",
    verified: "Fitment documented",
    note: "For information only. Confirm the reference and exact vehicle configuration against technical documentation.",
    timeout: "I cannot process your request right now. Would you like to try again later?",
    section: "01 / ASSISTANT",
    imageAlt: "Car",
    privacy: "Privacy policy",
    darkTheme: "Switch to dark theme",
    lightTheme: "Switch to light theme",
    vinPlaceholder: "Enter VIN (17 characters)",
    vinConfirm: "Confirm VIN",
    vinReject: "Decline",
    vinInvalid: "VIN must contain 17 characters and exclude I, O and Q.",
    platePlaceholder: "1234 ABC",
    plateLabel: "Spanish registration plate",
    plateConfirm: "Confirm plate",
    plateReject: "Decline",
    plateInvalid: "Enter a valid Spanish plate, for example 1234 ABC.",
    attachPhoto: "Attach photo",
    removePhoto: "Remove photo",
    photoTooLarge: "The image must be under 4 MB.",
    photoType: "Use JPEG, PNG or WebP.",
    startVoice: "Dictate",
    stopVoice: "Stop dictation",
    voiceUnsupported: "Dictation is available in Chrome or Edge.",
    voiceBlocked: "Allow the microphone to dictate.",
    listening: "Listening…",
    generateReport: "Generate report",
    expertTitle: "Expert review",
    expertDescription: "If you like, we can send this request to an expert to review the vehicle and part.",
    expertPhone: "Your WhatsApp number",
    expertPhonePlaceholder: "+34 600 000 000",
    expertConsent: "I agree to share my phone number and request details for expert review.",
    expertSubmit: "Submit request",
    expertPhoneInvalid: "Enter a phone number.",
    expertConsentRequired: "Confirm that you agree to share these details.",
    expertAccepted: "Request accepted for review. The result will be sent to the number provided.",
  },
};

function getSaved(key, fallback) {
  const value = localStorage.getItem(key);
  if (value == null) return fallback;
  try {
    return JSON.parse(value) ?? fallback;
  } catch {
    return value;
  }
}

const allowedPhotoTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function loadHtmlImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("image"));
    image.src = src;
  });
}

async function preparePhoto(file) {
  if (!allowedPhotoTypes.has(file.type)) return { error: "type" };
  if (file.size > 4 * 1024 * 1024) return { error: "size" };
  const original = await fileToDataUrl(file);
  const image = await loadHtmlImage(original);
  const maxEdge = 1280;
  const scale = Math.min(1, maxEdge / Math.max(image.width, image.height));
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) return { mimeType: file.type, dataUrl: original };
  context.drawImage(image, 0, 0, width, height);
  const dataUrl = canvas.toDataURL("image/jpeg", 0.82);
  return { mimeType: "image/jpeg", dataUrl };
}

const speechLocale = { es: "es-ES", uk: "uk-UA", en: "en-US" };

function getSpeechRecognition() {
  if (typeof window === "undefined") return null;
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

function MicIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M6 11a6 6 0 0 0 12 0M12 17v4M9 21h6" />
    </svg>
  );
}

function PartCard({ card, c }) {
  return (
    <article className="part-card">
      <div className="part-card-top">
        <span className="part-brand">{card.brand || "Avto.pro"}</span>
        <span className={`fitment ${card.fitment}`}>
          {c[card.fitment] || c.unknown}
        </span>
      </div>
      <h3>{card.title}</h3>
      <div className="part-code">{card.partNumber}</div>
      {card.oem?.length > 0 && (
        <div className="part-meta">
          <b>{c.original}</b>
          <span>{card.oem.join(" · ")}</span>
        </div>
      )}
      <p className="evidence">{card.evidence}</p>
      <div className="part-card-bottom">
        <a
          className="source-button"
          href={card.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {c.sourceLink} <span aria-hidden="true">↗</span>
        </a>
      </div>
    </article>
  );
}

function ExpertHandoffForm({ c, phone, setPhone, consent, setConsent, error, onSubmit }) {
  return (
    <form className="expert-form" onSubmit={onSubmit}>
      <h3>{c.expertTitle}</h3>
      <p>{c.expertDescription}</p>
      <label className="expert-phone-label" htmlFor="expert-phone">{c.expertPhone}</label>
      <input
        id="expert-phone"
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        value={phone}
        onChange={(event) => setPhone(event.target.value)}
        placeholder={c.expertPhonePlaceholder}
        aria-invalid={Boolean(error)}
      />
      <label className="expert-consent">
        <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} />
        <span>{c.expertConsent}</span>
      </label>
      {error && <span className="vin-error" role="alert">{error}</span>}
      <button type="submit">{c.expertSubmit}</button>
    </form>
  );
}

export default function Home() {
  const [locale, setLocale] = useState("es");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [vinInput, setVinInput] = useState("");
  const [vinError, setVinError] = useState("");
  const [plateInput, setPlateInput] = useState("");
  const [plateError, setPlateError] = useState("");
  const [busy, setBusy] = useState(false);
  const [theme, setTheme] = useState("light");
  const [themeReady, setThemeReady] = useState(false);
  const [pendingPhoto, setPendingPhoto] = useState(null);
  const [photoError, setPhotoError] = useState("");
  const [listening, setListening] = useState(false);
  const [voiceError, setVoiceError] = useState("");
  const [expertPhone, setExpertPhone] = useState("");
  const [expertConsent, setExpertConsent] = useState(false);
  const [expertError, setExpertError] = useState("");
  const [submittedExpertRequests, setSubmittedExpertRequests] = useState(() => new Set());
  const photoInputRef = useRef(null);
  const recognitionRef = useRef(null);
  const dictationPrefixRef = useRef("");

  useEffect(() => {
    const savedLocale = getSaved("pe-lang", "es");
    setLocale(copy[savedLocale] ? savedLocale : "es");
    const savedTheme = getSaved("pe-theme", "light");
    setTheme(savedTheme === "dark" ? "dark" : "light");
    setThemeReady(true);
  }, []);
  useEffect(() => {
    localStorage.setItem("pe-lang", JSON.stringify(locale));
    document.documentElement.lang = locale;
    document.title = `Pieza Exacta — ${copy[locale]?.chatTitle || copy.es.chatTitle}`;
  }, [locale]);
  useEffect(() => {
    if (!themeReady) return;
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("pe-theme", theme);
  }, [theme, themeReady]);

  function stopDictation() {
    const recognition = recognitionRef.current;
    if (recognition) {
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;
      try {
        recognition.stop();
      } catch {
        /* already stopped */
      }
      recognitionRef.current = null;
    }
    setListening(false);
  }

  useEffect(() => () => stopDictation(), []);
  useEffect(() => {
    stopDictation();
    setMessages([]);
    setInput("");
    setVinInput("");
    setVinError("");
    setPlateInput("");
    setPlateError("");
    setPendingPhoto(null);
    setPhotoError("");
    setVoiceError("");
    setExpertPhone("");
    setExpertConsent(false);
    setExpertError("");
    setSubmittedExpertRequests(new Set());
  }, [locale]);
  useEffect(() => {
    if (busy) stopDictation();
  }, [busy]);

  const c = copy[locale] || copy.es;

  async function submitMessage(rawMessage, photo = null) {
    const message = rawMessage.trim();
    if ((!message && !photo) || busy) return;
    stopDictation();
    setVoiceError("");
    setExpertError("");
    const history = messages
      .filter((x) => x.role === "user" || x.role === "assistant")
      .map((x) => ({
        role: x.role,
        text: x.role === "user" ? x.text : x.result?.answer || "",
        intakeStep: x.role === "assistant" ? x.result?.intakeStep : undefined,
      }));
    const historyText = message || (locale === "uk" ? "Фото" : locale === "es" ? "Foto" : "Photo");
    setMessages((prev) => [...prev, { role: "user", text: historyText, imageUrl: photo?.dataUrl }]);
    setInput("");
    setVinInput("");
    setVinError("");
    setPlateInput("");
    setPlateError("");
    setPendingPhoto(null);
    setPhotoError("");
    setBusy(true);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 100000);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          message,
          history,
          locale,
          ...(photo ? { image: photo.dataUrl } : {}),
        }),
      });
      const data = await response.json();
      if (!response.ok && data.expertHandoff) {
        setMessages((prev) => [...prev, { role: "assistant", result: { answer: data.error || c.timeout, expertHandoff: true } }]);
        return;
      }
      if (!response.ok) throw new Error(data.error || "Request unavailable");
      setMessages((prev) => [...prev, { role: "assistant", result: data }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "error",
          text: c.timeout,
          expertHandoff: true,
        },
      ]);
    } finally {
      clearTimeout(timeout);
      setBusy(false);
    }
  }

  function send(event) {
    event.preventDefault();
    submitMessage(input, pendingPhoto);
  }

  async function onPhotoSelected(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    try {
      const prepared = await preparePhoto(file);
      if (prepared.error === "type") {
        setPhotoError(c.photoType);
        return;
      }
      if (prepared.error === "size") {
        setPhotoError(c.photoTooLarge);
        return;
      }
      setPendingPhoto(prepared);
      setPhotoError("");
    } catch {
      setPhotoError(c.photoType);
    }
  }

  function toggleDictation() {
    if (busy) return;
    if (listening) {
      stopDictation();
      return;
    }
    const SpeechRecognition = getSpeechRecognition();
    if (!SpeechRecognition) {
      setVoiceError(c.voiceUnsupported);
      return;
    }
    setVoiceError("");
    dictationPrefixRef.current = input.trim() ? `${input.trim()} ` : "";
    const recognition = new SpeechRecognition();
    recognition.lang = speechLocale[locale] || "es-ES";
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.onresult = (event) => {
      let spoken = "";
      for (let i = 0; i < event.results.length; i += 1) {
        spoken += event.results[i][0].transcript;
      }
      setInput(`${dictationPrefixRef.current}${spoken}`.replace(/\s+/g, " ").trimStart());
    };
    recognition.onerror = (event) => {
      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        setVoiceError(c.voiceBlocked);
      } else if (event.error === "audio-capture") {
        setVoiceError(c.voiceBlocked);
      }
      stopDictation();
    };
    recognition.onend = () => {
      recognitionRef.current = null;
      setListening(false);
    };
    recognitionRef.current = recognition;
    try {
      recognition.start();
      setListening(true);
    } catch {
      setVoiceError(c.voiceUnsupported);
      recognitionRef.current = null;
    }
  }

  function confirmVin(event) {
    event.preventDefault();
    const value = vinInput.trim().toUpperCase();
    if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(value)) {
      setVinError(c.vinInvalid);
      return;
    }
    submitMessage(value);
  }

  function rejectVin() {
    const refusal = locale === "uk" ? "Не хочу надавати VIN" : locale === "es" ? "Prefiero no facilitar el VIN" : "I prefer not to provide the VIN";
    submitMessage(refusal);
  }

  function confirmPlate(event) {
    event.preventDefault();
    const value = plateInput.toUpperCase();
    if (!/^\d{4}[BCDFGHJKLMNPRSTVWXYZ]{3}$/.test(value)) {
      setPlateError(c.plateInvalid);
      return;
    }
    submitMessage(`${value} ES`);
  }

  function rejectPlate() {
    const refusal = locale === "uk" ? "Не хочу надавати номер реєстрації" : locale === "es" ? "Prefiero no facilitar la matrícula" : "I prefer not to provide the registration plate";
    submitMessage(refusal);
  }

  function requestExpertReview(event, requestIndex) {
    event.preventDefault();
    setExpertError("");
    const phone = expertPhone.trim();
    if (!phone) {
      setExpertError(c.expertPhoneInvalid);
      return;
    }
    if (!expertConsent) {
      setExpertError(c.expertConsentRequired);
      return;
    }
    setSubmittedExpertRequests((current) => new Set(current).add(requestIndex));
    setMessages((current) => [...current, { role: "notice", text: c.expertAccepted }]);
    setExpertPhone("");
    setExpertConsent(false);
  }

  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="header-inner">
          <a className="identity" href="/" aria-label="Pieza Exacta">
            <img src="/images/logo.svg" alt="Pieza Exacta" />
            <span>{c.org}</span>
          </a>
          <nav className="site-nav" aria-label="Pieza Exacta">
            <a href="https://piezaexacta.es/about/">{c.about}</a>
            <a href="https://piezaexacta.es/blog/">{c.resources}</a>
            <a href="https://piezaexacta.es/contacts/">{c.contact}</a>
          </nav>
          <div className="language-menu" aria-label="Language">
            {["es", "uk", "en"].map((x) => (
              <button
                key={x}
                type="button"
                className={locale === x ? "active" : ""}
                aria-pressed={locale === x}
                onClick={() => {
                  if (locale !== x && !busy) setLocale(x);
                }}
                disabled={busy && locale !== x}
              >
                {x === "uk" ? "УКР" : x.toUpperCase()}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="theme-toggle"
            aria-label={theme === "dark" ? c.lightTheme : c.darkTheme}
            title={theme === "dark" ? c.lightTheme : c.darkTheme}
            aria-pressed={theme === "dark"}
            onClick={() =>
              setTheme((current) => (current === "dark" ? "light" : "dark"))
            }
          >
            {theme === "dark" ? (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M20.1 15.6A8.5 8.5 0 0 1 8.4 3.9 8.5 8.5 0 1 0 20.1 15.6Z" />
              </svg>
            )}
          </button>
        </div>
      </header>

      <main className="experience-layout">
        <section className="intro-section">
          <div className="intro-copy">
            <div className="eyebrow">
              <span></span>
              {c.eyebrow}
            </div>
            <h1>{c.title}</h1>
            <p>{c.subtitle}</p>
          </div>
          <div className="intro-image" role="img" aria-label={c.imageAlt}>
            <div className="image-caption">
              PiezaExacta <span>·</span> {c.resources}
            </div>
          </div>
          <div className="trust-points">
            <span>✓ {c.transparency}</span>
            <span>✓ {c.compatibility}</span>
            <span>✓ {c.alternativesLabel}</span>
          </div>
        </section>

        <section className="workspace">
          <div className="workspace-heading">
            <div>
              <div className="section-kicker">{c.section}</div>
              <h2>{c.chatTitle}</h2>
              <p>{c.chatSub}</p>
            </div>
            <div className="workspace-actions">
              <button
                type="button"
                className="report-btn"
                disabled={!messages.some((item) => item.role === "assistant")}
                onClick={() => {
                  const report = buildConsultationReport({ messages, locale });
                  downloadConsultationReport(report);
                }}
              >
                {c.generateReport}
              </button>
              <button
                type="button"
                className="new-chat"
                onClick={() => {
                  stopDictation();
                  setMessages([]);
                  setPendingPhoto(null);
                  setPhotoError("");
                  setVoiceError("");
                  setExpertPhone("");
                  setExpertConsent(false);
                  setExpertError("");
                  setSubmittedExpertRequests(new Set());
                }}
              >
                ＋ {c.newChat}
              </button>
            </div>
          </div>

          <div className="workspace-grid">
            <section className="chat-panel" aria-label={c.chatTitle}>
              <div className="chat-header">
                <div className="assistant-avatar">PE</div>
                <div>
                  <strong>PiezaExacta</strong>
                  <small>{c.chatTitle}</small>
                </div>
                <div className="status-dot" aria-hidden="true" />
              </div>
              <div className="chat-scroll">
                <div className="chat-content">
                  {messages.length === 0 && (
                    <div className="empty-chat">
                      <div className="empty-icon">
                        <span>⌕</span>
                      </div>
                      <h3>{c.emptyTitle}</h3>
                      <p>{c.emptyText}</p>
                      <div className="suggestions">
                        {[c.example1, c.example2, c.example3].map((x) => (
                          <p key={x}>{x}</p>
                        ))}
                      </div>
                    </div>
                  )}
                  {messages.map((item, index) =>
                    item.role === "user" ? (
                      <div className="message user" key={index}>
                        {item.imageUrl && (
                          <img className="chat-photo" src={item.imageUrl} alt="" />
                        )}
                        {item.text}
                      </div>
                    ) : item.role === "notice" ? (
                      <div className="assistant-response" key={index}>
                        <div className="answer-mark">PE</div>
                        <div className="response-body">
                          <p>{item.text}</p>
                        </div>
                      </div>
                    ) : item.role === "error" ? (
                      <div className="assistant-response" key={index}>
                        <div className="answer-mark">PE</div>
                        <div className="response-body">
                          <p>{item.text}</p>
                          {item.expertHandoff && !submittedExpertRequests.has(index) && (
                            <ExpertHandoffForm
                              c={c}
                              phone={expertPhone}
                              setPhone={setExpertPhone}
                              consent={expertConsent}
                              setConsent={setExpertConsent}
                              error={expertError}
                              onSubmit={(event) => requestExpertReview(event, index)}
                            />
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="assistant-response" key={index}>
                        <div className="answer-mark">PE</div>
                        <div className="response-body">
                          <p>{item.result.answer}</p>
                          {item.result.intakeStep === "vin" && index === messages.length - 1 && (
                            <form className="vin-form" onSubmit={confirmVin}>
                              <label className="visually-hidden" htmlFor="vin-input">{c.vinPlaceholder}</label>
                              <input
                                id="vin-input"
                                type="text"
                                value={vinInput}
                                onChange={(event) => {
                                  setVinInput(event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 17));
                                  setVinError("");
                                }}
                                placeholder={c.vinPlaceholder}
                                minLength={17}
                                maxLength={17}
                                autoComplete="off"
                                aria-invalid={Boolean(vinError)}
                                aria-describedby={vinError ? "vin-error" : undefined}
                                disabled={busy}
                              />
                              {vinError && <span id="vin-error" className="vin-error" role="alert">{vinError}</span>}
                              <div className="vin-actions">
                                <button type="submit" disabled={busy}>{c.vinConfirm}</button>
                                <button type="button" className="vin-reject" onClick={rejectVin} disabled={busy}>{c.vinReject}</button>
                              </div>
                            </form>
                          )}
                          {item.result.intakeStep === "registration" && index === messages.length - 1 && (
                            <form className="vin-form plate-form" onSubmit={confirmPlate}>
                              <label className="visually-hidden" htmlFor="plate-input">{c.plateLabel}</label>
                              <div className={`spanish-plate ${plateError ? "invalid" : ""}`}>
                                <div className="plate-country" aria-hidden="true">
                                  <span aria-hidden="true">✦ ✦<br />✦ ✦ ✦<br />✦ ✦</span>
                                  <b>E</b>
                                </div>
                                <input
                                  id="plate-input"
                                  type="text"
                                  value={plateInput.length > 4 ? `${plateInput.slice(0, 4)} ${plateInput.slice(4)}` : plateInput}
                                  onChange={(event) => {
                                    setPlateInput(event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 7));
                                    setPlateError("");
                                  }}
                                  placeholder={c.platePlaceholder}
                                  maxLength={8}
                                  autoComplete="off"
                                  aria-invalid={Boolean(plateError)}
                                  aria-describedby={plateError ? "plate-error" : undefined}
                                  disabled={busy}
                                />
                              </div>
                              {plateError && <span id="plate-error" className="vin-error" role="alert">{plateError}</span>}
                              <div className="vin-actions">
                                <button type="submit" disabled={busy}>{c.plateConfirm}</button>
                                <button type="button" className="vin-reject" onClick={rejectPlate} disabled={busy}>{c.plateReject}</button>
                              </div>
                            </form>
                          )}
                          {item.result.followUp && (
                            <p className="follow-up">{item.result.followUp}</p>
                          )}
                          {item.result.oem?.length > 0 && (
                            <div className="meta-line">
                              <b>{c.original}</b>
                              <span>{item.result.oem.join(" · ")}</span>
                            </div>
                          )}
                          {item.result.alternatives?.length > 0 && (
                            <div className="meta-line">
                              <b>{c.analogues}</b>
                              <span>
                                {item.result.alternatives.join(" · ")}
                              </span>
                            </div>
                          )}
                          {item.result.cards?.map((card, i) => (
                            <PartCard key={i} card={card} c={c} />
                          ))}
                          {item.result.expertHandoff && !submittedExpertRequests.has(index) && (
                            <ExpertHandoffForm
                              c={c}
                              phone={expertPhone}
                              setPhone={setExpertPhone}
                              consent={expertConsent}
                              setConsent={setExpertConsent}
                              error={expertError}
                              onSubmit={(event) => requestExpertReview(event, index)}
                            />
                          )}
                        </div>
                      </div>
                    ),
                  )}
                  {busy && (
                    <div className="thinking">
                      <span className="spinner" />
                      {c.loading}
                    </div>
                  )}
                </div>
              </div>
              <form className="composer-wrap" onSubmit={send}>
                <label htmlFor="chat-input">{c.inputLabel}</label>
                {pendingPhoto && (
                  <div className="photo-preview">
                    <img src={pendingPhoto.dataUrl} alt="" />
                    <button type="button" onClick={() => setPendingPhoto(null)}>
                      {c.removePhoto}
                    </button>
                  </div>
                )}
                {photoError && (
                  <p className="photo-error" role="alert">{photoError}</p>
                )}
                {voiceError && (
                  <p className="photo-error" role="alert">{voiceError}</p>
                )}
                {listening && !voiceError && (
                  <p className="voice-status">{c.listening}</p>
                )}
                <div className="composer">
                  <input
                    ref={photoInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="visually-hidden"
                    onChange={onPhotoSelected}
                    tabIndex={-1}
                  />
                  <button
                    type="button"
                    className="attach-btn"
                    aria-label={c.attachPhoto}
                    title={c.attachPhoto}
                    disabled={busy}
                    onClick={() => photoInputRef.current?.click()}
                  >
                    +
                  </button>
                  <button
                    type="button"
                    className={`mic-btn${listening ? " listening" : ""}`}
                    aria-label={listening ? c.stopVoice : c.startVoice}
                    title={listening ? c.stopVoice : c.startVoice}
                    aria-pressed={listening}
                    disabled={busy}
                    onClick={toggleDictation}
                  >
                    <MicIcon />
                  </button>
                  <textarea
                    id="chat-input"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        e.currentTarget.form.requestSubmit();
                      }
                    }}
                    placeholder={listening ? c.listening : c.placeholder}
                    rows={2}
                  />
                  <button type="submit" className="send-btn" disabled={busy || (!input.trim() && !pendingPhoto)}>
                    {c.send} <span aria-hidden="true">↗</span>
                  </button>
                </div>
                <p>{c.note}</p>
              </form>
            </section>
          </div>
        </section>
      </main>
      <footer className="site-footer">
        <span>© 2026 Digital Transparency Hub “Pieza Exacta”</span>
        <a href="https://piezaexacta.es/privacy-policy/">{c.privacy} ↗</a>
      </footer>
    </div>
  );
}
