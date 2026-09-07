import { ArrowRight, Star } from "lucide-react";
import { contentProps, text } from "@/lib/content";

const reviews = [
  { quote: "hero.summary", name: "hero.review_1_name", role: "hero.review_1_role" },
  { quote: "hero.followup", name: "hero.review_2_name", role: "hero.review_2_role" },
  { quote: "hero.review_3_text", name: "hero.review_3_name", role: "hero.review_3_role" },
  { quote: "hero.review_4_text", name: "hero.review_4_name", role: "hero.review_4_role" },
] as const;

export function ReviewsSection() {
  return (
    <section className="reviews section-shell" id="reviews">
      <div className="section-heading centered">
        <span className="section-number" {...contentProps("reviews.section")}>{text("reviews.section")}</span>
        <h2 {...contentProps("reviews.title")}>{text("reviews.title")}</h2>
      </div>
      <div className="reviews-grid">
        {reviews.map((review, index) => (
          <article className={`testimonial-item${index === 0 ? " review-featured" : ""}`} key={review.name}>
            {index === 0 && <div className="review-metric">
              <div><span {...contentProps("reviews.metric_before")}>{text("reviews.metric_before")}</span><ArrowRight aria-hidden="true" /><strong {...contentProps("reviews.metric_after")}>{text("reviews.metric_after")}</strong></div>
              <small {...contentProps("reviews.metric_label")}>{text("reviews.metric_label")}</small>
            </div>}
            <div className="testimonial-stars" aria-hidden="true">{Array.from({ length: 5 }, (_, star) => <Star key={star} size={14} fill="currentColor" />)}</div>
            <blockquote {...contentProps(review.quote)}>{text(review.quote)}</blockquote>
            <footer><span className="testimonial-avatar">{text(review.name).charAt(0)}</span><div><strong {...contentProps(review.name)}>{text(review.name)}</strong><small {...contentProps(review.role)}>{text(review.role)}</small></div></footer>
          </article>
        ))}
      </div>
    </section>
  );
}
