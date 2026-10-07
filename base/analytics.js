/*
 * REGeared site analytics (PostHog, EU region, served through i.regear.cc).
 *
 * Loaded first in every page's <head>. Provides:
 *   - automatic $pageview / $pageleave with GeoIP country, referrer, device
 *   - autocapture of clicks for ad-hoc questions
 *   - a named `link_click` event for every Discord / Telegram / GitHub /
 *     Purchase / Opt-out link, with where on the page it was clicked
 *   - window.regearedAnalytics.capture(name, props) for page scripts
 */
(function () {
  "use strict";

  var TOKEN = "phc_rSzxYxoDwcQaNVQHg23JWnMxF9W6B79toeRjwGzNgurA";
  var API_HOST = "https://i.regear.cc";

  // Official posthog-js stub loader (queues calls until array.js arrives).
  !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],Object.defineProperty(u,"toString",{configurable:!0,enumerable:!0,writable:!0,value:function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e}}),Object.defineProperty(u.people,"toString",{configurable:!0,enumerable:!0,writable:!0,value:function(){return u.toString(1)+".people (stub)"}}),o="init capture register register_once register_for_session unregister unregister_for_session getFeatureFlag getFeatureFlagResult isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey getNextSurveyStep identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty createPersonProfile opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing debug".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);

  posthog.init(TOKEN, {
    api_host: API_HOST,
    ui_host: "https://eu.posthog.com",
    defaults: "2026-05-30",
    capture_pageview: true,
    capture_pageleave: true,
    autocapture: true,
    persistence: "localStorage+cookie",
  });

  // Which official destination a link points at, or null.
  function linkTarget(href) {
    var h = (href || "").toLowerCase();
    if (h.indexOf("discord.gg/") !== -1 || h.indexOf("discord.com/invite") !== -1) return "discord";
    if (h.indexOf("github.com/") !== -1) return "github";
    if (h.indexOf("t.me/regeared_bot") !== -1) return "purchase";
    if (h.indexOf("t.me/") !== -1) return "telegram";
    if (/\/opt-out\/?(\?|#|$)/.test(h)) return "opt_out";
    if (/\/blog(\/|$)/.test(h)) return "blog";
    return null;
  }

  // Where on the page the link lives.
  function linkLocation(a) {
    if (a.closest("nav")) return "header";
    if (a.closest("footer")) return "footer";
    if (a.classList.contains("link-card")) return a.classList.contains("opt-out-card") ? "callout" : "card";
    return "body";
  }

  document.addEventListener(
    "click",
    function (e) {
      var a = e.target && e.target.closest ? e.target.closest("a[href]") : null;
      if (!a) return;
      var target = linkTarget(a.href);
      if (!target) return;
      posthog.capture(
        "link_click",
        {
          target: target,
          location: linkLocation(a),
          href: a.href,
          page: window.location.pathname,
        },
        { send_instantly: true }
      );
    },
    true
  );

  window.regearedAnalytics = {
    capture: function (name, props) {
      try {
        posthog.capture(name, props || {}, { send_instantly: true });
      } catch (err) {
        /* analytics must never break the page */
      }
    },
  };
})();
