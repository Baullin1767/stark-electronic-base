"use client";

import Image from "next/image";
import {
  CirclePause,
  ChevronDown,
  ImageIcon,
  Mic2,
  Paperclip,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DEMO_CLIENT, DEMO_STEPS } from "@/lib/constants";
import { trackEvent } from "@/lib/analytics";
import type { DemoStepId } from "@/types/demo";

gsap.registerPlugin(ScrollTrigger);

const transcript =
  "Новый клиент: Анна Сергеевна Петрова, последние цифры телефона — 4821. Сегодня первое обращение. Проведена обработка ногтевой пластины и бокового валика. Рекомендована ежедневная обработка и свободная обувь.";

const recordPreviewSource =
  "Olga Shepetko, последние цифры телефона 549. Бородавка на стопе. Сегодня выполнена третья обработка бородавки и выдана разгрузка. Прикреплена одна фотография до процедуры.";

function ChatShell({
  children,
  status = "Готов к работе",
  composer,
}: {
  children?: React.ReactNode;
  status?: string;
  composer?: React.ReactNode;
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
      {composer ?? <MessageComposer />}
    </div>
  );
}

function MessageComposer({
  message,
  attachments = false,
}: {
  message?: string;
  attachments?: boolean;
}) {
  return (
    <div
      className={`chat-input${message ? " has-message" : ""}${
        attachments ? " has-attachments" : ""
      }`}
      aria-hidden="true"
    >
      <Paperclip size={18} />
      <div className="chat-input-copy">
        <span>{message ?? "Сообщение для ассистента…"}</span>
        {attachments && <Attachments />}
      </div>
      <Mic2 size={18} />
      <b>
        <Send size={16} />
      </b>
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

function ClientSummaryMessage() {
  return (
    <div className="client-summary-message">
      <p>
        <strong>{DEMO_CLIENT.fullName}</strong>, телефон заканчивается на 4821.
      </p>
      <p>Особенности: болезненность в области большого пальца правой стопы.</p>
      <p>
        Последний визит — {DEMO_CLIENT.date}. Проведена обработка ногтевой
        пластины и бокового валика. Рекомендованы ежедневная обработка и
        свободная обувь. Следующий визит — через две недели.
      </p>
    </div>
  );
}

function StructuredRecordPreview() {
  return (
    <div className="structured-record-preview">
      <section>
        <h4>Новый клиент</h4>
        <p>ФИО: Olga Shepetko</p>
        <p>Последние цифры телефона: 549</p>
        <p>Особенности и диагнозы: бородавка на стопе</p>
        <p>Дата первого обращения: 27.07.2026</p>
        <p>Комментарий: текущая обработка бородавки — третья.</p>
      </section>

      <section>
        <h4>Первый визит в базе</h4>
        <p>Клиент: Olga Shepetko (549)</p>
        <p>Дата визита: 27.07.2026</p>
      </section>

      <section>
        <h4>Проведённые процедуры:</h4>
        <p>Выполнена третья обработка бородавки. Сделана и выдана разгрузка.</p>
      </section>

      <section>
        <h4>Рекомендации:</h4>
        <p>Не указаны.</p>
      </section>

      <section>
        <h4>Следующий визит:</h4>
        <p>Не назначен.</p>
      </section>

      <section>
        <h4>Фотографии:</h4>
        <p>До процедуры: 1</p>
        <p>После процедуры: 0</p>
        <p>Дополнительные: 0</p>
      </section>

      <p className="record-confirmation">Подтвердите сохранение записи.</p>
    </div>
  );
}

function SavedRecordMessage() {
  return (
    <div className="saved-record-message">
      <strong>Запись сохранена.</strong>
      <p>Клиент: Olga Shepetko (549)</p>
      <p>Дата визита: 27.07.2026</p>
      <p>Следующий визит: не назначен</p>
      <p>Фотографий до: 1</p>
      <p>Фотографий после: 0</p>
      <p>Дополнительных фотографий: 0</p>
    </div>
  );
}

function AssistantThinking() {
  return (
    <div className="assistant-thinking" aria-label="Ассистент думает">
      <Sparkles size={15} />
      <span>Thinking</span>
      <span className="assistant-thinking-dots" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
    </div>
  );
}

const clientRows = [
  [
    "Анна Сергеевна Петрова",
    "4821",
    "Болезненность большого пальца правой стопы",
    "28.07.2026",
    "Свободная обувь",
  ],
  [
    "Марина Алексеевна Орлова",
    "1164",
    "Восстановление после травмы ногтя",
    "26.07.2026",
    "Повторный осмотр",
  ],
  [
    "Елена Викторовна Волкова",
    "7732",
    "Трещины и сухость кожи стоп",
    "25.07.2026",
    "Домашний уход",
  ],
];

const visitColumns = [
  {
    client: "Olga Shepetko (549)",
    visits: [
      {
        date: "27.07.2026",
        procedures:
          "Выполнена третья обработка бородавки. Сделана и выдана разгрузка.",
        recommendations: "Не указаны.",
        nextVisit: "Не назначен.",
        photos: "До: 1 · После: 0 · Дополнительные: 0",
      },
      {
        date: "10.08.2026",
        procedures: "Контроль состояния стопы и повторная обработка.",
        recommendations: "Продолжить разгрузку обрабатываемой зоны.",
        nextVisit: "24.08.2026",
        photos: "До: 1 · После: 1 · Дополнительные: 0",
      },
    ],
  },
  {
    client: "Анна Петрова (4821)",
    visits: [
      {
        date: "28.07.2026",
        procedures: "Обработка ногтевой пластины и бокового валика.",
        recommendations: "Ежедневная обработка, свободная обувь.",
        nextVisit: "11.08.2026",
        photos: "До: 1 · После: 1 · Дополнительные: 0",
      },
    ],
  },
  {
    client: "Марина Орлова (1164)",
    visits: [
      {
        date: "26.07.2026",
        procedures: "Обработка и консультация после травмы ногтя.",
        recommendations: "Не травмировать ногтевую пластину.",
        nextVisit: "09.08.2026",
        photos: "До: 1 · После: 0 · Дополнительные: 1",
      },
    ],
  },
];

function VisitCell({
  visit,
}: {
  visit?: (typeof visitColumns)[number]["visits"][number];
}) {
  if (!visit) {
    return null;
  }

  return (
    <div className="visit-cell-copy">
      <p><strong>Дата визита:</strong> {visit.date}</p>
      <p><strong>Проведённые процедуры:</strong> {visit.procedures}</p>
      <p><strong>Рекомендации:</strong> {visit.recommendations}</p>
      <p><strong>Следующий визит:</strong> {visit.nextVisit}</p>
      <p><strong>Фотографии:</strong> {visit.photos}</p>
    </div>
  );
}

function VisitsMatrix() {
  const visitIndexes = [0, 1] as const;

  return (
    <table className="visits-matrix">
      <thead>
        <tr>
          <th className="excel-corner" />
          {Array.from({ length: visitColumns.length + 1 }, (_, index) => (
            <th className="excel-column-letter" key={index}>
              {String.fromCharCode(65 + index)}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr className="excel-heading-row visits-heading-row">
          <th>1</th>
          <td className="selected-cell">Клиенты</td>
          {visitColumns.map(({ client }) => (
            <td key={client}>{client}</td>
          ))}
        </tr>
        {visitIndexes.map((visitIndex) => (
          <tr className="visit-matrix-row" key={visitIndex}>
            <th>{visitIndex + 2}</th>
            <td className="visit-row-label">Визит {visitIndex + 1}</td>
            {visitColumns.map(({ client, visits }) => (
              <td key={client}>
                <VisitCell visit={visits[visitIndex]} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function ExcelWorkbook({ step }: { step: "clients-table" | "visits-table" }) {
  const visits = step === "visits-table";
  const headings = ["ФИО", "Последние цифры номера", "Особенности и диагнозы", "Дата первого обращения", "Комментарий"];

  return (
    <div className={`demo-window excel-window${visits ? " visits-workbook" : ""}`}>
      <div className="excel-titlebar">
        <span className="excel-app-icon">X</span>
        <strong>База клиентов.xlsx</strong>
        <small>Сохранено</small>
        <span className="excel-window-controls">—　□　×</span>
      </div>
      <div className="excel-ribbon">
        <div className="excel-ribbon-tabs">
          <b>Файл</b>
          <span>Главная</span>
          <span>Вставка</span>
          <span>Разметка страницы</span>
          <span>Данные</span>
        </div>
        <div className="excel-tools" aria-hidden="true">
          <strong>Буфер обмена</strong>
          <i />
          <i />
          <i />
          <span />
          <span />
          <span />
        </div>
      </div>
      <div className="excel-formula">
        <span>A1</span>
        <b>fx</b>
        <p>{visits ? "Клиенты" : "ФИО"}</p>
      </div>
      <div className={`excel-sheet${visits ? " visits-sheet" : ""}`}>
        {visits ? (
          <VisitsMatrix />
        ) : (
          <table>
          <thead>
            <tr>
              <th className="excel-corner" />
              {headings.map((_, index) => (
                <th className="excel-column-letter" key={index}>
                  {String.fromCharCode(65 + index)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="excel-heading-row">
              <th>1</th>
              {headings.map((heading, index) => (
                <td className={index === 0 ? "selected-cell" : ""} key={heading}>
                  {heading}
                </td>
              ))}
            </tr>
            {clientRows.map((row, rowIndex) => (
              <tr className={rowIndex === 0 ? "new-excel-row" : ""} key={row[0]}>
                <th>{rowIndex + 2}</th>
                {row.map((cell) => (
                  <td key={cell}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
          </table>
        )}
      </div>
      <div className="excel-statusbar">
        <button type="button">＋</button>
        <button className={!visits ? "active" : ""} type="button">
          Клиенты
        </button>
        <button className={visits ? "active" : ""} type="button">
          Визиты
        </button>
        <ChevronDown size={13} />
        <span>Готово</span>
        <small>100%</small>
      </div>
    </div>
  );
}

function DemoFrame({ step }: { step: DemoStepId }) {
  if (
    step === "clients-table" ||
    step === "visits-table"
  ) {
    return <ExcelWorkbook step={step} />;
  }

  if (step === "visit-details") {
    return (
      <ChatShell status="Данные из таблицы найдены">
        <div className="chat-bubble user compact">
          Покажи последний визит Анны Петровой, телефон заканчивается на 4821.
        </div>
        <div className="chat-bubble assistant client-summary-bubble visit-result-message">
          <ClientSummaryMessage />
        </div>
      </ChatShell>
    );
  }

  if (step === "voice-recording") {
    return (
      <ChatShell
        status="Записываю голос"
        composer={<VoiceRecorder />}
      >
        <div className="empty-chat">
          <span className="mic-halo">
            <Mic2 />
          </span>
          <strong>Говорите свободно</strong>
          <p>Мы покажем текст перед отправкой</p>
        </div>
      </ChatShell>
    );
  }

  if (step === "transcription") {
    return (
      <ChatShell
        status="Распознаю сообщение"
        composer={<MessageComposer message={transcript} />}
      />
    );
  }

  if (step === "attachments") {
    return (
      <ChatShell
        status="2 файла готовы"
        composer={
          <MessageComposer message={transcript} attachments />
        }
      />
    );
  }

  if (step === "message-sent" || step === "processing-client") {
    return (
      <ChatShell status="Работаю с данными">
        <div className="chat-bubble user sent-message">
          {transcript}
        </div>
        <AssistantThinking />
      </ChatShell>
    );
  }

  if (step === "summary-preview") {
    return (
      <ChatShell status="Запись подготовлена">
        <div className="chat-bubble user summary-source-message">
          {recordPreviewSource}
        </div>
        <div className="chat-bubble assistant structured-summary-bubble">
          <StructuredRecordPreview />
        </div>
      </ChatShell>
    );
  }

  if (step === "confirmation") {
    return (
      <ChatShell status="Ожидаю подтверждение">
        <div className="chat-bubble assistant structured-summary-bubble confirmation-summary-bubble">
          <StructuredRecordPreview />
        </div>
        <div className="chat-bubble user compact confirm-message">
          Подтверждаю
        </div>
      </ChatShell>
    );
  }

  if (step === "saved") {
    return (
      <ChatShell status="Готово">
        <div className="chat-bubble user compact saved-user-message">
          Подтверждаю
        </div>
        <div className="chat-bubble assistant saved-record-bubble">
          <SavedRecordMessage />
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
  const copyRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const previousIndex = useRef(0);
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

  useLayoutEffect(() => {
    if (!copyRef.current || !frameRef.current) {
      return;
    }

    const direction = activeIndex >= previousIndex.current ? 1 : -1;
    previousIndex.current = activeIndex;
    const copyItems = copyRef.current.querySelectorAll("[data-demo-copy]");

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set([...copyItems, frameRef.current], {
        autoAlpha: 1,
        y: 0,
        scale: 1,
      });
      return;
    }

    const transition = gsap.timeline({
      defaults: {
        ease: "power3.out",
        overwrite: "auto",
      },
    });

    transition
      .fromTo(
        copyItems,
        {
          autoAlpha: 0,
          y: 11 * direction,
        },
        {
          autoAlpha: 1,
          duration: 0.32,
          stagger: 0.035,
          y: 0,
        },
        0,
      )
      .fromTo(
        frameRef.current,
        {
          autoAlpha: 0,
          scale: 0.985,
          y: 18 * direction,
        },
        {
          autoAlpha: 1,
          duration: 0.4,
          scale: 1,
          y: 0,
        },
        0.015,
      );

    return () => {
      transition.kill();
    };
  }, [activeIndex]);

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
        <div
          className={`demo-layout desktop-demo ${
            activeStep.id === "clients-table" || activeStep.id === "visits-table"
              ? "frame-right"
              : "frame-left"
          }`}
        >
          <div className="demo-copy" ref={copyRef}>
            <span data-demo-copy>{activeStep.eyebrow}</span>
            <h3 data-demo-copy key={`title-${activeStep.id}`}>
              {activeStep.title}
            </h3>
            <p data-demo-copy key={`copy-${activeStep.id}`}>
              {activeStep.description}
            </p>
            <div className="demo-progress">
              <span style={{ width: `${((activeIndex + 1) / DEMO_STEPS.length) * 100}%` }} />
            </div>
            <small>
              {String(activeIndex + 1).padStart(2, "0")} / {DEMO_STEPS.length}
            </small>
          </div>
          <div className="demo-frame" ref={frameRef} key={activeStep.id}>
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
