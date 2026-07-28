import type { Metadata } from "next";
import { ArrowLeft, Mail } from "lucide-react";
import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { CONTACTS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Политика конфиденциальности",
  description:
    "Как Stark Electronic Base обрабатывает данные, отправленные через форму заявки.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="privacy-page section-shell">
        <Link className="back-link" href="/">
          <ArrowLeft size={17} /> На главную
        </Link>
        <header>
          <span className="section-number">Политика конфиденциальности</span>
          <h1>Ваши контактные данные используются только для связи по заявке</h1>
          <p>Последнее обновление: 28 июля 2026 года</p>
        </header>

        <div className="privacy-layout">
          <aside>
            <strong>Коротко</strong>
            <p>
              Мы не продаём данные и не используем их для рекламных рассылок.
              Заявка поступает владельцу Stark Electronic Base через Telegram.
            </p>
            <a href={CONTACTS.emailUrl}>
              <Mail size={17} /> Запросить удаление
            </a>
          </aside>
          <article className="legal-copy">
            <section>
              <h2>1. Какие данные мы собираем</h2>
              <p>
                Через форму можно передать имя, фамилию, профессию, Telegram,
                номер телефона, выбранный формат услуги и текст сообщения.
                Обязательны имя, один способ связи и согласие на обработку.
              </p>
            </section>
            <section>
              <h2>2. Для чего используются данные</h2>
              <p>
                Данные нужны, чтобы ответить на заявку, уточнить задачу,
                обсудить подключение и при необходимости подготовить
                предложение. Они не используются для автоматических рекламных
                рассылок.
              </p>
            </section>
            <section>
              <h2>3. Куда отправляется заявка</h2>
              <p>
                Заявка передаётся сервером сайта владельцу Stark Electronic
                Base через Telegram Bot API. Токен бота хранится только в
                защищённых переменных окружения хостинга и не передаётся в
                браузер.
              </p>
            </section>
            <section>
              <h2>4. Срок хранения</h2>
              <p>
                Контактные данные хранятся до завершения общения по заявке, но
                не более 12 месяцев, если более длительное хранение не требуется
                для исполнения договора или соблюдения закона.
              </p>
            </section>
            <section>
              <h2>5. Как удалить данные</h2>
              <p>
                Напишите на{" "}
                <a href={CONTACTS.emailUrl}>{CONTACTS.email}</a> с контакта,
                указанного в заявке. После проверки запроса данные будут удалены
                из доступных владельцу сообщений и рабочих записей, если закон
                не требует их сохранить.
              </p>
            </section>
            <section>
              <h2>6. Важное ограничение</h2>
              <p>
                Не отправляйте через форму медицинские сведения, фотографии
                клиентов, документы или другие чувствительные персональные
                данные. Демонстрационные сведения на сайте полностью
                вымышлены.
              </p>
            </section>
            <section>
              <h2>7. Контакты владельца</h2>
              <p>
                Владелец сайта: Stark Electronic Base. Email:{" "}
                <a href={CONTACTS.emailUrl}>{CONTACTS.email}</a>, Telegram:{" "}
                <a href={CONTACTS.telegramUrl}>{CONTACTS.telegram}</a>,
                телефон: <a href={CONTACTS.phoneUrl}>{CONTACTS.phone}</a>.
              </p>
            </section>
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
