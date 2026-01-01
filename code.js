console.log ("script is working 16")

(function () {
  "use strict";

  // ===== CONFIG =====
  var WISP_TARGET_SELECTOR = "#create-post__trigger";
  var WISP_DELAY_MS = 10000; // 10 seconds

  // ===== SIMPLE ONSCREEN BADGE (so you can see it even if console is noisy) =====
  var WISP_BADGE_ID = "wisp_delay_badge_v1";

  function WISP_badge(msg) {
    try {
      if (!document.body) return;
      var el = document.getElementById(WISP_BADGE_ID);
      if (!el) {
        el = document.createElement("div");
        el.id = WISP_BADGE_ID;
        el.style.cssText =
          "position:fixed;bottom:12px;left:12px;z-index:999999;" +
          "background:#111827;color:#e5e7eb;padding:10px 12px;border-radius:10px;" +
          "font:12px/1.35 Arial;border:1px solid rgba(255,255,255,0.15);" +
          "box-shadow:0 10px 25px rgba(0,0,0,.35);max-width:70vw;white-space:pre-wrap;";
        document.body.appendChild(el);
      }
      el.textContent = String(msg);
    } catch (e) {}
  }

  function WISP_log(msg) {
    try { console.log("[WISP_DELAY]", msg); } catch (e) {}
    WISP_badge(msg);
  }

  // ===== POPUP (minimal) =====
  function WISP_showPopup() {
    try {
      if (!document.body) return;

      // prevent duplicates
      if (document.getElementById("wisp_popup_v1")) return;

      var backdrop = document.createElement("div");
      backdrop.id = "wisp_popup_v1";
      backdrop.style.cssText =
        "position:fixed;top:0;left:0;right:0;bottom:0;z-index:999998;" +
        "background:rgba(0,0,0,0.55);display:flex;align-items:center;justify-content:center;padding:24px;";

      var modal = document.createElement("div");
      modal.style.cssText =
        "width:100%;max-width:520px;background:#0b1220;color:#eaf0ff;" +
        "border:1px solid rgba(255,255,255,0.10);border-radius:16px;" +
        "box-shadow:0 20px 60px rgba(0,0,0,0.45);padding:18px;position:relative;";

      var title = document.createElement("div");
      title.style.cssText = "font-size:18px;font-weight:800;margin-bottom:6px;";
      title.textContent = "Welcome to the Community";

      var body = document.createElement("div");
      body.style.cssText = "font-size:13px;line-height:1.45;color:rgba(234,240,255,0.85);";
      body.textContent = "Your tutorials will appear here. This popup was triggered 10 seconds after the Create Post button became visible.";

      var btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = "Close";
      btn.style.cssText =
        "margin-top:14px;padding:10px 14px;border-radius:12px;cursor:pointer;" +
        "border:1px solid rgba(255,255,255,0.14);background:rgba(255,255,255,0.06);color:#eaf0ff;font-weight:700;";

      btn.onclick = function () {
        try { backdrop.parentNode && backdrop.parentNode.removeChild(backdrop); } catch (e) {}
      };

      backdrop.onclick = function (e) {
        if (e && e.target === backdrop) btn.onclick();
      };

      modal.appendChild(title);
      modal.appendChild(body);
      modal.appendChild(btn);
      backdrop.appendChild(modal);
      document.body.appendChild(backdrop);
    } catch (e2) {}
  }

  // ===== WAIT FOR BODY (so badge/popup can render) =====
  function WISP_waitForBody(next) {
    var tries = 0;
    var t = setInterval(function () {
      tries += 1;
      if (document && document.body) {
        clearInterval(t);
        next();
      }
      if (tries > 400) clearInterval(t); // ~20s
    }, 50);
  }

  // ===== CORE FLOW =====
  function WISP_boot() {
    WISP_log("Script loaded. Waiting for target: " + WISP_TARGET_SELECTOR);

    var hasTriggered = false;
    var intersectionObserver = null;
    var mutationObserver = null;

    function cleanup() {
      try { if (intersectionObserver) intersectionObserver.disconnect(); } catch (e) {}
      try { if (mutationObserver) mutationObserver.disconnect(); } catch (e2) {}
    }

    function scheduleAfterVisible() {
      if (hasTriggered) return;
      hasTriggered = true;
      cleanup();

      WISP_log("Target visible. Starting 10s delay...");
      setTimeout(function () {
        // Confirm the element still exists
        var stillThere = document.querySelector(WISP_TARGET_SELECTOR);
        if (!stillThere) {
          WISP_log("After 10s: target not found anymore. Aborting.");
          return;
        }
        WISP_log("10s elapsed. Showing popup now.");
        WISP_showPopup();
      }, WISP_DELAY_MS);
    }

    function attachIntersection(targetEl) {
      if (!targetEl || hasTriggered) return;

      intersectionObserver = new IntersectionObserver(function (entries) {
        for (var i = 0; i < entries.length; i++) {
          if (entries[i] && entries[i].isIntersecting) {
            scheduleAfterVisible();
            break;
          }
        }
      }, { threshold: 0.25 });

      intersectionObserver.observe(targetEl);
      WISP_log("Target found. Watching viewport visibility...");
    }

    // If exists now
    var targetNow = document.querySelector(WISP_TARGET_SELECTOR);
    if (targetNow) {
      attachIntersection(targetNow);
      return;
    }

    // Else wait via MutationObserver
    mutationObserver = new MutationObserver(function () {
      if (hasTriggered) return;
      var t = document.querySelector(WISP_TARGET_SELECTOR);
      if (t) attachIntersection(t);
    });

    mutationObserver.observe(document.documentElement, { childList: true, subtree: true });

    // Safety stop
    setTimeout(function () {
      cleanup();
      WISP_log("Safety stop reached (60s). Observers disconnected.");
    }, 60000);
  }

  // Start only when body exists
  WISP_waitForBody(WISP_boot);

})();

