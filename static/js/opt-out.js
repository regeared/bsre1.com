(function () {
  "use strict";

  var API_BASE = "https://api.regear.cc/team-swarm";
  var TAG_BODY = /^[0289PYLQGRJCUV]+$/;

  var form = document.getElementById("opt-out-form");
  var input = document.getElementById("tag");
  var status = document.getElementById("status");
  var buttons = Array.prototype.slice.call(form.querySelectorAll("button"));

  // Mirrors the server-side normalization so the user sees what will be stored.
  function canonicalPlayerTag(raw) {
    var body = raw.trim().toUpperCase().replace(/O/g, "0");
    if (body.charAt(0) === "#") body = body.slice(1);
    if (!body || !TAG_BODY.test(body)) return null;
    body = body.replace(/^0+(?=.)/, "");
    return "#" + body;
  }

  function track(action, result, status) {
    if (window.regearedAnalytics) {
      window.regearedAnalytics.capture("opt_out_submit", { action: action, result: result, status: status || null });
    }
  }

  function setStatus(kind, text) {
    status.className = "opt-out-status" + (kind ? " is-" + kind : "");
    status.textContent = text || "";
  }

  function setBusy(busy) {
    buttons.forEach(function (b) { b.disabled = busy; });
  }

  function describeError(res, body) {
    var code = body && body.error;
    if (res.status === 429) {
      var wait = body && body.retry_after;
      return "Too many requests. Try again in " + (wait ? Math.ceil(wait / 60) + " minute(s)" : "a bit") + ".";
    }
    if (code === "invalid_tag") return "That doesn't look like a valid player tag.";
    if (res.status === 503) return "The opt-out service is temporarily unavailable. Please try again shortly.";
    return "Something went wrong (" + res.status + "). Please try again.";
  }

  function submit(action) {
    var tag = canonicalPlayerTag(input.value);
    if (!tag) {
      setStatus("error", "Enter a valid player tag. Allowed characters: 0 2 8 9 P Y L Q G R J C U V.");
      track(action, "invalid_tag");
      input.focus();
      return;
    }
    input.value = tag.slice(1);

    setBusy(true);
    setStatus("pending", action === "opt-out" ? "Opting out " + tag + "…" : "Opting " + tag + " back in…");

    fetch(API_BASE + "/" + action, {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tag: tag }),
    })
      .then(function (res) {
        if (res.status === 204) {
          track(action, "success", 204);
          setStatus(
            "success",
            action === "opt-out"
              ? tag + " is opted out. Our swarm will leave any room it finds you in."
              : tag + " is opted back in."
          );
          return;
        }
        return res
          .json()
          .catch(function () { return null; })
          .then(function (body) {
            track(action, res.status === 429 ? "rate_limited" : res.status === 403 ? "blocked" : "error", res.status);
            setStatus("error", describeError(res, body));
          });
      })
      .catch(function () {
        track(action, "network_error");
        setStatus("error", "Could not reach the opt-out service. Check your connection and try again.");
      })
      .then(function () { setBusy(false); });
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    submit("opt-out");
  });

  buttons.forEach(function (b) {
    if (b.dataset.action === "opt-in") {
      b.addEventListener("click", function () { submit("opt-in"); });
    }
  });

  input.addEventListener("input", function () {
    if (status.textContent) setStatus(null, "");
  });
})();
