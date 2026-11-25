/* Consent for Google Analytics. Only included in the build when a GA4 ID is set in src/config.json.
   Nothing loads until the visitor clicks Accept. Rejecting is as easy as accepting.
   The choice is remembered in one first-party cookie (av_consent) for 180 days. That cookie only
   stores the choice, which ICO guidance treats as exempt from consent. */
(function () {
  "use strict";
  var meta = document.querySelector('meta[name="ga4-id"]');
  var id = meta && meta.content;
  var banner = document.getElementById("consent");
  if (!id || !banner) return;

  function read() {
    var m = document.cookie.match(/(?:^|; )av_consent=(granted|denied)/);
    return m ? m[1] : null;
  }
  function save(v) {
    document.cookie = "av_consent=" + v + "; Max-Age=" + 180 * 24 * 3600 + "; Path=/; SameSite=Lax; Secure";
  }
  function loadGA() {
    if (window.__gaLoaded) return;
    window.__gaLoaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", id, { anonymize_ip: true });
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(id);
    document.head.appendChild(s);
  }

  var choice = read();
  if (choice === "granted") loadGA();
  if (!choice) banner.hidden = false;

  banner.addEventListener("click", function (e) {
    var b = e.target.closest("[data-consent]");
    if (!b) return;
    var v = b.getAttribute("data-consent") === "accept" ? "granted" : "denied";
    save(v);
    banner.hidden = true;
    if (v === "granted") loadGA();
  });

  // Footer or cookie page link: <a href="#" data-consent-reopen>Change cookie settings</a>
  document.addEventListener("click", function (e) {
    if (e.target.closest("[data-consent-reopen]")) { e.preventDefault(); banner.hidden = false; }
  });
})();
