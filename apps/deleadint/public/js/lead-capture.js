/* Drop-in lead capture. Loaded AFTER each site's own main.js.
 * Finds <form data-lead-source="..."> and, in the capture phase, intercepts
 * submit BEFORE the site's own handler (so a mailto: action or inline-success
 * handler never fires), POSTs JSON to the lead endpoint.
 *
 * While a submit is in flight the submit button is disabled and shows a
 * "Sending…" label. On success the whole form is removed and replaced with a
 * thank-you card (green tick badge, on its own white panel so it reads on any
 * background) — the form only comes back on a page reload, which is fine. On
 * failure the form stays put, the button resets, and an inline error shows so
 * they can retry. No visual change at rest. */
(function () {
  "use strict";
  var ENDPOINT =
    (document.currentScript && document.currentScript.dataset.endpoint) ||
    window.__LEAD_ENDPOINT__ ||
    "https://admin.deleadint.com/api/lead";
  var CONTACT_EMAIL = "info@deleadint.com";

  function pick(fd, res) {
    for (var i = 0; i < res.length; i++) {
      for (var pair of fd.entries()) {
        if (res[i].test(pair[0])) {
          var v = String(pair[1] || "").trim();
          if (v) return v;
        }
      }
    }
    return "";
  }

  function submitBtn(form) {
    return (
      form.querySelector(
        'button[type="submit"], input[type="submit"], button:not([type])',
      ) || null
    );
  }

  // toggle the submit button between resting / "Sending…" states
  function setBtn(btn, state, text) {
    if (!btn) return;
    if (btn.dataset.leadLabel == null) {
      btn.dataset.leadLabel =
        btn.tagName === "INPUT" ? btn.value : btn.innerHTML;
    }
    if (state === "reset") {
      var label = btn.dataset.leadLabel;
      if (btn.tagName === "INPUT") btn.value = label;
      else btn.innerHTML = label;
      btn.disabled = false;
      btn.removeAttribute("aria-busy");
      btn.style.opacity = "";
      btn.style.cursor = "";
      return;
    }
    if (btn.tagName === "INPUT") btn.value = text;
    else btn.textContent = text;
    btn.disabled = true;
    btn.setAttribute("aria-busy", "true");
    btn.style.opacity = "0.65";
    btn.style.cursor = "progress";
  }

  // drop any inline error left from a previous failed attempt
  function clearErr(form) {
    form.querySelectorAll("[data-lead-err]").forEach(function (n) {
      n.remove();
    });
  }
  function showErr(form) {
    clearErr(form);
    var p = document.createElement("p");
    p.setAttribute("data-lead-err", "");
    p.setAttribute("role", "alert");
    p.textContent =
      "Something went wrong. Please email " + CONTACT_EMAIL + ".";
    p.style.cssText = "margin-top:16px;font-weight:600;color:#b91c1c;";
    form.appendChild(p);
  }

  // replace the form with a thank-you card
  function renderSuccess(form) {
    if (form.dataset.leadDone) return;
    form.dataset.leadDone = "1";
    clearErr(form);

    var card = document.createElement("div");
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
      '<span style="font-size:1.4rem;font-weight:700;line-height:1.2;">' +
      "Message sent</span>" +
      '<span style="font-size:.95rem;line-height:1.6;color:#4d4348;">' +
      "Thanks for reaching out &mdash; we&rsquo;ll get back to you within a couple " +
      "of working days. In the meantime you can email " +
      '<a href="mailto:' +
      CONTACT_EMAIL +
      '" style="color:inherit;font-weight:600;text-decoration:underline;">' +
      CONTACT_EMAIL +
      "</a>.</span>";

    if (!document.getElementById("lead-success-kf")) {
      var st = document.createElement("style");
      st.id = "lead-success-kf";
      st.textContent =
        "@keyframes leadSuccessIn{from{opacity:0;transform:translateY(10px)}" +
        "to{opacity:1;transform:none}}" +
        "@media (prefers-reduced-motion:reduce){.lead-success-card{animation:none!important}}";
      document.head.appendChild(st);
    }

    form.style.display = "none";
    form.parentNode.insertBefore(card, form.nextSibling);
    try {
      card.scrollIntoView({ behavior: "smooth", block: "center" });
    } catch (_) {}
  }

  function wire(form) {
    var source = form.dataset.leadSource;
    form.addEventListener(
      "submit",
      function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        if (form.dataset.leadBusy || form.dataset.leadDone) return;
        if (typeof form.reportValidity === "function" && !form.reportValidity()) return;
        // honeypot
        var hp = form.querySelector('input[name="company_website"]');
        if (hp && hp.value) {
          renderSuccess(form);
          return;
        }

        var btn = submitBtn(form);
        form.dataset.leadBusy = "1";
        clearErr(form);
        setBtn(btn, "busy", "Sending…");

        var fd = new FormData(form);
        var payload = {
          source: source,
          name: pick(fd, [/^name$/i, /parent.?name/i, /^your.?name/i, /name/i]),
          email: pick(fd, [/email/i]),
          phone: pick(fd, [/phone/i, /^tel$/i, /mobile/i]),
          interest: pick(fd, [/interest/i, /vertical/i, /interested/i, /child.?class/i, /team.?size/i]),
          message: pick(fd, [/message/i, /comments?/i]),
          pagePath: location.pathname,
        };
        fetch(ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
          .then(function (r) {
            if (!r.ok) throw new Error(String(r.status));
            renderSuccess(form);
          })
          .catch(function () {
            showErr(form);
            setBtn(btn, "reset");
          })
          .finally(function () {
            delete form.dataset.leadBusy;
          });
      },
      true, // capture
    );
  }

  function init() {
    document.querySelectorAll("form[data-lead-source]").forEach(wire);
  }
  if (document.readyState !== "loading") init();
  else document.addEventListener("DOMContentLoaded", init);
})();
