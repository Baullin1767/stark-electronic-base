import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { contentProps, text } from "@/lib/content";

export function Header() {
  return (
    <header className="site-header">
      <Link className="brand" href="/#top" aria-label={text("header.brand_aria")}>
        <span className="brand-mark" aria-hidden="true">
          <span {...contentProps("brand.mark")}>{text("brand.mark")}</span>
        </span>
        <span>
          <span {...contentProps("brand.name")}>{text("brand.name")}</span>
          <small {...contentProps("brand.subname")}>{text("brand.subname")}</small>
        </span>
      </Link>
      <nav aria-label={text("header.nav_aria")}>
        <Link href="/#story" {...contentProps("header.nav_story")}>{text("header.nav_story")}</Link>
        <Link href="/#demo" {...contentProps("header.nav_demo")}>{text("header.nav_demo")}</Link>
        <Link href="/#pricing" {...contentProps("header.nav_pricing")}>{text("header.nav_pricing")}</Link>
      </nav>
      <Link className="header-cta" href="/#contact" {...contentProps("header.cta")}>
        {text("header.cta")}
        <ArrowUpRight size={16} aria-hidden="true" />
      </Link>
    </header>
  );
}
