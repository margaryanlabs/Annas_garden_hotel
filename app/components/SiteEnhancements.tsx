"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import StayTools from "./StayTools";

type Lang = "en" | "ru" | "ka";

export default function SiteEnhancements() {
  const pathname = usePathname();
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => {
    if (pathname !== "/") return;
    const sync = () => {
      const active = document.querySelector<HTMLButtonElement>(".langs button.active");
      const value = active?.textContent?.toLowerCase();
      if (value === "ru" || value === "ka" || value === "en") setLang(value);
    };
    sync();
    const node = document.querySelector(".langs");
    if (!node) return;
    const observer = new MutationObserver(sync);
    observer.observe(node, { subtree: true, attributes: true, attributeFilter: ["class"] });
    node.addEventListener("click", sync);
    return () => { observer.disconnect(); node.removeEventListener("click", sync); };
  }, [pathname]);

  if (pathname !== "/") return null;
  return <StayTools lang={lang} />;
}
