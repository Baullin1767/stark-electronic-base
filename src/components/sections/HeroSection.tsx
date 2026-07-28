import {
  ArrowDown,
  AudioLines,
  Check,
  CloudUpload,
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
        <div className="floating-note note-storage">
          <span className="storage-note-icons" aria-hidden="true">
            <CloudUpload size={16} />
            <FileSpreadsheet size={16} />
          </span>
          Google Диск + Excel
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
          <div className="hero-chat-feed">
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
              <span className="hero-gpt-label">
                <Sparkles size={13} /> GPT
              </span>
              <p className="ai-summary">
                Нашёл Анну Петрову. Последний визит — обработка ногтевой
                пластины. Следующий приём запланирован через две недели.
              </p>
            </div>
            <div className="assistant-message user-message secondary-message">
              <span className="audio-play">▶</span>
              <div className="wave mini-wave" aria-hidden="true">
                {Array.from({ length: 13 }, (_, index) => (
                  <i key={index} style={{ height: `${9 + (index % 4) * 4}px` }} />
                ))}
              </div>
              <small>0:12</small>
            </div>
            <div className="assistant-message ai-message compact">
              <span className="hero-gpt-label">
                <Sparkles size={13} /> GPT
              </span>
              <p className="ai-summary">
                Понял. Добавил рекомендацию и напоминание перед следующим
                визитом.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
