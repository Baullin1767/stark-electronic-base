"use client";

import Image from "next/image";
import {
  ArrowDown,
  CirclePause,
  ImageIcon,
  Mic2,
  Paperclip,
  Send,
  Sparkles,
  Table2,
  X,
} from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DEMO_CLIENT, DEMO_STEPS } from "@/lib/constants";
import { trackEvent } from "@/lib/analytics";
import {
  contentProps,
  formatText,
  text,
  type ContentKey,
} from "@/lib/content";
import type { DemoStepId } from "@/types/demo";

gsap.registerPlugin(ScrollTrigger);

const transcript = formatText("demo.transcript", {
  fullName: DEMO_CLIENT.fullName,
  phoneLastDigits: DEMO_CLIENT.phoneLastDigits,
  issue: DEMO_CLIENT.issue.toLowerCase(),
});

const reviewStepIndex = DEMO_STEPS.findIndex(
  ({ id }) => id === "summary-preview",
);
const reviewScrollWeight = 1.75;
const stepSettledProgress = 0.28;
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

function getProgressForStepPosition(stepPosition: number) {
  const clampedPosition = Math.max(
    0,
    Math.min(DEMO_STEPS.length, stepPosition),
  );

  if (clampedPosition <= reviewStepIndex) {
    return clampedPosition / demoScrollUnits;
  }

  if (clampedPosition < reviewStepIndex + 1) {
    return (
      reviewStepIndex +
      (clampedPosition - reviewStepIndex) * reviewScrollWeight
    ) / demoScrollUnits;
  }

  return (
    clampedPosition + reviewScrollWeight - 1
  ) / demoScrollUnits;
}

