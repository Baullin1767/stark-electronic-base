"use client";

import Image from "next/image";
import {
  ArrowUpRight,
  Check,
  CirclePause,
  Database,
  ImageIcon,
  Mic2,
  Paperclip,
  Search,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DEMO_CLIENT, DEMO_STEPS } from "@/lib/constants";
import { trackEvent } from "@/lib/analytics";
import type { DemoStepId } from "@/types/demo";

gsap.registerPlugin(ScrollTrigger);

const transcript =
  "Новый клиент: Анна Сергеевна Петрова, последние цифры телефона — 4821. Сегодня первое обращение. Проведена обработка ногтевой пластины и бокового валика. Рекомендована ежедневная обработка и свободная обувь.";

const processingCopy: Partial<Record<DemoStepId, string[]>> = {
  "message-sent": [
    "Анализирую сообщение…",
    "Проверяю структуру данных…",
    "Подготавливаю карточку клиента…",
  ],
  "processing-client": [
    "Имя и контакт определены",
    "Процедура структурирована",
    "Рекомендации добавлены",
  ],
  saving: [
    "Создаю карточку клиента…",
    "Сохраняю посещение…",
    "Связываю фотографии…",
  ],
  "search-processing": [
    "Ищу клиента в базе…",
    "Проверяю историю посещений…",
    "Формирую краткую сводку…",
  ],
};

function ChatShell({
  children,
  status = "Готов к работе",
}: {
  children: React.ReactNode;
  status?: string;
}) {
  return (
    <div className="demo-window chat-window">
      <div className="window-head">
        <div className="window-avatar">
          <Sparkles size={18} />
        </div>
        <div>
          <strong>Stark Assistant</strong>
          <small>
            <i /> {status}
          </small>
        </div>
        <span className="window-dots">•••</span>
      </div>
      <div className="chat-body">{children}</div>
      <div className="chat-input" aria-hidden="true">
        <Paperclip size={18} />
        <span>Сообщение для ассистента…</span>
        <Mic2 size={18} />
        <b>
          <Send size={16} />
        </b>
      </div>
    </div>
  );
}

function VoiceRecorder() {
  return (
    <div className="voice-recorder">
      <button type="button" aria-label="Отменить запись">
        <X size={17} />
      </button>
      <div className="wave" aria-hidden="true">
        {Array.from({ length: 29 }, (_, index) => (
          <i
            key={index}
            style={{
              height: `${8 + ((index * 7) % 23)}px`,
              animationDelay: `${index * -0.04}s`,
            }}
          />
        ))}
      </div>
      <time>00:38</time>
      <CirclePause size={23} />
      <span>
        <Send size={16} />
      </span>
    </div>
  );
}

