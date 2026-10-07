const params = new URLSearchParams(window.location.search);
const service = params.get("service");

let url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";

switch (service) {
  case "github": {
    url = "https://github.com/REGeared";
    break;
  }
  case "discord": {
    url = "https://discord.gg/REGeared";
    break;
  }
  case "telegram": {
    url = "https://t.me/getregeared";
    break;
  }
  case "purchase": {
    url = "https://t.me/REGeared_bot";
    break;
  }
}
// Record the redirect with a direct beacon (survives navigation; no SDK needed).
try {
  var token = "phc_rSzxYxoDwcQaNVQHg23JWnMxF9W6B79toeRjwGzNgurA";
  var distinctId = null;
  try {
    var stored = JSON.parse(localStorage.getItem("ph_" + token + "_posthog") || "null");
    distinctId = stored && stored.distinct_id;
  } catch (e) {}
  if (!distinctId) distinctId = "anon-" + Math.random().toString(36).slice(2) + Date.now().toString(36);
  var payload = JSON.stringify({
    api_key: token,
    event: "redirect",
    distinct_id: distinctId,
    timestamp: new Date().toISOString(),
    properties: {
      service: service || "unknown",
      destination: url,
      $current_url: window.location.href,
      $referrer: document.referrer || "$direct",
      $lib: "redirect-beacon",
    },
  });
  var blob = new Blob([payload], { type: "application/json" });
  if (!(navigator.sendBeacon && navigator.sendBeacon("https://i.regear.cc/e/", blob))) {
    fetch("https://i.regear.cc/e/", { method: "POST", body: payload, keepalive: true, headers: { "Content-Type": "application/json" } });
  }
} catch (e) {}
window.location.replace(url);
