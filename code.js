console.log ("script is working 20")


  "use strict";

  var WISP_DELAY_MS = 10000;
  var WISP_ID = "wisp_simple_test_banner_v1";

  function WISP_show() {
    try {
      // prevent duplicates
      if (document.getElementById(WISP_ID)) return;

      var el = document.createElement("div");
      el.id = WISP_ID;
      el.style.cssText =
        "position:fixed;top:12px;left:12px;z-index:2147483647;" +
        "background:#111827;color:#e5e7eb;padding:12px 14px;border-radius:12px;" +
        "font:14px/1.3 Arial;border:1px solid rgba(255,255,255,0.15);" +
        "box-shadow:0 10px 25px rgba(0,0,0,.35);max-width:80vw;";
      el.textContent = "WISPCODE test: Custom JS executed after 10 seconds.";

      // close on click
      el.onclick = function () {
        try { el.parentNode && el.parentNode.removeChild(el); } catch (e) {}
      };

      // ensure body exists, else retry quickly
      if (!document.body) {
        setTimeout(WISP_show, 200);
        return;
      }

      document.body.appendChild(el);
      try { console.log("[WISP_SIMPLE] Banner injected after 10s."); } catch (e2) {}
    } catch (e3) {
      try { console.log("[WISP_SIMPLE] Error:", e3); } catch (e4) {}
    }
  }

  try {
    // schedule after 10 seconds
    setTimeout(WISP_show, WISP_DELAY_MS);
    try { console.log("[WISP_SIMPLE] Timer scheduled for 10s."); } catch (e5) {}
  } catch (e6) {
    // if even setTimeout fails, custom JS isn't running at all
  }

