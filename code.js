console.log ("script is working 22")


  // Prevent double run
  if (window.__GHL_TUT_FLOW_V1__) return;
  window.__GHL_TUT_FLOW_V1__ = true;

  var TARGET_SELECTOR = "#create-post__trigger";
  var CUSTOM_FIELD_ID = "pMR80x1BrnpsGE0ULX6e";
  var WATCHED_VALUE = "Watched";

  var API_BASE = "https://services.leadconnectorhq.com";
  var API_VERSION = "2021-07-28";
  var BEARER_TOKEN = "pit-7a2aa063-5698-4490-a39c-d167acbeb4e4";

  var fired = false;

  function log(msg) {
    try {
      console.log("[TUT]", msg);
    } catch (err) {
      /* console not available */
    }
  }

  function getUidFromLocalStorage() {
    var prefix = "firebase:authUser:";
    var i, k, raw, obj;

    try {
      for (i = 0; i < localStorage.length; i++) {
        k = localStorage.key(i);
        if (!k || k.indexOf(prefix) !== 0) continue;

        raw = localStorage.getItem(k);
        if (!raw) continue;

        try {
          obj = JSON.parse(raw);
          if (obj && obj.uid) return String(obj.uid).trim();
        } catch (parseErr) {
          /* ignore invalid JSON */
        }
      }
    } catch (storageErr) {
      /* localStorage not accessible in this context */
    }

    return null;
  }

  function getContact(uid) {
    return fetch(API_BASE + "/contacts/" + encodeURIComponent(uid), {
      method: "GET",
      headers: {
        Accept: "application/json",
        Version: API_VERSION,
        Authorization: "Bearer " + BEARER_TOKEN,
      },
    }).then(function (res) {
      if (!res.ok) {
        return res.text().then(function (t) {
          throw new Error(
            "GET failed: " + res.status + " " + String(t || "").slice(0, 160)
          );
        });
      }
      return res.json();
    });
  }

  function getCustomFieldValue(contactResp) {
    var fields =
      (contactResp && contactResp.contact && contactResp.contact.customFields) || [];
    var i, f;

    for (i = 0; i < fields.length; i++) {
      f = fields[i];
      if (String(f.id) === CUSTOM_FIELD_ID) {
        return f.value == null ? "" : String(f.value).trim();
      }
    }
    return "";
  }

  function isWatched(val) {
    return (
      String(val || "").trim().toLowerCase() ===
      String(WATCHED_VALUE).toLowerCase()
    );
  }

  function updateContactWatched(uid) {
    // Use field_value exactly as in your curl
    return fetch(API_BASE + "/contacts/" + encodeURIComponent(uid), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Version: API_VERSION,
        Authorization: "Bearer " + BEARER_TOKEN,
      },
      body: JSON.stringify({
        customFields: [
          {
            id: CUSTOM_FIELD_ID,
            field_value: WATCHED_VALUE,
          },
        ],
      }),
    }).then(function (res) {
      if (!res.ok) {
        return res.text().then(function (t) {
          throw new Error(
            "PUT failed: " + res.status + " " + String(t || "").slice(0, 160)
          );
        });
      }
      return res.json();
    });
  }

  function injectStyles() {
    if (document.getElementById("ghl-tut-styles")) return;

    var style = document.createElement("style");
    style.id = "ghl-tut-styles";
    style.textContent =
      ".ghl-tut-backdrop{position:fixed;inset:0;background:rgba(0,0,0,.55);backdrop-filter:blur(4px);z-index:999999;display:flex;align-items:center;justify-content:center;padding:24px;}" +
      ".ghl-tut-modal{width:min(620px,100%);background:#0b1220;color:#eaf0ff;border:1px solid rgba(255,255,255,.10);border-radius:18px;box-shadow:0 20px 60px rgba(0,0,0,.45);overflow:hidden;position:relative;}" +
      ".ghl-tut-title{padding:18px 18px 8px 18px;font:800 18px/1.2 Arial;margin:0;}" +
      ".ghl-tut-body{padding:0 18px 18px 18px;color:rgba(234,240,255,.86);font:14px/1.55 Arial;}" +
      ".ghl-tut-close{position:absolute;top:10px;right:10px;width:34px;height:34px;border-radius:10px;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.06);color:rgba(234,240,255,.9);cursor:pointer;display:grid;place-items:center;}";

    (document.head || document.documentElement).appendChild(style);
  }

  function showPopup() {
    if (document.getElementById("ghl-tut-popup")) return;

    injectStyles();

    var backdrop = document.createElement("div");
    backdrop.id = "ghl-tut-popup";
    backdrop.className = "ghl-tut-backdrop";

    var modal = document.createElement("div");
    modal.className = "ghl-tut-modal";

    var closeBtn = document.createElement("button");
    closeBtn.className = "ghl-tut-close";
    closeBtn.type = "button";
    closeBtn.innerHTML = "✕";

    var title = document.createElement("h3");
    title.className = "ghl-tut-title";
    title.textContent = "Welcome to the Community";

    var body = document.createElement("div");
    body.className = "ghl-tut-body";
    body.textContent =
      "We’re glad you’re here. Please watch the short tutorials to get oriented, then jump into the discussion.";

    function teardown() {
      try {
        backdrop.remove();
      } catch (err) {
        /* remove not supported */
      }
    }

    closeBtn.addEventListener("click", teardown);
    backdrop.addEventListener("click", function (evt) {
      if (evt.target === backdrop) teardown();
    });

    modal.appendChild(closeBtn);
    modal.appendChild(title);
    modal.appendChild(body);
    backdrop.appendChild(modal);
    document.body.appendChild(backdrop);
  }

  function runFlow() {
    if (fired) return;
    fired = true;

    var uid = getUidFromLocalStorage();
    if (!uid) {
      fired = false;
      log("UID not found. Flow aborted.");
      return;
    }

    log("UID found: " + uid + " — fetching contact…");

    getContact(uid)
      .then(function (resp) {
        var fieldVal = getCustomFieldValue(resp);
        log("Custom field value: " + (fieldVal || "(empty)"));

        if (isWatched(fieldVal)) {
          log("Field is Watched => do not show popup.");
          return null;
        }

        log("Field not Watched => show popup and set Watched.");
        showPopup();

        return updateContactWatched(uid).then(function (putResp) {
          log("PUT response succeded: " + String(putResp && putResp.succeded));
          return putResp;
        });
      })
      .catch(function (err) {
        fired = false; // allow retry if something fails
        log("Flow error: " + (err && err.message ? err.message : err));
      });
  }

  function waitForTargetThenTriggerOnViewport() {
    var intersectionObserver = null;
    var mutationObserver = null;

    function cleanup() {
      if (intersectionObserver) intersectionObserver.disconnect();
      if (mutationObserver) mutationObserver.disconnect();
    }

    function attachIntersection(el) {
      if (!el) return;

      if (intersectionObserver) intersectionObserver.disconnect();

      intersectionObserver = new IntersectionObserver(
        function (entries) {
          var i;
          for (i = 0; i < entries.length; i++) {
            if (entries[i].isIntersecting) {
              log("Target in viewport => running flow.");
              runFlow();
              cleanup();
              break;
            }
          }
        },
        { threshold: 0.25 }
      );

      intersectionObserver.observe(el);
      log("IntersectionObserver attached.");
    }

    var now = document.querySelector(TARGET_SELECTOR);
    if (now) {
      log("Target found immediately.");
      attachIntersection(now);
      return;
    }

    log("Waiting for target via MutationObserver…");

    mutationObserver = new MutationObserver(function () {
      var t = document.querySelector(TARGET_SELECTOR);
      if (t) {
        log("Target found via MutationObserver.");
        attachIntersection(t);
      }
    });

    mutationObserver.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
  }

  // Start immediately (no DOMContentLoaded)
  waitForTargetThenTriggerOnViewport();