function canScrollReviewChat(target: EventTarget | null, direction: number) {
  const element = target instanceof Element ? target : null;
  const scrollArea = element?.closest<HTMLElement>(".review-chat-scroll");

  if (!scrollArea) {
    return false;
  }

  const maxScroll = scrollArea.scrollHeight - scrollArea.clientHeight;
  return direction > 0
    ? scrollArea.scrollTop < maxScroll - 1
    : scrollArea.scrollTop > 1;
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
  const reviewScrollProgress = Math.max(
    0,
    Math.min(
      1,
      (localProgress - stepSettledProgress) /
        (0.85 - stepSettledProgress),
    ),
  );
  const targetScroll = maxScroll * reviewScrollProgress;

  scrollArea.scrollTop =
    direction >= 0
      ? Math.max(scrollArea.scrollTop, targetScroll)
      : Math.min(scrollArea.scrollTop, targetScroll);

  syncReviewScrollHint(frame);

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

function syncReviewScrollHint(frame: HTMLElement | null) {
  const scrollArea = frame?.querySelector<HTMLElement>(
    ".review-chat-scroll",
  );
  const hint = frame?.querySelector<HTMLElement>(".chat-scroll-hint");

  if (!scrollArea || !hint) {
    return;
  }

  const maxScroll = scrollArea.scrollHeight - scrollArea.clientHeight;
  hint.style.opacity = scrollArea.scrollTop >= maxScroll - 1 ? "0" : "1";
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
  const frameEnter = isFirstFrameAtStart
    ? 1
    : Math.max(0, Math.min(1, localProgress / 0.24));
  const copyItems = [...copy.querySelectorAll<HTMLElement>("[data-demo-copy]")];

  copyItems.forEach((item, itemIndex) => {
    const itemEnter = isFirstFrameAtStart
      ? 1
      : Math.max(
          0,
          Math.min(1, (localProgress - itemIndex * 0.025) / 0.22),
        );

    gsap.set(item, {
      autoAlpha: 0.12 + itemEnter * 0.88,
      y: (1 - itemEnter) * 18,
    });
  });

  gsap.set(frame, {
    autoAlpha: 0.12 + frameEnter * 0.88,
    scale: 0.975 + frameEnter * 0.025,
    y: (1 - frameEnter) * 26,
  });
}

function ChatShell({
  children,
  status = text("demo.ui.assistant_default_status"),
  statusKey = "demo.ui.assistant_default_status",
  composer,
  bodyClassName,
}: {
  children?: React.ReactNode;
  status?: string;
  statusKey?: ContentKey;
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
          <strong {...contentProps("demo.ui.assistant_name")}>{text("demo.ui.assistant_name")}</strong>
          <small {...contentProps(statusKey)}>
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
        <span {...(!message ? contentProps("demo.ui.composer_placeholder") : {})}>
          {message ?? text("demo.ui.composer_placeholder")}
        </span>
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
      <button type="button" aria-label={text("demo.ui.cancel_recording_aria")}>
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
      <time {...contentProps("demo.ui.recording_time")}>{text("demo.ui.recording_time")}</time>
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
        ["/images/demo/before.webp", "demo.ui.before_photo"],
        ["/images/demo/after.webp", "demo.ui.after_photo"],
      ].map(([src, labelKey]) => (
        <figure key={src}>
          <Image src={src} alt={text(labelKey as ContentKey)} fill sizes="220px" />
          <figcaption {...contentProps(labelKey as ContentKey)}>
            <ImageIcon size={14} /> {text(labelKey as ContentKey)}
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
        <span {...contentProps("demo.template.client_phone")}>
          {formatText("demo.template.client_phone", {
            fullName: DEMO_CLIENT.fullName,
            phoneLastDigits: DEMO_CLIENT.phoneLastDigits,
          })}
        </span>
      </p>
      <p {...contentProps("demo.template.issue")}>
        {formatText("demo.template.issue", {
          issue: DEMO_CLIENT.issue.toLowerCase(),
        })}
      </p>
      <p {...contentProps("demo.template.last_visit")}>
        {formatText("demo.template.last_visit", {
          date: DEMO_CLIENT.date,
          procedure: DEMO_CLIENT.procedure.toLowerCase(),
          recommendation: DEMO_CLIENT.recommendation.toLowerCase(),
          nextVisit: DEMO_CLIENT.nextVisit,
        })}
      </p>
    </div>
  );
}

function StructuredRecordPreview() {
  return (
    <div className="structured-record-preview">
      <section>
        <h4 {...contentProps("demo.ui.new_client")}>{text("demo.ui.new_client")}</h4>
        <p {...contentProps("demo.table.full_name")}>{text("demo.table.full_name")}: {DEMO_CLIENT.fullName}</p>
        <p {...contentProps("demo.table.phone_digits")}>{text("demo.table.phone_digits")}: {DEMO_CLIENT.phoneLastDigits}</p>
        <p {...contentProps("demo.table.issues")}>{text("demo.table.issues")}: {DEMO_CLIENT.issue.toLowerCase()}</p>
        <p {...contentProps("demo.table.first_contact")}>{text("demo.table.first_contact")}: {DEMO_CLIENT.dateNumeric}</p>
        <p {...contentProps("demo.table.comment")}>{text("demo.table.comment")}: {DEMO_CLIENT.comment.toLowerCase()}</p>
      </section>

      <section>
        <h4 {...contentProps("demo.ui.first_visit")}>{text("demo.ui.first_visit")}</h4>
        <p {...contentProps("demo.template.record_client")}>
          {formatText("demo.template.record_client", {
            fullName: DEMO_CLIENT.fullName,
            phoneLastDigits: DEMO_CLIENT.phoneLastDigits,
          })}
        </p>
        <p {...contentProps("demo.table.visit_date")}>{text("demo.table.visit_date")} {DEMO_CLIENT.dateNumeric}</p>
      </section>

      <section>
        <h4 {...contentProps("demo.ui.procedures")}>{text("demo.ui.procedures")}</h4>
        <p>{DEMO_CLIENT.procedure}.</p>
      </section>

      <section>
        <h4 {...contentProps("demo.ui.recommendations")}>{text("demo.ui.recommendations")}</h4>
        <p>{DEMO_CLIENT.recommendation}.</p>
      </section>

      <section>
        <h4 {...contentProps("demo.ui.next_visit")}>{text("demo.ui.next_visit")}</h4>
        <p>{DEMO_CLIENT.nextVisit}.</p>
      </section>

      <section>
        <h4 {...contentProps("demo.ui.photos")}>{text("demo.ui.photos")}</h4>
        <p {...contentProps("demo.template.before_count")}>{formatText("demo.template.before_count", { count: DEMO_CLIENT.photos.before })}</p>
        <p {...contentProps("demo.template.after_count")}>{formatText("demo.template.after_count", { count: DEMO_CLIENT.photos.after })}</p>
        <p {...contentProps("demo.template.additional_count")}>{formatText("demo.template.additional_count", { count: DEMO_CLIENT.photos.additional })}</p>
      </section>

      <p className="record-confirmation" {...contentProps("demo.ui.confirm_save")}>{text("demo.ui.confirm_save")}</p>
    </div>
  );
}

function SavedRecordMessage() {
  return (
    <div className="saved-record-message">
      <strong {...contentProps("demo.ui.saved")}>{text("demo.ui.saved")}</strong>
      <p {...contentProps("demo.template.record_client")}>{formatText("demo.template.record_client", { fullName: DEMO_CLIENT.fullName, phoneLastDigits: DEMO_CLIENT.phoneLastDigits })}</p>
      <p {...contentProps("demo.template.saved_visit_date")}>{formatText("demo.template.saved_visit_date", { date: DEMO_CLIENT.dateNumeric })}</p>
      <p {...contentProps("demo.template.saved_next_visit")}>{formatText("demo.template.saved_next_visit", { date: DEMO_CLIENT.nextVisit })}</p>
      <p {...contentProps("demo.template.saved_before")}>{formatText("demo.template.saved_before", { count: DEMO_CLIENT.photos.before })}</p>
      <p {...contentProps("demo.template.saved_after")}>{formatText("demo.template.saved_after", { count: DEMO_CLIENT.photos.after })}</p>
      <p {...contentProps("demo.template.saved_additional")}>{formatText("demo.template.saved_additional", { count: DEMO_CLIENT.photos.additional })}</p>
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
    text("demo.sample.marina_name"),
    "1164",
    text("demo.sample.marina_issue"),
    "26.07.2026",
    text("demo.sample.marina_comment"),
  ],
  [
    text("demo.sample.elena_name"),
    "7732",
    text("demo.sample.elena_issue"),
    "25.07.2026",
    text("demo.sample.elena_comment"),
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
        photos: formatText("demo.template.photos_summary", {
          before: DEMO_CLIENT.photos.before,
          after: DEMO_CLIENT.photos.after,
          additional: DEMO_CLIENT.photos.additional,
        }),
      },
    ],
  },
  {
    client: text("demo.sample.olga_client"),
    visits: [
      {
        date: "27.07.2026",
        procedures:
          text("demo.sample.olga_procedure"),
        recommendations: text("demo.sample.not_specified"),
        nextVisit: text("demo.sample.not_scheduled"),
        photos: formatText("demo.template.photos_summary", {
          before: 1,
          after: 0,
          additional: 0,
        }),
      },
    ],
  },
  {
    client: text("demo.sample.marina_client"),
    visits: [
      {
        date: "26.07.2026",
        procedures: text("demo.sample.marina_procedure"),
        recommendations: text("demo.sample.marina_recommendation"),
        nextVisit: "09.08.2026",
        photos: formatText("demo.template.photos_summary", {
          before: 1,
          after: 0,
          additional: 1,
        }),
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
      <p><strong {...contentProps("demo.table.visit_date")}>{text("demo.table.visit_date")}</strong> {visit.date}</p>
      <p><strong {...contentProps("demo.ui.procedures")}>{text("demo.ui.procedures")}</strong> {visit.procedures}</p>
      <p><strong {...contentProps("demo.ui.recommendations")}>{text("demo.ui.recommendations")}</strong> {visit.recommendations}</p>
      <p><strong {...contentProps("demo.ui.next_visit")}>{text("demo.ui.next_visit")}</strong> {visit.nextVisit}</p>
      <p><strong {...contentProps("demo.ui.photos")}>{text("demo.ui.photos")}</strong> {visit.photos}</p>
    </div>
  );
}

function VisitsMatrix() {
  const visitIndexes = [0, 1] as const;

  return (
    <table className="visits-matrix">
      <thead>
        <tr className="table-heading-row visits-heading-row">
          <th {...contentProps("demo.ui.visits")}>{text("demo.ui.visits")}</th>
          {visitColumns.map(({ client }) => (
            <th key={client}>{client}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {visitIndexes.map((visitIndex) => (
          <tr className="visit-matrix-row" key={visitIndex}>
            <th className="visit-row-label" {...contentProps("demo.ui.visit")}>
              {formatText("demo.ui.visit", { number: visitIndex + 1 })}
            </th>
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

function DataTable({ step }: { step: "clients-table" | "visits-table" }) {
  const visits = step === "visits-table";
  const headings = [
    ["demo.table.full_name", text("demo.table.full_name")],
    ["demo.table.phone_digits", text("demo.table.phone_digits")],
    ["demo.table.issues", text("demo.table.issues")],
    ["demo.table.first_contact", text("demo.table.first_contact")],
    ["demo.table.comment", text("demo.table.comment")],
  ] as const;

  return (
    <div className={`demo-window data-table-window${visits ? " visits-view" : ""}`}>
      <div className="table-card-header">
        <span className="table-card-icon">
          <Table2 size={18} />
        </span>
        <div>
          <strong {...contentProps("demo.ui.database")}>{text("demo.ui.database")}</strong>
          <small {...contentProps("demo.ui.updated")}>{text("demo.ui.updated")}</small>
        </div>
      </div>
      <div className="table-view-tabs" aria-label={text("demo.ui.database_sections_aria")}>
        <span className={!visits ? "active" : ""} {...contentProps("demo.ui.clients")}>{text("demo.ui.clients")}</span>
        <span className={visits ? "active" : ""} {...contentProps("demo.ui.visit_history")}>{text("demo.ui.visit_history")}</span>
      </div>
      <div className={`table-sheet${visits ? " visits-sheet" : ""}`}>
        {visits ? (
          <VisitsMatrix />
        ) : (
          <table>
            <thead>
              <tr className="table-heading-row">
                {headings.map(([key, heading]) => (
                  <th key={key} {...contentProps(key)}>{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {clientRows.map((row, rowIndex) => (
                <tr className={rowIndex === 0 ? "new-table-row" : ""} key={row[0]}>
                  {row.map((cell) => (
                    <td key={cell}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function DemoFrame({ step }: { step: DemoStepId }) {
  if (
    step === "clients-table" ||
    step === "visits-table"
  ) {
    return <DataTable step={step} />;
  }

  if (step === "visit-details") {
    return (
      <ChatShell
        status={text("demo.ui.found")}
        statusKey="demo.ui.found"
      >
        <div className="chat-bubble user compact" {...contentProps("demo.template.last_visit_query")}>
          {formatText("demo.template.last_visit_query", {
            shortName: DEMO_CLIENT.shortName,
            phoneLastDigits: DEMO_CLIENT.phoneLastDigits,
          })}
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
        status={text("demo.ui.voice_status")}
        statusKey="demo.ui.voice_status"
        composer={<VoiceRecorder />}
      >
        <div className="empty-chat">
          <span className="mic-halo">
            <Mic2 />
          </span>
          <strong {...contentProps("demo.ui.speak")}>{text("demo.ui.speak")}</strong>
          <p {...contentProps("demo.ui.preview_before_send")}>{text("demo.ui.preview_before_send")}</p>
        </div>
      </ChatShell>
    );
  }

  if (step === "transcription") {
    return (
      <ChatShell
        status={text("demo.ui.transcribing")}
        statusKey="demo.ui.transcribing"
        composer={<MessageComposer message={transcript} />}
      />
    );
  }

  if (step === "attachments") {
    return (
      <ChatShell
        status={text("demo.ui.files_ready")}
        statusKey="demo.ui.files_ready"
        composer={
          <MessageComposer message={transcript} attachments />
        }
      />
    );
  }

  if (step === "summary-preview") {
    return (
      <div className="confirmation-chat-wrap">
        <div className="chat-scroll-hint" aria-hidden="true">
          <span {...contentProps("demo.ui.scroll_chat")}>{text("demo.ui.scroll_chat")}</span>
          <ArrowDown size={22} />
        </div>
        <ChatShell
          status={text("demo.ui.record_ready")}
          statusKey="demo.ui.record_ready"
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
          status={text("demo.ui.waiting_confirmation")}
          statusKey="demo.ui.waiting_confirmation"
          bodyClassName="review-chat-scroll"
        >
          <div className="chat-bubble assistant structured-summary-bubble confirmation-summary-bubble">
            <StructuredRecordPreview />
          </div>
          <div className="chat-bubble user compact confirm-message">
            <span {...contentProps("demo.ui.confirm")}>{text("demo.ui.confirm")}</span>
          </div>
        </ChatShell>
      </div>
    );
  }

  if (step === "saved") {
    return (
      <ChatShell status={text("demo.ui.done")} statusKey="demo.ui.done">
        <div className="chat-bubble user compact saved-user-message">
          <span {...contentProps("demo.ui.confirm")}>{text("demo.ui.confirm")}</span>
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
        <strong {...contentProps("demo.ui.start_question")}>{text("demo.ui.start_question")}</strong>
        <p {...contentProps("demo.ui.start_hint")}>{text("demo.ui.start_hint")}</p>
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
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches || !rootRef.current || !stageRef.current) {
      return;
    }

    let demoTrigger: ReturnType<typeof ScrollTrigger.create> | null = null;
    const context = gsap.context(() => {
      demoTrigger = ScrollTrigger.create({
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

    const mobileViewport = window.matchMedia("(max-width: 720px)");
    const swipeThreshold = 24;
    let touchStartX: number | null = null;
    let touchStartY: number | null = null;
    let touchStepIndex: number | null = null;
    let stepLocked = false;

    const resetTouch = () => {
      touchStartX = null;
      touchStartY = null;
      touchStepIndex = null;
      stepLocked = false;
    };

    const handleTouchStart = (event: TouchEvent) => {
      if (!mobileViewport.matches || event.touches.length !== 1) {
        resetTouch();
        return;
      }

      const touch = event.touches[0];
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
      touchStepIndex = null;
      stepLocked = false;

      if (
        demoTrigger &&
        window.scrollY >= demoTrigger.start - 1 &&
        window.scrollY <= demoTrigger.end + 1
      ) {
        touchStepIndex = activeIndexRef.current;
      }
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (
        !mobileViewport.matches ||
        !demoTrigger ||
        touchStartX === null ||
        touchStartY === null ||
        event.touches.length !== 1
      ) {
        return;
      }

      const currentScroll = window.scrollY;
      const isInsideDemo =
        currentScroll >= demoTrigger.start - 1 &&
        currentScroll <= demoTrigger.end + 1;

      if (!isInsideDemo) {
        return;
      }

      if (stepLocked) {
        if (event.cancelable) {
          event.preventDefault();
        }
        return;
      }

      const touch = event.touches[0];
      const deltaX = touchStartX - touch.clientX;
      const deltaY = touchStartY - touch.clientY;

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        return;
      }

      const direction = deltaY >= 0 ? 1 : -1;

      if (canScrollReviewChat(event.target, direction)) {
        return;
      }

      const isLeavingBeforeFirstStep =
        direction < 0 && currentScroll <= demoTrigger.start + 1;
      const isLeavingAfterLastStep =
        direction > 0 && currentScroll >= demoTrigger.end - 1;

      if (isLeavingBeforeFirstStep || isLeavingAfterLastStep) {
        return;
      }

      if (event.cancelable) {
        event.preventDefault();
      }

      if (Math.abs(deltaY) < swipeThreshold) {
        return;
      }

      touchStepIndex ??= activeIndexRef.current;
      const targetStep = Math.max(
        0,
        Math.min(DEMO_STEPS.length, touchStepIndex + direction),
      );
      const targetPosition =
        targetStep > 0 && targetStep < DEMO_STEPS.length
          ? targetStep + stepSettledProgress
          : targetStep;
      const targetProgress = getProgressForStepPosition(targetPosition);
      const targetScroll =
        demoTrigger.start +
        (demoTrigger.end - demoTrigger.start) * targetProgress;

      stepLocked = true;
      window.scrollTo({
        top: targetScroll,
        left: window.scrollX,
        behavior: "smooth",
      });
    };

    window.addEventListener("touchstart", handleTouchStart, {
      passive: true,
      capture: true,
    });
    window.addEventListener("touchmove", handleTouchMove, {
      passive: false,
      capture: true,
    });
    window.addEventListener("touchend", resetTouch, { passive: true });
    window.addEventListener("touchcancel", resetTouch, { passive: true });

    return () => {
      window.removeEventListener("touchstart", handleTouchStart, true);
      window.removeEventListener("touchmove", handleTouchMove, true);
      window.removeEventListener("touchend", resetTouch);
      window.removeEventListener("touchcancel", resetTouch);
      context.revert();
    };
  }, []);

  const activeStep = DEMO_STEPS[activeIndex];

  useLayoutEffect(() => {
    if (!copyRef.current || !frameRef.current) {
      return;
    }

    const scrollArea = frameRef.current.querySelector<HTMLElement>(
      ".review-chat-scroll",
    );
    const handleReviewScroll = () => syncReviewScrollHint(frameRef.current);

    scrollArea?.addEventListener("scroll", handleReviewScroll, {
      passive: true,
    });
    handleReviewScroll();

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
      return () =>
        scrollArea?.removeEventListener("scroll", handleReviewScroll);
    }

    syncScrollDrivenMotion(
      copyRef.current,
      frameRef.current,
      demoProgressRef.current,
      activeIndex,
    );

    return () =>
      scrollArea?.removeEventListener("scroll", handleReviewScroll);
  }, [activeIndex]);

  return (
    <section className="demo-section" id="demo" ref={rootRef}>
      <div className="demo-stage" ref={stageRef}>
        <div className="demo-intro">
          <span className="section-number light" {...contentProps("demo.section")}>{text("demo.section")}</span>
          <p {...contentProps("demo.description")}>{text("demo.description")}</p>
        </div>
        <div
          className={`demo-layout desktop-demo ${
            activeStep.id === "clients-table" || activeStep.id === "visits-table"
              ? "frame-right"
              : "frame-left"
          }`}
        >
          <div className="demo-copy" ref={copyRef}>
            <span data-demo-copy {...contentProps(activeStep.eyebrowKey)}>{activeStep.eyebrow}</span>
            <h3 data-demo-copy {...contentProps(activeStep.titleKey)} key={`title-${activeStep.id}`}>
              {activeStep.title}
            </h3>
            <div className="demo-progress">
              <span />
            </div>
            <small>
              {String(activeIndex + 1).padStart(2, "0")} / {String(DEMO_STEPS.length).padStart(2, "0")}
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
                  <h3 {...contentProps(step.titleKey)}>{step.title}</h3>
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
