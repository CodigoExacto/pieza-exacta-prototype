"use client";

import { useEffect, useState } from "react";

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

export default function Home() {
  const [locale, setLocale] = useState("es");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [theme, setTheme] = useState("light");
  const [themeReady, setThemeReady] = useState(false);

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

  const c = copy[locale] || copy.es;

  async function send(event) {
    event.preventDefault();
    const message = input.trim();
    if (!message || busy) return;
    const history = messages
      .filter((x) => x.role === "user" || x.role === "assistant")
      .map((x) => ({
        role: x.role,
        text: x.role === "user" ? x.text : x.result?.answer || "",
      }));
    setMessages((prev) => [...prev, { role: "user", text: message }]);
    setInput("");
    setBusy(true);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 100000);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({ message, history, locale }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error("Request unavailable");
      setMessages((prev) => [...prev, { role: "assistant", result: data }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "error",
          text: c.timeout,
        },
      ]);
    } finally {
      clearTimeout(timeout);
      setBusy(false);
    }
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
                onClick={() => setLocale(x)}
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
            <button
              type="button"
              onClick={() => setMessages([])}
              className="new-chat"
            >
              ＋ {c.newChat}
            </button>
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
                        {item.text}
                      </div>
                    ) : item.role === "error" ? (
                      <div className="message error" key={index}>
                        {item.text}
                      </div>
                    ) : (
                      <div className="assistant-response" key={index}>
                        <div className="answer-mark">PE</div>
                        <div className="response-body">
                          <p>{item.result.answer}</p>
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
                          {item.result.sources?.length > 0 && (
                            <details className="sources">
                              <summary>
                                {c.sources} ({item.result.sources.length})
                              </summary>
                              {item.result.sources.map((source, i) => (
                                <a
                                  key={i}
                                  href={source.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {source.title || source.url} ↗
                                </a>
                              ))}
                            </details>
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
                <div className="composer">
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
                    placeholder={c.placeholder}
                    rows={2}
                  />
                  <button type="submit" disabled={busy || !input.trim()}>
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
