import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export function Header() {
  return (
    <header className="site-header">
      <Link className="brand" href="/#top" aria-label="Stark Electronic Base — наверх">
        <span className="brand-mark" aria-hidden="true">
          SE
        </span>
        <span>
          Stark
          <small>Electronic Base</small>
        </span>
      </Link>
      <nav aria-label="Основная навигация">
        <Link href="/#story">История</Link>
        <Link href="/#demo">Как работает</Link>
        <Link href="/#pricing">Стоимость</Link>
      </nav>
      <Link className="header-cta" href="/#contact">
        Обсудить
        <ArrowUpRight size={16} aria-hidden="true" />
      </Link>
    </header>
  );
}