function Attachments() {
  return (
    <div className="demo-attachments">
      {[
        ["/images/demo/before.webp", "До процедуры"],
        ["/images/demo/after.webp", "После процедуры"],
      ].map(([src, label]) => (
        <figure key={src}>
          <Image src={src} alt={label} fill sizes="220px" />
          <figcaption>
            <ImageIcon size={14} /> {label}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

function ClientCard({ result = false }: { result?: boolean }) {
  return (
    <div className={`client-preview ${result ? "search-card" : ""}`}>
      <div className="client-preview-head">
        <div>
          <span>{result ? "Найден один клиент" : "Новая запись"}</span>
          <strong>{DEMO_CLIENT.fullName}</strong>
        </div>
        <span className="client-id">ID 00482</span>
      </div>
      <dl>
        <div>
          <dt>Телефон</dt>
          <dd>{DEMO_CLIENT.phone}</dd>
        </div>
        <div>
          <dt>{result ? "Последнее посещение" : "Дата обращения"}</dt>
          <dd>{DEMO_CLIENT.date}</dd>
        </div>
        <div>
          <dt>Проведено</dt>
          <dd>{DEMO_CLIENT.procedure}</dd>
        </div>
        <div>
          <dt>Рекомендации</dt>
          <dd>{DEMO_CLIENT.recommendation}</dd>
        </div>
        <div>
          <dt>Следующий визит</dt>
          <dd>{DEMO_CLIENT.nextVisit}</dd>
        </div>
      </dl>
      {!result && (
        <div className="preview-actions">
          <button type="button">
            <Check size={15} /> Подтвердить
          </button>
          <button type="button">Изменить</button>
          <button type="button">Отменить</button>
        </div>
      )}
    </div>
  );
}

function Processing({ step }: { step: DemoStepId }) {
  const items = processingCopy[step] ?? [];
  return (
    <div className="processing-list">
      <span className="thinking">
        <i />
        <i />
        <i />
      </span>
      {items.map((item, index) => (
        <p key={item} className={index < items.length - 1 ? "done" : "active"}>
          {index < items.length - 1 ? <Check size={14} /> : <Sparkles size={14} />}
          {item}
        </p>
      ))}
    </div>
  );
}

function DatabaseView({ step }: { step: DemoStepId }) {
  if (step === "visit-details") {
    return (
      <div className="demo-window database-window visit-card">
        <div className="database-head">
          <span>
            <Database size={17} /> Посещение №V-1208
          </span>
          <button type="button">Открыть карточку</button>
        </div>
        <ClientCard result />
        <Attachments />
      </div>
    );
  }

  const visits = step === "visits-table";
  return (
    <div className="demo-window database-window">
      <div className="database-head">
        <span>
          <Database size={17} /> Stark Base
        </span>
        <div>
          <button className={!visits ? "active" : ""} type="button">
            Клиенты
          </button>
          <button className={visits ? "active" : ""} type="button">
            Посещения
          </button>
        </div>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Клиент</th>
              <th>Дата</th>
              <th>{visits ? "Процедура" : "Телефон"}</th>
              <th>Статус</th>
            </tr>
          </thead>
          <tbody>
            <tr className="new-row">
              <td>{visits ? "V-1208" : "00482"}</td>
              <td>{DEMO_CLIENT.fullName}</td>
              <td>{DEMO_CLIENT.date}</td>
              <td>{visits ? "Обработка ногтевой…" : DEMO_CLIENT.phone}</td>
              <td>
                <span className="status-chip">Активен</span>
              </td>
            </tr>
            <tr>
              <td>{visits ? "V-1207" : "00481"}</td>
              <td>Марина Алексеева</td>
              <td>26 июля 2026</td>
              <td>{visits ? "Консультация" : "•••• 1164"}</td>
              <td>
                <span className="status-chip neutral">Архив</span>
              </td>
            </tr>
            <tr>
              <td>{visits ? "V-1206" : "00480"}</td>
              <td>Елена Волкова</td>
              <td>25 июля 2026</td>
              <td>{visits ? "Повторный осмотр" : "•••• 7732"}</td>
              <td>
                <span className="status-chip">Активен</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DemoFrame({ step }: { step: DemoStepId }) {
  if (
    step === "clients-table" ||
    step === "visits-table" ||
    step === "visit-details"
  ) {
    return <DatabaseView step={step} />;
  }

  if (step === "voice-recording") {
    return (
      <ChatShell status="Записываю голос">
        <div className="empty-chat">
          <span className="mic-halo">
            <Mic2 />
          </span>
          <strong>Говорите свободно</strong>
          <p>Мы покажем текст перед отправкой</p>
        </div>
        <VoiceRecorder />
      </ChatShell>
    );
  }

  if (step === "transcription" || step === "attachments") {
    return (
      <ChatShell status={step === "transcription" ? "Распознаю сообщение" : "2 файла готовы"}>
        <div className="chat-bubble user transcript">
          <small>{step === "transcription" ? "Текст готов к отправке" : "Новый клиент"}</small>
          <p>{transcript}</p>
          {step === "attachments" && <Attachments />}
        </div>
      </ChatShell>
    );
  }

  if (
    step === "message-sent" ||
    step === "processing-client" ||
    step === "saving" ||
    step === "search-processing"
  ) {
    return (
      <ChatShell status="Работаю с данными">
        {step === "search-processing" && (
          <div className="chat-bubble user compact">
            Покажи Анну Петрову, последние цифры 4821.
          </div>
        )}
        <Processing step={step} />
      </ChatShell>
    );
  }

  if (step === "client-preview") {
    return (
      <ChatShell status="Карточка готова">
        <div className="chat-bubble assistant">
          <p>Я подготовил новую запись.</p>
          <ClientCard />
        </div>
      </ChatShell>
    );
  }

  if (step === "confirmation") {
    return (
      <ChatShell status="Ожидаю подтверждение">
        <div className="chat-bubble assistant compact">Карточка готова к сохранению.</div>
        <div className="chat-bubble user compact confirm-message">
          Подтверждаю сохранение.
          <Check size={15} />
        </div>
      </ChatShell>
    );
  }

  if (step === "saved") {
    return (
      <ChatShell status="Готово">
        <div className="success-state">
          <span>
            <Check size={29} />
          </span>
          <small>Запись успешно сохранена</small>
          <strong>{DEMO_CLIENT.fullName}</strong>
          <p>Клиент №00482 · {DEMO_CLIENT.date}</p>
          <button type="button">
            Открыть карточку <ArrowUpRight size={16} />
          </button>
        </div>
      </ChatShell>
    );
  }

  if (step === "search-request") {
    return (
      <ChatShell>
        <div className="search-compose">
          <Search size={18} />
          <span>Покажи информацию по Анне Петровой, последние цифры 4821.</span>
          <button type="button">
            <Send size={16} />
          </button>
        </div>
      </ChatShell>
    );
  }

  if (step === "search-result") {
    return (
      <ChatShell status="Клиент найден">
        <div className="chat-bubble assistant search-result">
          <ClientCard result />
          <div className="result-buttons">
            <button type="button">Открыть полную карточку</button>
            <button type="button">Добавить посещение</button>
          </div>
        </div>
      </ChatShell>
    );
  }

  return (
    <ChatShell>
      <div className="empty-chat">
        <span>
          <Sparkles />
        </span>
        <strong>С чего начнём?</strong>
        <p>Расскажите о новом клиенте голосом или текстом</p>
      </div>
    </ChatShell>
  );
}

export function DemoSection() {
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const viewed = useRef(false);
  const completed = useRef(false);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!media.matches || reduced.matches || !rootRef.current || !stageRef.current) {
      return;
    }

    const context = gsap.context(() => {
      ScrollTrigger.create({
        trigger: rootRef.current,
        start: "top top",
        end: () => `+=${window.innerHeight * 11}`,
        pin: stageRef.current,
        scrub: 0.35,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const index = Math.min(
            DEMO_STEPS.length - 1,
            Math.floor(self.progress * DEMO_STEPS.length),
          );
          setActiveIndex(index);
          if (!viewed.current && self.progress > 0.02) {
            viewed.current = true;
            trackEvent("demo_view");
          }
          if (!completed.current && self.progress > 0.98) {
            completed.current = true;
            trackEvent("demo_complete");
          }
        },
      });
    }, rootRef);

    return () => context.revert();
  }, []);

  const activeStep = DEMO_STEPS[activeIndex];

  return (
    <section className="demo-section" id="demo" ref={rootRef}>
      <div className="demo-stage" ref={stageRef}>
        <div className="demo-intro">
          <span className="section-number light">03 / Как это работает</span>
          <h2>Один разговор — готовая история клиента</h2>
          <p>
            Прокручивайте страницу: каждый этап показывает, что происходит с
            вашей заметкой.
          </p>
        </div>
        <div className="demo-layout desktop-demo">
          <div className="demo-copy">
            <span>{activeStep.eyebrow}</span>
            <h3 key={`title-${activeStep.id}`}>{activeStep.title}</h3>
            <p key={`copy-${activeStep.id}`}>{activeStep.description}</p>
            <div className="demo-progress">
              <span style={{ width: `${((activeIndex + 1) / DEMO_STEPS.length) * 100}%` }} />
            </div>
            <small>
              {String(activeIndex + 1).padStart(2, "0")} / {DEMO_STEPS.length}
            </small>
          </div>
          <div className="demo-frame" key={activeStep.id}>
            <DemoFrame step={activeStep.id} />
          </div>
        </div>
        <div className="mobile-demo">
          {DEMO_STEPS.map((step, index) => (
            <article className="mobile-demo-step" key={step.id}>
              <header>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </header>
              <DemoFrame step={step.id} />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
