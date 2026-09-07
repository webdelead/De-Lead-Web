"use client";

import { useEffect } from "react";

/**
 * Ported from the shared packages/shared/browser/lead-capture.js (which still
 * serves the other 4 marketing sites via `pnpm sync:lead-capture`). Intercepts
 * `form[data-lead-source]` submit in the CAPTURE phase — before the site's own
 * handler in <SiteScripts/> — and POSTs JSON to the lead endpoint, swapping the
 * form for a thank-you card on success.
 */
export function LeadCapture({ endpoint }: { endpoint: string }) {
  useEffect(() => {
    const CONTACT_EMAIL = "info@deleadint.com";

    const pick = (fd: FormData, res: RegExp[]) => {
      for (const re of res) {
        for (const [k, v] of fd.entries()) {
          if (re.test(k)) {
            const s = String(v || "").trim();
            if (s) return s;
          }
        }
      }
      return "";
    };
    const submitBtn = (form: HTMLFormElement) =>
      form.querySelector<HTMLButtonElement | HTMLInputElement>(
        'button[type="submit"], input[type="submit"], button:not([type])',
      );
    const setBtn = (
      btn: HTMLButtonElement | HTMLInputElement | null,
      state: "busy" | "reset",
      text?: string,
    ) => {
      if (!btn) return;
      if (btn.dataset.leadLabel == null) {
        btn.dataset.leadLabel = btn.tagName === "INPUT" ? (btn as HTMLInputElement).value : btn.innerHTML;
      }
      if (state === "reset") {
        const label = btn.dataset.leadLabel;
        if (btn.tagName === "INPUT") (btn as HTMLInputElement).value = label;
        else btn.innerHTML = label;
        btn.disabled = false;
        btn.removeAttribute("aria-busy");
        btn.style.opacity = "";
        btn.style.cursor = "";
        return;
      }
      if (btn.tagName === "INPUT") (btn as HTMLInputElement).value = text!;
      else btn.textContent = text!;
      btn.disabled = true;
      btn.setAttribute("aria-busy", "true");
      btn.style.opacity = "0.65";
      btn.style.cursor = "progress";
    };
    const clearErr = (form: HTMLFormElement) =>
      form.querySelectorAll("[data-lead-err]").forEach((n) => n.remove());
    const showErr = (form: HTMLFormElement) => {
      clearErr(form);
      const p = document.createElement("p");
      p.setAttribute("data-lead-err", "");
      p.setAttribute("role", "alert");
      p.textContent = "Something went wrong. Please email " + CONTACT_EMAIL + ".";
      p.style.cssText = "margin-top:16px;font-weight:600;color:#b91c1c;";
      form.appendChild(p);
    };
    const renderSuccess = (form: HTMLFormElement) => {
      if (form.dataset.leadDone) return;
      form.dataset.leadDone = "1";
      clearErr(form);
      const card = document.createElement("div");
      card.setAttribute("role", "status");
      card.className = "lead-success-card";
      card.style.cssText = [
        "display:flex",
        "flex-direction:column",
        "align-items:flex-start",
        "gap:14px",
        "flex:1 1 0",
        "width:100%",
        "max-width:520px",
        "box-sizing:border-box",
        "margin:0",
        "padding:34px",
        "background:#fff",
        "border:1px solid rgba(0,0,0,.06)",
        "border-radius:20px",
        "box-shadow:0 26px 60px -30px rgba(0,0,0,.3)",
        "color:#1c1417",
        "animation:leadSuccessIn .45s cubic-bezier(.22,.61,.36,1) both",
      ].join(";");
      card.innerHTML =
        '<span aria-hidden="true" style="display:inline-flex;align-items:center;' +
        "justify-content:center;width:54px;height:54px;border-radius:999px;" +
        'background:#16a34a;flex:none;box-shadow:0 8px 20px -6px rgba(22,163,74,.5);">' +
        '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#fff" ' +
        'stroke-width="3" stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="M20 6L9 17l-5-5"/></svg></span>' +
        '<span style="font-size:1.4rem;font-weight:700;line-height:1.2;">Message sent</span>' +
        '<span style="font-size:.95rem;line-height:1.6;color:#4d4348;">' +
        "Thanks for reaching out &mdash; we&rsquo;ll get back to you within a couple " +
        "of working days. In the meantime you can email " +
        '<a href="mailto:' +
        CONTACT_EMAIL +
        '" style="color:inherit;font-weight:600;text-decoration:underline;">' +
        CONTACT_EMAIL +
        "</a>.</span>";
      if (!document.getElementById("lead-success-kf")) {
        const st = document.createElement("style");
        st.id = "lead-success-kf";
        st.textContent =
          "@keyframes leadSuccessIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}" +
          "@media (prefers-reduced-motion:reduce){.lead-success-card{animation:none!important}}";
        document.head.appendChild(st);
      }
      form.style.display = "none";
      form.parentNode?.insertBefore(card, form.nextSibling);
      try {
        card.scrollIntoView({ behavior: "smooth", block: "center" });
      } catch {
        /* noop */
      }
    };

    const handlers: Array<[HTMLFormElement, (e: Event) => void]> = [];
    document.querySelectorAll<HTMLFormElement>("form[data-lead-source]").forEach((form) => {
      const source = form.dataset.leadSource;
      const onSubmit = (e: Event) => {
        e.preventDefault();
        e.stopImmediatePropagation();
        if (form.dataset.leadBusy || form.dataset.leadDone) return;
        if (typeof form.reportValidity === "function" && !form.reportValidity()) return;
        const hp = form.querySelector<HTMLInputElement>('input[name="company_website"]');
        if (hp && hp.value) {
          renderSuccess(form);
          return;
        }
        const btn = submitBtn(form);
        form.dataset.leadBusy = "1";
        clearErr(form);
        setBtn(btn, "busy", "Sending…");
        const fd = new FormData(form);
        const payload = {
          source,
          name: pick(fd, [/^name$/i, /parent.?name/i, /^your.?name/i, /name/i]),
          email: pick(fd, [/email/i]),
          phone: pick(fd, [/phone/i, /^tel$/i, /mobile/i]),
          interest: pick(fd, [/interest/i, /vertical/i, /interested/i, /child.?class/i, /team.?size/i]),
          message: pick(fd, [/message/i, /comments?/i]),
          pagePath: location.pathname,
        };
        fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
          .then((r) => {
            if (!r.ok) throw new Error(String(r.status));
            renderSuccess(form);
          })
          .catch(() => {
            showErr(form);
            setBtn(btn, "reset");
          })
          .finally(() => {
            delete form.dataset.leadBusy;
          });
      };
      form.addEventListener("submit", onSubmit, true);
      handlers.push([form, onSubmit]);
    });

    return () => handlers.forEach(([form, fn]) => form.removeEventListener("submit", fn, true));
  }, [endpoint]);

  return null;
}
