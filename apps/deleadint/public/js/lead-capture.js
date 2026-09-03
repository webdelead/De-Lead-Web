/* Drop-in lead capture. Loaded AFTER each site's own main.js.
 * Finds <form data-lead-source="..."> and, in the capture phase, intercepts
 * submit BEFORE the site's own handler (so a mailto: action or inline-success
 * handler never fires), POSTs JSON to the lead endpoint, then reveals the
 * form's existing success element (#formSuccess / .form-success) or injects a
 * small one. No visual change at rest. */
(function () {
  "use strict";
  var ENDPOINT =
    (document.currentScript && document.currentScript.dataset.endpoint) ||
    window.__LEAD_ENDPOINT__ ||
    "https://admin.deleadint.com/api/lead";

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

  function showOk(form) {
    var ok =
      form.querySelector("#formSuccess") ||
      form.querySelector(".form-success") ||
      form.querySelector("[data-form-success]");
    if (ok) {
      ok.hidden = false;
      ok.style.display = "";
      ok.removeAttribute("hidden");
    } else {
      var p = document.createElement("p");
      p.textContent =
        "Thanks — your message is in. We'll be in touch within a couple of working days.";
      p.style.cssText = "margin-top:16px;font-weight:600;color:#15803d;";
      form.appendChild(p);
    }
  }
  function showErr(form) {
    var p = document.createElement("p");
    p.textContent = "Something went wrong. Please email info@deleadint.com.";
    p.style.cssText = "margin-top:16px;font-weight:600;color:#b91c1c;";
    form.appendChild(p);
  }

  function wire(form) {
    var source = form.dataset.leadSource;
    form.addEventListener(
      "submit",
      function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        if (form.dataset.leadBusy) return;
        if (typeof form.reportValidity === "function" && !form.reportValidity()) return;
        // honeypot
        var hp = form.querySelector('input[name="company_website"]');
        if (hp && hp.value) {
          showOk(form);
          return;
        }
        form.dataset.leadBusy = "1";
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
            try {
              form.reset();
            } catch (_) {}
            showOk(form);
          })
          .catch(function () {
            showErr(form);
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
