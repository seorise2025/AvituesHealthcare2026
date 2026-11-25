/* Aviteus Healthcare site script. No libraries. Sets no cookies and uses no browser storage. */
(function () {
  "use strict";

  /* 0. Logo fallback: show the text wordmark if the logo file is missing */
  Array.prototype.forEach.call(document.querySelectorAll("img.brand-logo"), function (img) {
    var swap = function () { img.hidden = true; if (img.nextElementSibling) img.nextElementSibling.hidden = false; };
    if (img.complete && img.naturalWidth === 0) swap(); else img.addEventListener("error", swap);
  });

  /* 0b. Thank-you pages: show the enquiry reference from the URL */
  var refEl = document.querySelector("[data-ref]");
  if (refEl) {
    var ref = new URLSearchParams(location.search).get("ref") || "";
    if (/^AV-\d{8}-[A-Z0-9]{5}$/.test(ref)) { refEl.textContent = ref; refEl.parentElement.hidden = false; }
  }

  /* 1. Mobile menu */
  var toggle = document.querySelector("[data-menu-open]");
  var panel = document.getElementById("mobile-menu");
  var closeBtn = document.querySelector("[data-menu-close]");
  function openMenu() {
    panel.hidden = false;
    toggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
    closeBtn.focus();
  }
  function closeMenu() {
    panel.hidden = true;
    toggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    toggle.focus();
  }
  if (toggle && panel && closeBtn) {
    toggle.addEventListener("click", openMenu);
    closeBtn.addEventListener("click", closeMenu);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !panel.hidden) closeMenu();
    });
  }

  /* 2. Desktop dropdowns: keyboard and screen reader support */
  Array.prototype.forEach.call(document.querySelectorAll(".menu > li > button"), function (btn) {
    var li = btn.parentElement;
    btn.addEventListener("click", function () {
      var open = btn.getAttribute("aria-expanded") === "true";
      document.querySelectorAll(".menu > li.is-open").forEach(function (o) {
        o.classList.remove("is-open");
        o.querySelector("button").setAttribute("aria-expanded", "false");
      });
      if (!open) { li.classList.add("is-open"); btn.setAttribute("aria-expanded", "true"); }
    });
    li.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { li.classList.remove("is-open"); btn.setAttribute("aria-expanded", "false"); btn.focus(); }
    });
    li.addEventListener("focusout", function (e) {
      if (!li.contains(e.relatedTarget)) { li.classList.remove("is-open"); btn.setAttribute("aria-expanded", "false"); }
    });
  });

  /* 3. Lead forms */
  var FIELD_LABEL = function (el) {
    var id = el.id || "";
    var lab = id && document.querySelector('label[for="' + id + '"]');
    if (lab) return lab.textContent.replace("*", "").trim();
    var fs = el.closest("fieldset");
    var lg = fs && fs.querySelector("legend");
    return lg ? lg.textContent.replace("*", "").trim() : el.name;
  };

  function setError(form, name, msg) {
    var el = form.querySelector('[name="' + name + '"]');
    if (!el) return null;
    var wrap = el.closest(".field");
    if (wrap) {
      wrap.classList.add("has-error");
      var m = wrap.querySelector(".error-msg");
      if (m && msg) m.textContent = msg;
    }
    Array.prototype.forEach.call(form.querySelectorAll('[name="' + name + '"]'), function (x) {
      x.setAttribute("aria-invalid", "true");
    });
    return el;
  }

  function clearErrors(form) {
    form.querySelectorAll(".has-error").forEach(function (w) { w.classList.remove("has-error"); });
    form.querySelectorAll("[aria-invalid]").forEach(function (x) { x.setAttribute("aria-invalid", "false"); });
  }

  function showSummary(form, errs) {
    var box = form.querySelector(".error-summary");
    if (!box) return;
    var list = box.querySelector("ul");
    list.innerHTML = "";
    errs.forEach(function (e) {
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.href = "#" + (e.el.id || "");
      a.textContent = e.text;
      a.addEventListener("click", function (ev) { ev.preventDefault(); e.el.focus(); });
      li.appendChild(a);
      list.appendChild(li);
    });
    box.classList.add("is-visible");
    box.focus();
  }

  function validate(form) {
    var errs = [];
    var seen = {};
    form.querySelectorAll("[required]").forEach(function (el) {
      if (seen[el.name]) return;
      seen[el.name] = true;
      var ok;
      if (el.type === "radio") ok = !!form.querySelector('[name="' + el.name + '"]:checked');
      else if (el.type === "checkbox") ok = el.checked;
      else ok = el.value.trim() !== "" && el.checkValidity();
      if (!ok) {
        var wrap = el.closest(".field");
        var msg = wrap && wrap.querySelector(".error-msg");
        setError(form, el.name);
        errs.push({ el: el, text: msg ? msg.textContent : FIELD_LABEL(el) });
      }
    });
    return errs;
  }

  Array.prototype.forEach.call(document.querySelectorAll("form[data-lead-form]"), function (form) {
    // Context fields: page and referrer only. No storage on the visitor's device.
    var set = function (n, v) { var i = form.querySelector('[name="' + n + '"]'); if (i) i.value = v; };
    set("page_url", location.pathname);
    set("referrer", document.referrer ? document.referrer.slice(0, 300) : "");
    set("form_ts", String(Date.now()));
    try {
      var q = new URLSearchParams(location.search);
      ["utm_source", "utm_medium", "utm_campaign"].forEach(function (k) { if (q.get(k)) set(k, q.get(k).slice(0, 100)); });
    } catch (e) {}

    form.setAttribute("novalidate", "");
    var sendErr = form.querySelector(".send-error");

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      clearErrors(form);
      if (sendErr) sendErr.classList.remove("is-visible");
      var errs = validate(form);
      if (errs.length) { showSummary(form, errs); return; }
      var summary = form.querySelector(".error-summary");
      if (summary) summary.classList.remove("is-visible");

      var btn = form.querySelector('[type="submit"]');
      var label = btn.textContent;
      btn.disabled = true;
      btn.textContent = "Sending...";

      var body = new URLSearchParams(new FormData(form));
      fetch(form.action, {
        method: "POST",
        headers: { "Accept": "application/json", "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
        credentials: "omit"
      }).then(function (r) {
        return r.json().catch(function () { return {}; }).then(function (data) { return { status: r.status, data: data }; });
      }).then(function (res) {
        if (res.status === 200 && res.data.ok && res.data.redirect) {
          window.location.assign(res.data.redirect);
          return;
        }
        btn.disabled = false;
        btn.textContent = label;
        if (res.status === 400 && res.data.errors) {
          var list = [];
          Object.keys(res.data.errors).forEach(function (name) {
            var el = setError(form, name, res.data.errors[name]);
            if (el) list.push({ el: el, text: res.data.errors[name] });
          });
          if (list.length) { showSummary(form, list); return; }
        }
        if (sendErr) { sendErr.classList.add("is-visible"); sendErr.focus(); }
      }).catch(function () {
        btn.disabled = false;
        btn.textContent = label;
        if (sendErr) { sendErr.classList.add("is-visible"); sendErr.focus(); }
      });
    });

    form.addEventListener("change", function (e) {
      var wrap = e.target.closest(".field");
      if (wrap && wrap.classList.contains("has-error")) {
        var ok = e.target.type === "radio" || e.target.type === "checkbox" ? true : e.target.checkValidity();
        if (ok) { wrap.classList.remove("has-error"); e.target.setAttribute("aria-invalid", "false"); }
      }
    });
  });
})();
