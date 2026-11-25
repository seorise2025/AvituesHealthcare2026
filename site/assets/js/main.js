/* Aviteus Healthcare - site script. No libraries. */
(function () {
  "use strict";

  /* 1. Mobile menu */
  var toggle = document.querySelector("[data-menu-open]");
  var panel = document.getElementById("mobile-menu");
  var closeBtn = document.querySelector("[data-menu-close]");
  function openMenu() {
    if (!panel) return;
    panel.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
    if (closeBtn) closeBtn.focus();
  }
  function closeMenu() {
    if (!panel) return;
    panel.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    toggle.focus();
  }
  if (toggle) toggle.addEventListener("click", openMenu);
  if (closeBtn) closeBtn.addEventListener("click", closeMenu);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && panel && panel.classList.contains("is-open")) closeMenu();
  });

  /* 2. Review mode: add ?review=1 to see every unverified claim */
  try {
    if (new URLSearchParams(location.search).get("review") === "1") {
      document.documentElement.classList.add("review-mode");
    }
  } catch (e) {}

  /* 3. Capture source data for the CRM (UTM tags + landing page) */
  var source = {};
  try {
    var params = new URLSearchParams(location.search);
    ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid"].forEach(function (k) {
      if (params.get(k)) source[k] = params.get(k);
    });
    var stored = sessionStorage.getItem("av_source");
    if (!stored && Object.keys(source).length) {
      source.landing_page = location.pathname;
      sessionStorage.setItem("av_source", JSON.stringify(source));
    } else if (stored) {
      source = JSON.parse(stored);
    }
  } catch (e) {}

  /* 4. Forms: validation + submit to the CRM endpoint */
  var forms = document.querySelectorAll("form[data-lead-form]");
  Array.prototype.forEach.call(forms, function (form) {
    // Fill hidden source fields
    Object.keys(source).forEach(function (k) {
      var input = form.querySelector('[name="' + k + '"]');
      if (input) input.value = source[k];
    });
    var pageField = form.querySelector('[name="page_url"]');
    if (pageField) pageField.value = location.href.split("?")[0];

    form.setAttribute("novalidate", "");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var firstBad = null;
      Array.prototype.forEach.call(form.querySelectorAll("[required]"), function (el) {
        var wrap = el.closest(".field") || el.parentElement;
        var ok = el.type === "checkbox" ? el.checked : el.checkValidity() && el.value.trim() !== "";
        if (el.type === "radio") {
          ok = !!form.querySelector('[name="' + el.name + '"]:checked');
        }
        wrap.classList.toggle("has-error", !ok);
        el.setAttribute("aria-invalid", ok ? "false" : "true");
        if (!ok && !firstBad) firstBad = el;
      });
      if (firstBad) { firstBad.focus(); return; }

      // Honeypot
      var hp = form.querySelector(".hp input");
      if (hp && hp.value) return;

      var btn = form.querySelector('[type="submit"]');
      var label = btn ? btn.textContent : "";
      if (btn) { btn.disabled = true; btn.textContent = "Sending..."; }

      var endpoint = form.getAttribute("data-endpoint");
      var done = function () {
        var success = document.getElementById(form.getAttribute("data-success"));
        form.hidden = true;
        if (success) { success.classList.add("is-visible"); success.focus(); }
        // Analytics hook: GA4 / GTM
        if (window.dataLayer) window.dataLayer.push({ event: "lead_submit", lead_type: form.getAttribute("data-lead-form") });
      };
      if (!endpoint || endpoint.indexOf("REPLACE") === 0) {
        // Template mode: no backend yet
        setTimeout(done, 400);
        return;
      }
      fetch(endpoint, { method: "POST", body: new FormData(form) })
        .then(function (r) { if (!r.ok) throw new Error(r.status); done(); })
        .catch(function () {
          if (btn) { btn.disabled = false; btn.textContent = label; }
          alert("Sorry, that did not send. Please call 020 3488 8172 or email info@aviteushealthcare.co.uk.");
        });
    });

    // Clear error on input
    form.addEventListener("input", function (e) {
      var wrap = e.target.closest(".field");
      if (wrap && wrap.classList.contains("has-error") && e.target.checkValidity()) wrap.classList.remove("has-error");
    });
  });

  /* 5. Footer year */
  var y = document.querySelector("[data-year]");
  if (y) y.textContent = new Date().getFullYear();
})();
