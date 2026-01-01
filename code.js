console.log ("script is working 12")
(function () {
  "use strict";

  /***************
   * CONFIG
   ***************/
  const TARGET_SELECTOR = "#create-post__trigger";

  // Your custom field + watched value
  const TUTORIAL_FIELD_ID = "pMR80x1BrnpsGE0ULX6e";
  const WATCHED_VALUE = "Watched";

  // GHL API
  const API_BASE = "https://services.leadconnectorhq.com";
  const API_VERSION = "2021-07-28";
  const API_TOKEN = "pit-7a2aa063-5698-4490-a39c-d167acbeb4e4";

  // Replace with your real 5 embed links
  const VIDEO_EMBEDS = [
    "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "https://www.youtube.com/embed/dQw4w9WgXcQ",
  ];

  function log() {
    try {
      console.log.apply(console, ["[TUT]"].concat([].slice.call(arguments)));
    } catch (e) {
      // ignore
    }
  }

  /***************
   * UID FROM FIREBASE LOCALSTORAGE
   ***************/
  function getUidFromFirebaseLocalStorage() {
    const prefix = "firebase:authUser:";
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key || key.indexOf(prefix) !== 0) continue;

        const raw = localStorage.getItem(key);
        if (!raw) continue;

        try {
          const obj = JSON.parse(raw);
          if (obj && obj.uid) return String(obj.uid).trim();
        } catch (parseErr) {
          // ignore
        }
      }
    } catch (storageErr) {
      // ignore
    }
    return null;
  }

  /***************
   * API
   ***************/
  function fetchContact(uid) {
    const url = API_BASE + "/contacts/" + encodeURIComponent(uid);

    return fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Version: API_VERSION,
        Authorization: "Bearer " + API_TOKEN,
      },
    }).then(function (res) {
      if (!res.ok) {
        return res.text().then(function (t) {
          throw new Error("GET failed: " + res.status + " " + String(t || "").slice(0, 200));
        });
      }
      return res.json();
    });
  }

  function updateContactWatched(uid) {
    const url = API_BASE + "/contacts/" + encodeURIComponent(uid);

    return fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Version: API_VERSION,
        Authorization: "Bearer " + API_TOKEN,
      },
      body: JSON.stringify({
        customFields: [
          { id: TUTORIAL_FIELD_ID, field_value: WATCHED_VALUE } // matches your curl
        ],
      }),
    }).then(function (res) {
      if (!res.ok) {
        return res.text().then(function (t) {
          throw new Error("PUT failed: " + res.status + " " + String(t || "").slice(0, 200));
        });
      }
      return res.json();
    });
  }

  function getCustomFieldValue(contactResp) {
    const contact = contactResp && contactResp.contact ? contactResp.contact : null;
    const fields = contact && contact.customFields ? contact.customFields : [];
    for (let i = 0; i < fields.length; i++) {
      const f = fields[i];
      if (String(f.id) === TUTORIAL_FIELD_ID) {
        return f.value == null ? "" : String(f.value).trim();
      }
    }
    return "";
  }

  function isWatched(value) {
    return String(value || "").trim().toLowerCase() === String(WATCHED_VALUE).toLowerCase();
  }

  /***************
   * STYLE INJECTION
   ***************/
  function injectStyles() {
    if (document.getElementById("ghl-tutorial-popup-styles")) return;

    const style = document.createElement("style");
    style.id = "ghl-tutorial-popup-styles";
    style.textContent = `
      .ghl-tut-backdrop {
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.60);
        backdrop-filter: blur(5px);
        z-index: 999999;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 24px;
        opacity: 0;
        transition: opacity 180ms ease;
      }
      .ghl-tut-backdrop.ghl-show { opacity: 1; }

      .ghl-tut-modal {
        width: min(820px, 100%);
        background: #0b1220;
        color: #eaf0ff;
        border: 1px solid rgba(255,255,255,0.10);
        border-radius: 18px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.45);
        transform: translateY(10px) scale(0.98);
        transition: transform 180ms ease;
        overflow: hidden;
        position: relative;
      }
      .ghl-tut-backdrop.ghl-show .ghl-tut-modal {
        transform: translateY(0) scale(1);
      }

      .ghl-tut-close {
        position: absolute;
        top: 10px;
        right: 10px;
        width: 34px;
        height: 34px;
        border-radius: 10px;
        border: 1px solid rgba(255,255,255,0.12);
        background: rgba(255,255,255,0.06);
        color: rgba(234,240,255,0.9);
        cursor: pointer;
        display: grid;
        place-items: center;
      }

      .ghl-tut-header {
        padding: 18px 18px 10px 18px;
        border-bottom: 1px solid rgba(255,255,255,0.08);
      }
      .ghl-tut-title {
        margin: 0;
        font-size: 18px;
        font-weight: 800;
        letter-spacing: 0.2px;
      }
      .ghl-tut-sub {
        margin: 6px 0 0 0;
        color: rgba(234,240,255,0.80);
        font-size: 13px;
        line-height: 1.4;
      }

      .ghl-tut-content { padding: 16px 18px 12px 18px; }
      .ghl-tut-videoWrap {
        background: rgba(255,255,255,0.04);
        border: 1px solid rgba(255,255,255,0.10);
        border-radius: 14px;
        overflow: hidden;
      }
      .ghl-tut-iframe {
        width: 100%;
        height: min(52vh, 420px);
        border: 0;
        display: block;
      }

      .ghl-tut-progress {
        display: flex;
        gap: 8px;
        align-items: center;
        justify-content: center;
        padding: 12px 0 0 0;
      }
      .ghl-tut-dot {
        width: 8px; height: 8px; border-radius: 99px;
        background: rgba(234,240,255,0.25);
      }
      .ghl-tut-dot.active { background: rgba(59,130,246,0.95); }

      .ghl-tut-actions {
        padding: 14px 18px 18px 18px;
        display: flex;
        justify-content: space-between;
        gap: 10px;
        border-top: 1px solid rgba(255,255,255,0.08);
      }
      .ghl-tut-actions-left, .ghl-tut-actions-right {
        display: flex;
        gap: 10px;
        align-items: center;
      }

      .ghl-tut-btn {
        border: 1px solid rgba(255,255,255,0.14);
        background: rgba(255,255,255,0.06);
        color: #eaf0ff;
        padding: 10px 14px;
        border-radius: 12px;
        cursor: pointer;
        font-weight: 700;
        font-size: 13px;
      }
      .ghl-tut-btn-primary {
        border: none;
        background: linear-gradient(135deg, #3b82f6, #22c55e);
        color: #07101f;
      }
      .ghl-tut-btn:disabled { opacity: 0.45; cursor: not-allowed; }
    `;
    document.head.appendChild(style);
  }

  /***************
   * POPUP UI (5 videos)
   ***************/
  function buildTutorialPopup(onFinishPromiseFn) {
    injectStyles();

    let stepIndex = 0;

    const backdrop = document.createElement("div");
    backdrop.className = "ghl-tut-backdrop";
    backdrop.setAttribute("role", "dialog");
    backdrop.setAttribute("aria-modal", "true");

    const modal = document.createElement("div");
    modal.className = "ghl-tut-modal";

    const closeBtn = document.createElement("button");
    closeBtn.className = "ghl-tut-close";
    closeBtn.type = "button";
    closeBtn.setAttribute("aria-label", "Close popup");
    closeBtn.innerHTML = "✕";

    const header = document.createElement("div");
    header.className = "ghl-tut-header";

    const title = document.createElement("h3");
    title.className = "ghl-tut-title";
    title.textContent = "Welcome to the Community";

    const sub = document.createElement("p");
    sub.className = "ghl-tut-sub";
    sub.textContent = "Watch these 5 quick tutorials to get oriented (or skip and come back later).";

    header.appendChild(title);
    header.appendChild(sub);

    const content = document.createElement("div");
    content.className = "ghl-tut-content";

    const videoWrap = document.createElement("div");
    videoWrap.className = "ghl-tut-videoWrap";

    const iframe = document.createElement("iframe");
    iframe.className = "ghl-tut-iframe";
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    iframe.allowFullscreen = true;

    videoWrap.appendChild(iframe);

    const progress = document.createElement("div");
    progress.className = "ghl-tut-progress";

    const dots = [];
    for (let i = 0; i < VIDEO_EMBEDS.length; i++) {
      const d = document.createElement("div");
      d.className = "ghl-tut-dot";
      progress.appendChild(d);
      dots.push(d);
    }

    content.appendChild(videoWrap);
    content.appendChild(progress);

    const actions = document.createElement("div");
    actions.className = "ghl-tut-actions";

    const left = document.createElement("div");
    left.className = "ghl-tut-actions-left";

    const right = document.createElement("div");
    right.className = "ghl-tut-actions-right";

    const backBtn = document.createElement("button");
    backBtn.className = "ghl-tut-btn";
    backBtn.type = "button";
    backBtn.textContent = "Back";

    const skipBtn = document.createElement("button");
    skipBtn.className = "ghl-tut-btn";
    skipBtn.type = "button";
    skipBtn.textContent = "Skip";

    const nextBtn = document.createElement("button");
    nextBtn.className = "ghl-tut-btn ghl-tut-btn-primary";
    nextBtn.type = "button";
    nextBtn.textContent = "Next";

    left.appendChild(backBtn);
    left.appendChild(skipBtn);
    right.appendChild(nextBtn);

    actions.appendChild(left);
    actions.appendChild(right);

    modal.appendChild(closeBtn);
    modal.appendChild(header);
    modal.appendChild(content);
    modal.appendChild(actions);

    backdrop.appendChild(modal);

    function renderStep() {
      iframe.src = VIDEO_EMBEDS[stepIndex] || "";
      for (let i = 0; i < dots.length; i++) {
        dots[i].classList.toggle("active", i === stepIndex);
      }
      backBtn.disabled = stepIndex === 0;

      const isLast = stepIndex === VIDEO_EMBEDS.length - 1;
      nextBtn.textContent = isLast ? "Done" : "Next";
    }

    function teardownAndMarkWatched() {
      backdrop.classList.remove("ghl-show");

      window.setTimeout(function () {
        try { backdrop.remove(); } catch (e) { /* ignore */ }
        document.removeEventListener("keydown", onKeydown);
      }, 180);

      // Call PUT on close/skip/done
      try {
        const p = onFinishPromiseFn && onFinishPromiseFn();
        if (p && typeof p.then === "function") {
          p.then(function () {
            log("Marked watched successfully.");
          }).catch(function (err) {
            log("Mark watched failed:", err);
          });
        }
      } catch (e) {
        log("Finish handler error:", e);
      }
    }

    function onKeydown(e) {
      if (e.key === "Escape") teardownAndMarkWatched();
    }

    closeBtn.addEventListener("click", teardownAndMarkWatched);
    skipBtn.addEventListener("click", teardownAndMarkWatched);

    backBtn.addEventListener("click", function () {
      if (stepIndex > 0) {
        stepIndex -= 1;
        renderStep();
      }
    });

    nextBtn.addEventListener("click", function () {
      const isLast = stepIndex === VIDEO_EMBEDS.length - 1;
      if (isLast) {
        teardownAndMarkWatched();
        return;
      }
      stepIndex += 1;
      renderStep();
    });

    backdrop.addEventListener("click", function (e) {
      if (e.target === backdrop) teardownAndMarkWatched();
    });

    document.addEventListener("keydown", onKeydown);

    document.body.appendChild(backdrop);
    renderStep();
    requestAnimationFrame(function () { backdrop.classList.add("ghl-show"); });
    window.setTimeout(function () { try { nextBtn.focus(); } catch (e) {} }, 50);
  }

  /***************
   * OBSERVERS (same technique as your working script)
   ***************/
  function waitForTargetThenRun() {
    let intersectionObserver = null;
    let mutationObserver = null;
    let hasTriggered = false;

    function cleanup() {
      if (intersectionObserver) intersectionObserver.disconnect();
      if (mutationObserver) mutationObserver.disconnect();
    }

    function attachIntersection(targetEl) {
      if (!targetEl || hasTriggered) return;

      intersectionObserver = new IntersectionObserver(function (entries) {
        for (let i = 0; i < entries.length; i++) {
          const entry = entries[i];
          if (!entry.isIntersecting || hasTriggered) continue;

          hasTriggered = true;
          cleanup();

          const uid = getUidFromFirebaseLocalStorage();
          if (!uid) {
            log("UID not found in firebase auth localStorage.");
            return;
          }

          log("UID found:", uid);

          fetchContact(uid)
            .then(function (contactResp) {
              const fieldVal = getCustomFieldValue(contactResp);
              log("Custom field value:", fieldVal || "(empty)");

              if (isWatched(fieldVal)) {
                log("Already watched -> popup suppressed.");
                return null;
              }

              buildTutorialPopup(function () {
                return updateContactWatched(uid);
              });

              return null;
            })
            .catch(function (err) {
              log("Flow error:", err);
            });

          break;
        }
      }, { threshold: 0.25 });

      intersectionObserver.observe(targetEl);
    }

    const targetNow = document.querySelector(TARGET_SELECTOR);
    if (targetNow) {
      attachIntersection(targetNow);
      return;
    }

    mutationObserver = new MutationObserver(function () {
      const target = document.querySelector(TARGET_SELECTOR);
      if (target) attachIntersection(target);
    });

    mutationObserver.observe(document.documentElement, { childList: true, subtree: true });

    window.setTimeout(function () {
      cleanup();
    }, 60000);
  }

  function boot() {
    waitForTargetThenRun();
  }

  boot();

  // SPA URL change re-boot (same as your working script)
  let lastUrl = location.href;
  new MutationObserver(function () {
    const currentUrl = location.href;
    if (currentUrl !== lastUrl) {
      lastUrl = currentUrl;
      boot();
    }
  }).observe(document, { subtree: true, childList: true });

})();
