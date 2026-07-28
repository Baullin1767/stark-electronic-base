import {
  CheckCheck,
  History,
  Mic2,
  Search,
  Settings2,
  WandSparkles,
} from "lucide-react";
import { BENEFITS } from "@/lib/constants";

const icons = [Mic2, WandSparkles, CheckCheck, History, Search, Settings2];

export function BenefitsSection() {
  return (
    <section className="benefits section-shell">
      <div className="section-heading centered">
        <span className="section-number">04 / Возможности</span>
        <h2>Клиентская база без сложных форм</h2>
        <p>
          Знакомый формат диалога помогает сохранять историю работы и быстро
          возвращаться к ней перед следующим приёмом.
        </p>
      </div>
      <div className="benefits-grid">
        {BENEFITS.map(([title, text], index) => {
          const Icon = icons[index];
          return (
            <article key={title}>
              <span>
                <Icon />
              </span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          );
        })}
      </div>
      <div className="connection-note">
        <span>30–60 минут</span>
        <p>
          Обычно столько занимает базовое подключение после согласования
          структуры. Более сложные сценарии оцениваются отдельно.
        </p>
      </div>
    </section>
  );
}
