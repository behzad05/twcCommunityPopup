console.log ("script is working 14")


(function () {
  "use strict";

  /********************
   * CONFIG
   ********************/
  var WISP_TARGET_SELECTOR = "#create-post__trigger";

  var WISP_FIELD_ID = "pMR80x1BrnpsGE0ULX6e";
  var WISP_WATCHED_VALUE = "Watched";

  var WISP_API_BASE = "https://services.leadconnectorhq.com";
  var WISP_API_VERSION = "2021-07-28";
  var WISP_API_TOKEN = "pit-7a2aa063-5698-4490-a39c-d167acbeb4e4";

  // Replace with your real 5 embed URLs
  var WISP_VIDEO_EMBEDS = [
    "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "https://www.youtube.com/embed/dQw4w9WgXcQ"
  ];

  // Prevent double boot
  var WISP_BOOT_FLAG = "__WISP_TUT_BOOTED__";
  if (window[WISP_BOOT_FLAG]) return;
  window[WISP_BOOT_FLAG] = true;

  /********************
   * SAFE RUNNER
   ********************/
  function WISP_SAFE(name, fn) {
    try {
      fn();
    } catch (err) {
      WISP_UI_LOG("ERROR in " + name + ": " + (err && err.message ? err.message : String(err)));
    }
  }

  /********************
   * DEBUG UI (badge) - only after body exists
   ********************/
  var WISP_BADGE_ID = "wisp_tut_badge_20260101";
  var WISP_BADGE_QUEUE = [];
  var WISP_BADGE_READY = false;

  function WISP_UI_LOG(msg) {
    // Always try console (if available)
    try { console.log("[WISP_TUT]", msg); } catch (e) {}

    // Queue for badge until body exists
    if (!WISP_BADGE_READY) {
      WISP_BADGE_QUEUE.push(String(msg));
      return;
    }

    WISP_RENDER_BADGE(msg);
  }

  function WISP_RENDER_BADGE(msg) {
    try {
      var el = document.getElementById(WISP_BADGE_ID);
      if (!el) {
        el = document.createElement("div");
        el.id = WISP_BADGE_ID;
        el.style.cssText =
          "position:fixed;bottom:12px;left:12px;z-index:2147483647;" +
          "background:#111827;color:#e5e7eb;padding:10px 12px;border-radius:10px;" +
          "font:12px/1.35 Arial;border:1px solid rgba(255,255,255,0.15);" +
          "box-shadow:0 10px 25px rgba(0,0,0,.35);max-width:70vw;white-space:pre-wrap;";
        document.body.appendChild(el);
      }
      el.textContent = String(msg);
    } catch (e2) {
      // ignore
    }
  }

  function WISP_INIT_BADGE() {
    // Poll until body exists, then flush queued logs
    var tries = 0;
    var t = setInterval(function () {
      tries += 1;
      if (document && document.body) {
        clearInterval(t);
        WISP_BADGE_READY = true;

        // Flush queue
        if (WISP_BADGE_QUEUE.length) {
          WISP_RENDER_BADGE(WISP_BADGE_QUEUE[WISP_BADGE_QUEUE.length - 1]);
        } else {
          WISP_RENDER_BADGE("WISPCODE tutorial script loaded");
        }
      }
      if (tries > 200) { // ~10s if 50ms interval
        clearInterval(t);
      }
    }, 50);
  }

  /********************
   * UID DISCOVERY
   ********************/
  function WISP_GET_UID() {
    var prefix = "firebase:authUser:";
    try {
      for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        if (!key) continue;
        if (key.indexOf(prefix) !== 0) continue;

        var raw = localStorage.getItem(key);
        if (!raw) continue;

        try {
          var obj = JSON.parse(raw);
          if (obj && obj.uid) return String(obj.uid);
        } catch (parseErr) {
          // ignore
        }
      }
    } catch (e) {
      // ignore
    }
    return null;
  }

  /********************
   * API HELPERS (Promises)
   ********************/
  function WISP_API_GET_CONTACT(uid) {
    var url = WISP_API_BASE + "/contacts/" + encodeURIComponent(uid);

    return fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Version: WISP_API_VERSION,
        Authorization: "Bearer " + WISP_API_TOKEN
      }
    }).then(function (res) {
      if (!res.ok) {
        return res.text().then(function (t) {
          throw new Error("GET failed: " + res.status + " " + String(t || "").slice(0, 120));
        });
      }
      return res.json();
    });
  }

  function WISP_API_PUT_WATCHED(uid) {
    var url = WISP_API_BASE + "/contacts/" + encodeURIComponent(uid);

    return fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Version: WISP_API_VERSION,
        Authorization: "Bearer " + WISP_API_TOKEN
      },
      body: JSON.stringify({
        customFields: [
          { id: WISP_FIELD_ID, field_value: WISP_WATCHED_VALUE }
        ]
      })
    }).then(function (res) {
      if (!res.ok) {
        return res.text().then(function (t) {
          throw new Error("PUT failed: " + res.status + " " + String(t || "").slice(0, 120));
        });
      }
      return res.json();
    });
  }

  function WISP_GET_FIELD_VALUE(contactResp) {
    var contact = contactResp && contactResp.contact ? contactResp.contact : null;
    var fields = contact && contact.customFields ? contact.customFields : [];
    for (var i = 0; i < fields.length; i++) {
      var f = fields[i];
      if (f && String(f.id) === String(WISP_FIELD_ID)) {
        return f.value == null ? "" : String(f.value);
      }
    }
    return "";
  }

  function WISP_IS_WATCHED(val) {
    return String(val || "").toLowerCase() === String(WISP_WATCHED_VALUE).toLowerCase();
  }

  /********************
   * POPUP STYLES (string only)
   ********************/
  function WISP_INJECT_POPUP_STYLES() {
    if (document.getElementById("wispTutStyles_20260101")) return;

    var css = ""
      + ".wispTutBackdrop_20260101{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,.60);z-index:999999;display:flex;align-items:center;justify-content:center;padding:24px;opacity:0;transition:opacity 180ms ease;}"
      + ".wispTutBackdrop_20260101.wispShow_20260101{opacity:1;}"
      + ".wispTutModal_20260101{width:100%;max-width:820px;background:#0b1220;color:#eaf0ff;border:1px solid rgba(255,255,255,.10);border-radius:18px;box-shadow:0 20px 60px rgba(0,0,0,.45);transform:translateY(10px) scale(.98);transition:transform 180ms ease;overflow:hidden;position:relative;}"
      + ".wispTutBackdrop_20260101.wispShow_20260101 .wispTutModal_20260101{transform:translateY(0) scale(1);}"
      + ".wispTutClose_20260101{position:absolute;top:10px;right:10px;width:34px;height:34px;border-radius:10px;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.06);color:rgba(234,240,255,.9);cursor:pointer;display:flex;align-items:center;justify-content:center;}"
      + ".wispTutHeader_20260101{padding:18px 18px 10px 18px;border-bottom:1px solid rgba(255,255,255,.08);}"
      + ".wispTutTitle_20260101{margin:0;font-size:18px;font-weight:800;letter-spacing:.2px;}"
      + ".wispTutSub_20260101{margin:6px 0 0 0;color:rgba(234,240,255,.80);font-size:13px;line-height:1.4;}"
      + ".wispTutContent_20260101{padding:16px 18px 12px 18px;}"
      + ".wispTutVideoWrap_20260101{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.10);border-radius:14px;overflow:hidden;}"
      + ".wispTutIframe_20260101{width:100%;height:420px;border:0;display:block;}"
      + ".wispTutProgress_20260101{display:flex;gap:8px;align-items:center;justify-content:center;padding:12px 0 0 0;}"
      + ".wispTutDot_20260101{width:8px;height:8px;border-radius:99px;background:rgba(234,240,255,.25);}"
      + ".wispTutDot_20260101.wispActive_20260101{background:rgba(59,130,246,.95);}"
      + ".wispTutActions_20260101{padding:14px 18px 18px 18px;display:flex;justify-content:space-between;gap:10px;border-top:1px solid rgba(255,255,255,.08);}"
      + ".wispTutBtn_20260101{border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.06);color:#eaf0ff;padding:10px 14px;border-radius:12px;cursor:pointer;font-weight:700;font-size:13px;}"
      + ".wispTutBtnPrimary_20260101{border:none;background:linear-gradient(135deg,#3b82f6,#22c55e);color:#07101f;}"
      + ".wispTutBtn_20260101:disabled{opacity:.45;cursor:not-allowed;}";

    var style = document.createElement("style");
    style.id = "wispTutStyles_20260101";
    style.type = "text/css";
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);
  }

  /********************
   * POPUP
   ********************/
  function WISP_SHOW_POPUP(uid) {
    WISP_SAFE("WISP_SHOW_POPUP", function () {
      WISP_INJECT_POPUP_STYLES();

      if (document.getElementById("wispTutBackdrop_20260101")) return;

      var stepIndex = 0;

      var backdrop = document.createElement("div");
      backdrop.id = "wispTutBackdrop_20260101";
      backdrop.className = "wispTutBackdrop_20260101";
      backdrop.setAttribute("role", "dialog");
      backdrop.setAttribute("aria-modal", "true");

      var modal = document.createElement("div");
      modal.className = "wispTutModal_20260101";

      var closeBtn = document.createElement("button");
      closeBtn.className = "wispTutClose_20260101";
      closeBtn.type = "button";
      closeBtn.innerHTML = "&#10005;";

      var header = document.createElement("div");
      header.className = "wispTutHeader_20260101";

      var title = document.createElement("h3");
      title.className = "wispTutTitle_20260101";
      title.textContent = "Welcome to the Community";

      var sub = document.createElement("p");
      sub.className = "wispTutSub_20260101";
      sub.textContent = "Watch these 5 quick tutorials to get oriented (or skip and come back later).";

      header.appendChild(title);
      header.appendChild(sub);

      var content = document.createElement("div");
      content.className = "wispTutContent_20260101";

      var videoWrap = document.createElement("div");
      videoWrap.className = "wispTutVideoWrap_20260101";

      var iframe = document.createElement("iframe");
      iframe.className = "wispTutIframe_20260101";
      iframe.setAttribute("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share");
      iframe.setAttribute("allowfullscreen", "true");

      videoWrap.appendChild(iframe);

      var progress = document.createElement("div");
      progress.className = "wispTutProgress_20260101";

      var dots = [];
      for (var i = 0; i < WISP_VIDEO_EMBEDS.length; i++) {
        var d = document.createElement("div");
        d.className = "wispTutDot_20260101";
        progress.appendChild(d);
        dots.push(d);
      }

      content.appendChild(videoWrap);
      content.appendChild(progress);

      var actions = document.createElement("div");
      actions.className = "wispTutActions_20260101";

      var backBtn = document.createElement("button");
      backBtn.className = "wispTutBtn_20260101";
      backBtn.type = "button";
      backBtn.textContent = "Back";

      var skipBtn = document.createElement("button");
      skipBtn.className = "wispTutBtn_20260101";
      skipBtn.type = "button";
      skipBtn.textContent = "Skip";

      var nextBtn = document.createElement("button");
      nextBtn.className = "wispTutBtn_20260101 wispTutBtnPrimary_20260101";
      nextBtn.type = "button";
      nextBtn.textContent = "Next";

      actions.appendChild(backBtn);
      actions.appendChild(skipBtn);
      actions.appendChild(nextBtn);

      modal.appendChild(closeBtn);
      modal.appendChild(header);
      modal.appendChild(content);
      modal.appendChild(actions);

      backdrop.appendChild(modal);

      function renderStep() {
        iframe.src = WISP_VIDEO_EMBEDS[stepIndex] || "";
        for (var j = 0; j < dots.length; j++) {
          dots[j].className = "wispTutDot_20260101" + (j === stepIndex ? " wispActive_20260101" : "");
        }
        backBtn.disabled = (stepIndex === 0);
        nextBtn.textContent = (stepIndex === WISP_VIDEO_EMBEDS.length - 1) ? "Done" : "Next";
      }

      function teardownAndMarkWatched() {
        // Close UI
        backdrop.className = "wispTutBackdrop_20260101";
        window.setTimeout(function () {
          try { backdrop.parentNode && backdrop.parentNode.removeChild(backdrop); } catch (e) {}
          document.removeEventListener("keydown", onKeydown);
        }, 180);

        // Mark watched (PUT)
        WISP_UI_LOG("Updating contact custom field to Watched...");
        WISP_API_PUT_WATCHED(uid)
          .then(function () {
            WISP_UI_LOG("Contact updated: Watched");
          })
          .catch(function (err) {
            WISP_UI_LOG("PUT error: " + (err && err.message ? err.message : String(err)));
          });
      }

      function onKeydown(e) {
        if (e && e.key === "Escape") teardownAndMarkWatched();
      }

      closeBtn.onclick = teardownAndMarkWatched;
      skipBtn.onclick = teardownAndMarkWatched;

      backBtn.onclick = function () {
        if (stepIndex > 0) {
          stepIndex -= 1;
          renderStep();
        }
      };

      nextBtn.onclick = function () {
        if (stepIndex === WISP_VIDEO_EMBEDS.length - 1) {
          teardownAndMarkWatched();
          return;
        }
        stepIndex += 1;
        renderStep();
      };

      backdrop.onclick = function (e) {
        if (e && e.target === backdrop) teardownAndMarkWatched();
      };

      document.addEventListener("keydown", onKeydown);

      document.body.appendChild(backdrop);
      renderStep();

      window.setTimeout(function () {
        backdrop.className = "wispTutBackdrop_20260101 wispShow_20260101";
      }, 0);

      window.setTimeout(function () {
        try { nextBtn.focus(); } catch (e) {}
      }, 50);
    });
  }

  /********************
   * FLOW: decide show/suppress
   ********************/
  function WISP_RUN_DECISION_FLOW() {
    WISP_SAFE("WISP_RUN_DECISION_FLOW", function () {
      WISP_UI_LOG("Decision flow start...");

      var uid = WISP_GET_UID();
      if (!uid) {
        WISP_UI_LOG("UID NOT FOUND in localStorage firebase auth record.");
        return;
      }

      WISP_UI_LOG("UID found: " + uid);
      WISP_UI_LOG("Fetching contact...");

      WISP_API_GET_CONTACT(uid)
        .then(function (resp) {
          var fieldVal = WISP_GET_FIELD_VALUE(resp);
          WISP_UI_LOG("Custom field value: " + (fieldVal ? fieldVal : "(empty)"));

          if (WISP_IS_WATCHED(fieldVal)) {
            WISP_UI_LOG("Already Watched -> popup suppressed.");
            return;
          }

          WISP_UI_LOG("Not Watched -> showing popup.");
          WISP_SHOW_POPUP(uid);
        })
        .catch(function (err) {
          WISP_UI_LOG("GET error: " + (err && err.message ? err.message : String(err)));
        });
    });
  }

  /********************
   * OBSERVERS (same technique as your working script)
   ********************/
  function WISP_WAIT_FOR_TARGET_THEN_TRIGGER_FLOW() {
    WISP_SAFE("WISP_WAIT_FOR_TARGET_THEN_TRIGGER_FLOW", function () {
      var hasTriggered = false;
      var intersectionObserver = null;
      var mutationObserver = null;

      function cleanup() {
        try { if (intersectionObserver) intersectionObserver.disconnect(); } catch (e) {}
        try { if (mutationObserver) mutationObserver.disconnect(); } catch (e2) {}
      }

      function attachIntersection(targetEl) {
        if (!targetEl || hasTriggered) return;

        intersectionObserver = new IntersectionObserver(function (entries) {
          for (var i = 0; i < entries.length; i++) {
            if (entries[i] && entries[i].isIntersecting) {
              hasTriggered = true;
              cleanup();
              WISP_UI_LOG("Trigger fired: element entered viewport");
              WISP_RUN_DECISION_FLOW();
              break;
            }
          }
        }, { threshold: 0.25 });

        intersectionObserver.observe(targetEl);
      }

      var targetNow = document.querySelector(WISP_TARGET_SELECTOR);
      if (targetNow) {
        WISP_UI_LOG("Target found immediately. Attaching IntersectionObserver.");
        attachIntersection(targetNow);
        return;
      }

      WISP_UI_LOG("Target not found yet. Attaching MutationObserver.");

      mutationObserver = new MutationObserver(function () {
        var t = document.querySelector(WISP_TARGET_SELECTOR);
        if (t) {
          WISP_UI_LOG("Target found via MutationObserver. Attaching IntersectionObserver.");
          attachIntersection(t);
        }
      });

      mutationObserver.observe(document.documentElement, { childList: true, subtree: true });

      window.setTimeout(function () {
        cleanup();
      }, 60000);
    });
  }

  /********************
   * SPA URL change handling
   ********************/
  function WISP_ATTACH_SPA_WATCHER() {
    WISP_SAFE("WISP_ATTACH_SPA_WATCHER", function () {
      var lastUrl = location.href;

      new MutationObserver(function () {
        var currentUrl = location.href;
        if (currentUrl !== lastUrl) {
          lastUrl = currentUrl;
          WISP_UI_LOG("URL changed -> reboot observers");
          WISP_WAIT_FOR_TARGET_THEN_TRIGGER_FLOW();
        }
      }).observe(document, { subtree: true, childList: true });
    });
  }

  /********************
   * BOOT
   ********************/
  function WISP_BOOT() {
    WISP_SAFE("WISP_BOOT", function () {
      WISP_INIT_BADGE();
      WISP_UI_LOG("WISPCODE tutorial script loaded");
      WISP_WAIT_FOR_TARGET_THEN_TRIGGER_FLOW();
      WISP_ATTACH_SPA_WATCHER();
    });
  }

  WISP_BOOT();

})();
