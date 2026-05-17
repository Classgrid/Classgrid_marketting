"use client";

import { useEffect } from "react";

export function LegalBodyClass() {
  useEffect(() => {
    document.body.classList.add("legal-page-active");
    return () => {
      document.body.classList.remove("legal-page-active");
    };
  }, []);

  return null;
}
