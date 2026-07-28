import { ArrowRight, Clock3, Lightbulb, Mic2 } from "lucide-react";

export function StorySection() {
  return (
    <section className="story" id="story">
      <div className="story-inner section-shell">
        <div className="story-copy">
          <span className="section-number light">02 / История</span>
          <h2>Решение появилось из реальной рабочей ситуации</h2>
          <p>
            Моя жена работает подологом. Плотный график, большой поток клиентов
            и почти нет пауз между приёмами. После каждой процедуры нужно
            сохранить фотографии, особенности и рекомендации.
          </p>
          <p>
            Тогда появилась простая идея: пусть специалист расскажет обо всём
            обычными словами, а система сама подготовит понятную карточку.
          </p>
          <div className="story-quote">
            <Lightbulb size={24} />
            <p>
              Она предложила идею, а я превратил её в инструмент, который
              соединяет голос, привычный чат и структурированную базу.
            </p>
          </div>
        </div>
        <div className="story-flow">
          <article>
            <span>
              <Clock3 />
            </span>
            <div>
              <small>Было</small>
              <strong>Заполнять карточки после приёма</strong>
            </div>
          </article>
          <ArrowRight className="story-arrow" aria-hidden="true" />
          <article className="accent">
            <span>
              <Mic2 />
            </span>
            <div>
              <small>Стало</small>
              <strong>Рассказать всё за минуту</strong>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
