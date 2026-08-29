"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import StayTools from "./StayTools";

type Lang = "en" | "ru" | "ka";

export default function SiteEnhancements() {
  const pathname = usePathname();
  const [lang, setLang] = useState<Lang>("en");
  const [mount, setMount] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (pathname !== "/") return;

    const sync = () => {
      const active = document.querySelector<HTMLButtonElement>(".langs button.active");
      const value = active?.textContent?.toLowerCase();
      if (value === "ru" || value === "ka" || value === "en") setLang(value);
    };
    sync();

    const node = document.querySelector(".langs");
    const observer = node ? new MutationObserver(sync) : null;
    if (node && observer) observer.observe(node, { subtree: true, attributes: true, attributeFilter: ["class"] });
    node?.addEventListener("click", sync);

    const finalSection = document.querySelector("#stay");
    const parent = finalSection?.parentElement;
    const portalMount = document.createElement("div");
    portalMount.id = "stay-tools-mount";
    if (parent && finalSection) {
      parent.insertBefore(portalMount, finalSection);
      setMount(portalMount);
    }

    return () => {
      observer?.disconnect();
      node?.removeEventListener("click", sync);
      portalMount.remove();
    };
  }, [pathname]);

  if (pathname !== "/" || !mount) return null;
  return createPortal(<StayTools lang={lang} />, mount);
}
