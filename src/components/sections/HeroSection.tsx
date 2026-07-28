import {
  ArrowDown,
  AudioLines,
  Check,
  FileSpreadsheet,
  MessageCircleMore,
  Sparkles,
} from "lucide-react";

export function HeroSection() {
  return (
    <section className="hero section-shell" id="top">
      <div className="hero-copy">
        <div className="eyebrow">
          <span className="eyebrow-dot" />
          Клиентская база без лишней рутины
        </div>
        <h1>
          Клиентская база, которую можно вести{" "}
          <span>обычным голосом</span>
        </h1>
        <p className="hero-lead">
          Расскажите о новом клиенте, процедуре и рекомендациях. Система
          подготовит структурированную запись — вам останется только проверить.
        </p>
        <div className="hero-actions">
          <a className="button button-primary" href="#demo">
            Посмотреть, как это работает
            <ArrowDown size={18} aria-hidden="true" />
          </a>
          <a className="button button-secondary" href="#contact">
            Обсудить подключение
          </a>
        </div>
        <ul className="hero-trust" aria-label="Ключевые свойства">
          <li>
            <Check size={15} /> Под вашим контролем
          </li>
          <li>
            <Check size={15} /> Настройка под профессию
          </li>
        </ul>
      </div>

      <div className="hero-visual" aria-label="Схема работы сервиса">
        <div className="hero-glow" />
        <div className="floating-note note-one">
          <AudioLines size={17} />
          Голосовая заметка
        </div>
        <div className="floating-note note-two">
          <Sparkles size={17} />
          Данные разобраны
        </div>
        <div className="assistant-card">
          <div className="assistant-card-head">
            <div className="assistant-icon">
              <MessageCircleMore size={22} />
            </div>
            <div>
              <strong>Stark Assistant</strong>
              <span>
                <i /> Готов к работе
              </span>
            </div>
            <span className="online-label">online</span>
          </div>
          <div className="assistant-message user-message">
            <span className="audio-play">▶</span>
            <div className="wave mini-wave" aria-hidden="true">
              {Array.from({ length: 18 }, (_, index) => (
                <i key={index} style={{ height: `${10 + (index % 5) * 4}px` }} />
              ))}
            </div>
            <small>0:38</small>
          </div>
          <div className="assistant-message ai-message">
            <span className="message-kicker">Данные подготовлены</span>
            <p className="ai-summary">
              <strong>Анна Сергеевна Петрова.</strong> Особенность — болезненность
              большого пальца правой стопы. Последний визит: обработка ногтевой
              пластины. Следующий визит через две недели.
            </p>
            <button type="button">
              <Check size={15} /> Сохранить в Excel
            </button>
          </div>
        </div>
        <div className="database-pill">
          <FileSpreadsheet size={19} />
          <span>
            Excel обновлён
            <small>Листы «Клиенты» и «Визиты»</small>
          </span>
          <Check size={15} />
        </div>
      </div>
    </section>
  );
}
