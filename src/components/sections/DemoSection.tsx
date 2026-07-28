"use client";

import Image from "next/image";
import {
  ArrowDown,
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

const transcript = `Новый клиент: ${DEMO_CLIENT.fullName}, последние цифры телефона — ${DEMO_CLIENT.phoneLastDigits}. Сегодня первое обращение. Особенность: ${DEMO_CLIENT.issue.toLowerCase()}. Проведена обработка ногтевой пластины и бокового валика. Рекомендована ежедневная обработка и свободная обувь.`;

const reviewStepIndex = DEMO_STEPS.findIndex(
  ({ id }) => id === "summary-preview",
);
const reviewScrollWeight = 1.75;
const demoScrollUnits =
  DEMO_STEPS.length + reviewScrollWeight - 1;

function getStepPosition(progress: number) {
  const weightedPosition = progress * demoScrollUnits;

  if (weightedPosition <= reviewStepIndex) {
    return weightedPosition;
  }

  const reviewEnd = reviewStepIndex + reviewScrollWeight;

  if (weightedPosition < reviewEnd) {
    return (
      reviewStepIndex +
      (weightedPosition - reviewStepIndex) / reviewScrollWeight
    );
  }

  return weightedPosition - (reviewScrollWeight - 1);
}

function syncReviewChat(
  frame: HTMLElement | null,
  stepPosition: number,
  direction: number,
) {
  const scrollArea = frame?.querySelector<HTMLElement>(
    ".review-chat-scroll",
  );
  if (!scrollArea) {
    return false;
  }

  const maxScroll = scrollArea.scrollHeight - scrollArea.clientHeight;
  const localProgress = Math.max(
    0,
    Math.min(1, stepPosition - reviewStepIndex),
  );
  const targetScroll = maxScroll * Math.min(1, localProgress / 0.85);

  scrollArea.scrollTop =
    direction >= 0
      ? Math.max(scrollArea.scrollTop, targetScroll)
      : Math.min(scrollArea.scrollTop, targetScroll);

  const hint = frame?.querySelector<HTMLElement>(".chat-scroll-hint");
  if (hint) {
    hint.style.opacity = scrollArea.scrollTop >= maxScroll - 1 ? "0" : "1";
  }

  return scrollArea.scrollTop >= maxScroll - 1;
}

function isReviewChatAtEnd(frame: HTMLElement | null) {
  const scrollArea = frame?.querySelector<HTMLElement>(
    ".review-chat-scroll",
  );
  if (!scrollArea) {
    return false;
  }

  return (
    scrollArea.scrollTop >=
    scrollArea.scrollHeight - scrollArea.clientHeight - 1
  );
}

function syncScrollDrivenMotion(
  copy: HTMLElement | null,
  frame: HTMLElement | null,
  stepPosition: number,
  stepIndex: number,
) {
  if (!copy || !frame) {
    return;
  }

  const localProgress = Math.max(0, Math.min(1, stepPosition - stepIndex));
  const isFirstFrameAtStart = stepIndex === 0 && stepPosition < 0.01;
  const isLastFrame = stepIndex === DEMO_STEPS.length - 1;
  const frameExitStart =
    stepIndex === reviewStepIndex ? 0.9 : 0.74;
  const frameEnter = isFirstFrameAtStart
    ? 1
    : Math.max(0, Math.min(1, localProgress / 0.24));
  const frameExit = isLastFrame
    ? 0
    : Math.max(
        0,
        Math.min(
          1,
          (localProgress - frameExitStart) / (1 - frameExitStart),
        ),
      );
  const frameVisibility = Math.min(frameEnter, 1 - frameExit);
  const copyItems = [...copy.querySelectorAll<HTMLElement>("[data-demo-copy]")];

  copyItems.forEach((item, itemIndex) => {
    const itemEnter = isFirstFrameAtStart
      ? 1
      : Math.max(
          0,
          Math.min(1, (localProgress - itemIndex * 0.025) / 0.22),
        );
    const visibility = Math.min(itemEnter, 1 - frameExit);

    gsap.set(item, {
      autoAlpha: 0.12 + visibility * 0.88,
      y: (1 - itemEnter) * 18 - frameExit * 14,
    });
  });

  gsap.set(frame, {
    autoAlpha: 0.12 + frameVisibility * 0.88,
    scale: 0.975 + frameVisibility * 0.025,
    y: (1 - frameEnter) * 26 - frameExit * 20,
  });
}

function ChatShell({
  children,
  status = "Готов к работе",
  composer,
  bodyClassName,
}: {
  children?: React.ReactNode;
  status?: string;
  composer?: React.ReactNode;
  bodyClassName?: string;
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
      <div className={`chat-body${bodyClassName ? ` ${bodyClassName}` : ""}`}>
        {children}
      </div>
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
        <strong>{DEMO_CLIENT.fullName}</strong>, телефон заканчивается на{" "}
        {DEMO_CLIENT.phoneLastDigits}.
      </p>
      <p>Особенности: {DEMO_CLIENT.issue.toLowerCase()}.</p>
      <p>
        Последний визит — {DEMO_CLIENT.date}. Проведена{" "}
        {DEMO_CLIENT.procedure.toLowerCase()}. Рекомендованы{" "}
        {DEMO_CLIENT.recommendation.toLowerCase()}. Следующий визит —{" "}
        {DEMO_CLIENT.nextVisit}.
      </p>
    </div>
  );
}

function StructuredRecordPreview() {
  return (
    <div className="structured-record-preview">
      <section>
        <h4>Новый клиент</h4>
        <p>ФИО: {DEMO_CLIENT.fullName}</p>
        <p>Последние цифры телефона: {DEMO_CLIENT.phoneLastDigits}</p>
        <p>Особенности и диагнозы: {DEMO_CLIENT.issue.toLowerCase()}</p>
        <p>Дата первого обращения: {DEMO_CLIENT.dateNumeric}</p>
        <p>Комментарий: {DEMO_CLIENT.comment.toLowerCase()}</p>
      </section>

      <section>
        <h4>Первый визит в базе</h4>
        <p>
          Клиент: {DEMO_CLIENT.fullName} ({DEMO_CLIENT.phoneLastDigits})
        </p>
        <p>Дата визита: {DEMO_CLIENT.dateNumeric}</p>
      </section>

      <section>
        <h4>Проведённые процедуры:</h4>
        <p>{DEMO_CLIENT.procedure}.</p>
      </section>

      <section>
        <h4>Рекомендации:</h4>
        <p>{DEMO_CLIENT.recommendation}.</p>
      </section>

      <section>
        <h4>Следующий визит:</h4>
        <p>{DEMO_CLIENT.nextVisit}.</p>
      </section>

      <section>
        <h4>Фотографии:</h4>
        <p>До процедуры: {DEMO_CLIENT.photos.before}</p>
        <p>После процедуры: {DEMO_CLIENT.photos.after}</p>
        <p>Дополнительные: {DEMO_CLIENT.photos.additional}</p>
      </section>

      <p className="record-confirmation">Подтвердите сохранение записи.</p>
    </div>
  );
}

function SavedRecordMessage() {
  return (
    <div className="saved-record-message">
      <strong>Запись сохранена.</strong>
      <p>
        Клиент: {DEMO_CLIENT.fullName} ({DEMO_CLIENT.phoneLastDigits})
      </p>
      <p>Дата визита: {DEMO_CLIENT.dateNumeric}</p>
      <p>Следующий визит: {DEMO_CLIENT.nextVisit}</p>
      <p>Фотографий до: {DEMO_CLIENT.photos.before}</p>
      <p>Фотографий после: {DEMO_CLIENT.photos.after}</p>
      <p>Дополнительных фотографий: {DEMO_CLIENT.photos.additional}</p>
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
    DEMO_CLIENT.fullName,
    DEMO_CLIENT.phoneLastDigits,
    DEMO_CLIENT.issue,
    DEMO_CLIENT.dateNumeric,
    DEMO_CLIENT.comment,
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
    client: `${DEMO_CLIENT.shortName} (${DEMO_CLIENT.phoneLastDigits})`,
    visits: [
      {
        date: DEMO_CLIENT.dateNumeric,
        procedures: `${DEMO_CLIENT.procedure}.`,
        recommendations: `${DEMO_CLIENT.recommendation}.`,
        nextVisit: DEMO_CLIENT.nextVisit,
        photos: `До: ${DEMO_CLIENT.photos.before} · После: ${DEMO_CLIENT.photos.after} · Дополнительные: ${DEMO_CLIENT.photos.additional}`,
      },
    ],
  },
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
          Покажи последний визит {DEMO_CLIENT.shortName}, телефон заканчивается
          на {DEMO_CLIENT.phoneLastDigits}.
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

  if (step === "message-sent") {
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
      <div className="confirmation-chat-wrap">
        <div className="chat-scroll-hint" aria-hidden="true">
          <span>Прокрутите чат</span>
          <ArrowDown size={22} />
        </div>
        <ChatShell
          status="Запись подготовлена"
          bodyClassName="review-chat-scroll"
        >
          <div className="chat-bubble user summary-source-message">
            {transcript}
          </div>
          <div className="chat-bubble assistant structured-summary-bubble">
            <StructuredRecordPreview />
          </div>
        </ChatShell>
      </div>
    );
  }

  if (step === "confirmation") {
    return (
      <div className="confirmation-chat-wrap">
        <ChatShell
          status="Ожидаю подтверждение"
          bodyClassName="review-chat-scroll"
        >
          <div className="chat-bubble assistant structured-summary-bubble confirmation-summary-bubble">
            <StructuredRecordPreview />
          </div>
          <div className="chat-bubble user compact confirm-message">
            Подтверждаю
          </div>
        </ChatShell>
      </div>
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
  const activeIndexRef = useRef(0);
  const demoProgressRef = useRef(0);
  const scrollDirectionRef = useRef(1);
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
        end: () => {
          const stepDistance = Math.max(
            340,
            Math.min(460, window.innerHeight * 0.5),
          );
          return `+=${stepDistance * demoScrollUnits}`;
        },
        pin: stageRef.current,
        scrub: 0.12,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const stepPosition = getStepPosition(self.progress);
          demoProgressRef.current = stepPosition;
          scrollDirectionRef.current = self.direction;
          let index = Math.min(
            DEMO_STEPS.length - 1,
            Math.floor(stepPosition),
          );

          if (
            self.direction > 0 &&
            index > reviewStepIndex &&
            activeIndexRef.current < reviewStepIndex
          ) {
            index = reviewStepIndex;
          }

          const reviewAtEnd =
            index === reviewStepIndex
              ? syncReviewChat(
                  frameRef.current,
                  stepPosition,
                  self.direction,
                )
              : false;

          if (
            self.direction > 0 &&
            index > reviewStepIndex &&
            activeIndexRef.current === reviewStepIndex &&
            !isReviewChatAtEnd(frameRef.current)
          ) {
            syncReviewChat(
              frameRef.current,
              reviewStepIndex + 1,
              self.direction,
            );
            index = reviewStepIndex;
          } else if (
            index === reviewStepIndex &&
            self.direction > 0 &&
            stepPosition >= reviewStepIndex + 1 &&
            !reviewAtEnd
          ) {
            index = reviewStepIndex;
          }

          if (activeIndexRef.current !== index) {
            activeIndexRef.current = index;
            setActiveIndex(index);
          }

          syncScrollDrivenMotion(
            copyRef.current,
            frameRef.current,
            stepPosition,
            index,
          );
          const progressBar = copyRef.current?.querySelector<HTMLElement>(
            ".demo-progress span",
          );
          if (progressBar) {
            gsap.set(progressBar, { width: `${self.progress * 100}%` });
          }

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

    if (DEMO_STEPS[activeIndex].id === "summary-preview") {
      syncReviewChat(
        frameRef.current,
        demoProgressRef.current,
        scrollDirectionRef.current,
      );
    } else if (DEMO_STEPS[activeIndex].id === "confirmation") {
      syncReviewChat(frameRef.current, reviewStepIndex + 1, 1);
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const copyItems =
        copyRef.current.querySelectorAll<HTMLElement>("[data-demo-copy]");
      gsap.set([...copyItems, frameRef.current], {
        autoAlpha: 1,
        y: 0,
        scale: 1,
      });
      return;
    }

    syncScrollDrivenMotion(
      copyRef.current,
      frameRef.current,
      demoProgressRef.current,
      activeIndex,
    );
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
              <span />
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
      <div className="demo-flexibility">
        <div className="demo-flexibility-copy">
          <span>Настраивается под вас</span>
          <h3>Форма таблицы может быть любой</h3>
          <p>
            Вы сами определяете, какие листы, поля и данные нужны в работе.
            Структура базы подстраивается под ваш процесс, а не наоборот.
          </p>
        </div>
        <div className="demo-flexibility-card">
          <div>
            <Sparkles size={20} />
            <strong>Любые нужные данные</strong>
          </div>
          <p>
            Добавим ваши названия колонок, категории, статусы, даты,
            рекомендации, ссылки на файлы и другие параметры.
          </p>
          <div className="demo-flexibility-fields" aria-label="Примеры полей">
            {[
              "Контакты",
              "Диагнозы",
              "Процедуры",
              "Рекомендации",
              "Статусы",
              "Фотографии",
              "Следующий визит",
              "Свои поля",
            ].map((field) => (
              <span key={field}>{field}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
