console.log ("script is working 24")


function injectStyles() {
  if (document.getElementById("wisp-twc-styles")) return;

  // FontAwesome (optional). Loads once.
  if (!document.getElementById("wisp-fa-64")) {
    var fa = document.createElement("link");
    fa.id = "wisp-fa-64";
    fa.rel = "stylesheet";
    fa.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css";
    (document.head || document.documentElement).appendChild(fa);
  }

  var css = ""
  + "#wisp-twc-popup{"
  + "  --twc-gold:#d2b48c; --twc-gold-dark:#b89b74; --twc-gold-light:#e8d8c0;"
  + "  --twc-black:#1a1a1a; --twc-white:#fff; --twc-gray:#f8f8f8; --twc-gray-dark:#e8e8e8;"
  + "  --twc-text:#2c2c2c; --twc-text-light:#666;"
  + "  --shadow:0 15px 35px rgba(0,0,0,.1),0 5px 15px rgba(0,0,0,.07);"
  + "  --shadow-heavy:0 20px 50px rgba(0,0,0,.15),0 10px 25px rgba(0,0,0,.1);"
  + "  --radius:18px; --radius-sm:14px; --radius-lg:24px;"
  + "  -webkit-tap-highlight-color:transparent;"
  + "}"
  + "#wisp-twc-popup, #wisp-twc-popup *{box-sizing:border-box; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Inter,Arial,sans-serif;}"
  + "#wisp-twc-popup{position:fixed; inset:0; z-index:999999; display:flex; align-items:center; justify-content:center;"
  + "  padding: max(10px, env(safe-area-inset-top)) max(15px, env(safe-area-inset-right)) max(15px, env(safe-area-inset-bottom)) max(15px, env(safe-area-inset-left));"
  + "}"
  + "#wisp-twc-popup .wisp-backdrop{position:absolute; inset:0; background:rgba(0,0,0,.65); backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);}"
  + "#wisp-twc-popup .bg-overlay{position:absolute; inset:0; background-image:url('https://storage.googleapis.com/msgsndr/Tu9uF1zIX4jfmQ8VZzYg/media/694b465f147f516b70fc6e85.jpg');"
  + "  background-size:cover; background-position:center; filter:brightness(.25) blur(6px); opacity:.9; transform:scale(1.02);"
  + "}"
  + "#wisp-twc-popup .wisp-shell{position:relative; z-index:2; width:min(1200px, 100%); height: min(90vh, 850px);"
  + "  background: var(--twc-white); border-radius: var(--radius-lg); overflow:hidden; box-shadow: var(--shadow-heavy);"
  + "  border: 1px solid rgba(210,180,140,.15); display:flex; flex-direction:column;"
  + "}"
  + "#wisp-twc-popup .wisp-close{position:absolute; top:12px; right:12px; width:40px; height:40px; border-radius:50%;"
  + "  background: rgba(210,180,140,.18); border: 1px solid rgba(210,180,140,.30); color: var(--twc-gold-light);"
  + "  cursor:pointer; display:flex; align-items:center; justify-content:center; z-index:5;"
  + "}"
  + "#wisp-twc-popup .wisp-close:hover{background: rgba(210,180,140,.28); transform: rotate(90deg); transition: .25s ease;}"
  + "#wisp-twc-popup #twc-tracker-widget{height:100%; width:100%;}"

  // ====== Below is (mostly) your CSS but scoped to the popup only ======
  + "#wisp-twc-popup .twc-header{background:linear-gradient(135deg,var(--twc-black) 0%,#222 100%); color:#fff; padding:22px 35px;"
  + " display:flex; justify-content:space-between; align-items:center; border-bottom:4px solid var(--twc-gold); flex-shrink:0; min-height:85px; position:relative; overflow:hidden;}"
  + "#wisp-twc-popup .twc-header h2{font-size:1.5rem; font-weight:800; color:var(--twc-gold-light); letter-spacing:-.5px; display:flex; align-items:center; gap:12px; margin:0;}"
  + "#wisp-twc-popup .twc-header h2:before{content:'🏆'; font-size:1.3rem;}"
  + "#wisp-twc-popup .progress-container{min-width:200px; background:rgba(255,255,255,.05); padding:12px 16px; border-radius:12px; border:1px solid rgba(210,180,140,.2);}"
  + "#wisp-twc-popup .progress-text{font-size:.9rem; margin-bottom:10px; display:flex; justify-content:space-between; font-weight:600; gap:20px;}"
  + "#wisp-twc-popup .progress-text span:first-child{color:var(--twc-gold-light); opacity:.9;}"
  + "#wisp-twc-popup .progress-text span:last-child{color:var(--twc-gold); font-weight:700;}"
  + "#wisp-twc-popup .progress-bar-bg{width:100%; height:10px; background:rgba(255,255,255,.1); border-radius:6px; overflow:hidden; box-shadow:inset 0 1px 3px rgba(0,0,0,.3);}"
  + "#wisp-twc-popup .progress-bar-fill{height:100%; background:linear-gradient(90deg,var(--twc-gold),#e0c090); width:0%; transition:width .8s cubic-bezier(.34,1.56,.64,1); border-radius:6px; box-shadow:0 0 15px rgba(210,180,140,.3);}"
  + "#wisp-twc-popup .twc-main{display:flex; flex:1; overflow:hidden; min-height:0; background:linear-gradient(to right,#fff 0%,#fcfcfc 100%);}"
  + "#wisp-twc-popup .twc-content{flex:1; padding:30px; overflow-y:auto; display:flex; flex-direction:column; min-height:0;}"
  + "#wisp-twc-popup .content-header{margin-bottom:30px; padding-bottom:20px; border-bottom:2px solid var(--twc-gray-dark);}"
  + "#wisp-twc-popup .content-header h1{font-size:1.8rem; margin:0 0 10px 0; font-weight:800; line-height:1.2; letter-spacing:-.5px; color:var(--twc-black);}"
  + "#wisp-twc-popup .video-wrapper{width:100%; aspect-ratio:16/9; background:#000; border-radius:var(--radius-sm); overflow:hidden; margin-bottom:30px; position:relative; flex-shrink:0; box-shadow:0 10px 30px rgba(0,0,0,.2); border:1px solid rgba(0,0,0,.3);}"
  + "#wisp-twc-popup .video-wrapper video{position:absolute; top:0; left:0; width:100%; height:100%; object-fit:cover;}"
  + "#wisp-twc-popup .instruction-card{background:linear-gradient(to right,var(--twc-gray) 0%,#f0f0f0 100%); border-left:5px solid var(--twc-gold); padding:25px; border-radius:var(--radius-sm); margin-bottom:25px; box-shadow:0 5px 15px rgba(0,0,0,.05);}"
  + "#wisp-twc-popup .twc-sidebar{width:380px; background:linear-gradient(to bottom,#fafafa 0%,#f5f5f5 100%); border-left:1px solid var(--twc-gray-dark); padding:30px; overflow-y:auto; min-height:0;}"
  + "#wisp-twc-popup .twc-sidebar h4{font-size:.8rem; color:var(--twc-text-light); margin:0 0 20px 0; text-transform:uppercase; letter-spacing:1.5px; font-weight:700; padding-bottom:10px; position:relative;}"
  + "#wisp-twc-popup .twc-sidebar h4:after{content:''; position:absolute; bottom:0; left:0; width:40px; height:2px; background:var(--twc-gold);}"
  + "#wisp-twc-popup .step-card{padding:18px; background:#fff; border:1px solid var(--twc-gray-dark); border-radius:var(--radius-sm); margin-bottom:15px; cursor:pointer; display:flex; align-items:center; gap:15px; transition:all .3s cubic-bezier(.4,0,.2,1); position:relative; overflow:hidden;}"
  + "#wisp-twc-popup .step-card:before{content:''; position:absolute; top:0; left:0; width:4px; height:100%; background:transparent; transition:all .3s cubic-bezier(.4,0,.2,1);}"
  + "#wisp-twc-popup .step-card:hover{transform:translateY(-3px); box-shadow:0 8px 25px rgba(0,0,0,.1); border-color:var(--twc-gold-light);}"
  + "#wisp-twc-popup .step-card:hover:before{background:var(--twc-gold);}"
  + "#wisp-twc-popup .step-card.active{background:linear-gradient(135deg,var(--twc-black),#2a2a2a); color:#fff; border-color:var(--twc-gold); box-shadow:0 8px 25px rgba(0,0,0,.2);}"
  + "#wisp-twc-popup .step-card.active:before{background:var(--twc-gold);}"
  + "#wisp-twc-popup .step-num{width:36px; height:36px; border-radius:50%; background:var(--twc-gray); display:flex; align-items:center; justify-content:center; font-weight:800; flex-shrink:0; font-size:.9rem; color:var(--twc-text); transition:all .3s cubic-bezier(.4,0,.2,1);}"
  + "#wisp-twc-popup .step-card:hover .step-num{background:var(--twc-gold-light);}"
  + "#wisp-twc-popup .step-card.active .step-num{background:var(--twc-gold); color:var(--twc-black); transform:scale(1.1);}"
  + "#wisp-twc-popup .step-title{font-size:1rem; font-weight:600; line-height:1.4;}"
  + "#wisp-twc-popup .step-progress-container{position:relative; height:22px; background:rgba(0,0,0,.06); border-radius:12px; margin-top:12px; overflow:hidden; box-shadow:inset 0 1px 3px rgba(0,0,0,.1);}"
  + "#wisp-twc-popup .step-progress-fill{height:100%; background:linear-gradient(90deg,var(--twc-gold),var(--twc-gold-dark)); width:0%; transition:width .6s cubic-bezier(.34,1.56,.64,1); border-radius:12px; box-shadow:0 2px 8px rgba(184,155,116,.3);}"
  + "#wisp-twc-popup .step-progress-text{position:absolute; top:50%; left:12px; transform:translateY(-50%); font-size:.75rem; font-weight:700; color:var(--twc-black); white-space:nowrap;}"
  + "#wisp-twc-popup .step-progress-text.inside-fill{left:0; width:100%; text-align:center;}"
  + "#wisp-twc-popup .twc-footer{padding:20px 35px; background:linear-gradient(to right,#fafafa,#f5f5f5); border-top:1px solid var(--twc-gray-dark); display:flex; justify-content:space-between; flex-shrink:0; gap:10px;}"
  + "#wisp-twc-popup .btn{padding:16px 28px; border-radius:var(--radius-sm); font-weight:700; cursor:pointer; border:none; font-size:.95rem; transition:all .3s cubic-bezier(.4,0,.2,1); min-width:140px;}"
  + "#wisp-twc-popup .btn:disabled{opacity:.4; cursor:not-allowed;}"
  + "#wisp-twc-popup .btn-prev{background:var(--twc-gray); color:var(--twc-text); border:1px solid var(--twc-gray-dark);}"
  + "#wisp-twc-popup .btn-next{background:linear-gradient(135deg,var(--twc-gold),var(--twc-gold-dark)); color:var(--twc-black);}"
  + "#wisp-twc-popup .btn-complete{background:linear-gradient(135deg,#27ae60,#219955); color:#fff;}"

  // Mobile optimizations (scoped)
  + "@media (max-width: 900px){"
  + "  #wisp-twc-popup .wisp-shell{height: min(85vh, 750px);}"
  + "}"
  + "@media (max-width: 768px){"
  + "  #wisp-twc-popup .wisp-shell{height: min(85vh, 900px); min-height: 600px;}"
  + "  #wisp-twc-popup .twc-main{flex-direction:column; overflow-y:auto;}"
  + "  #wisp-twc-popup .twc-sidebar{width:100%; border-left:none; border-top:1px solid var(--twc-gray-dark); padding:20px 15px; max-height:35vh;}"
  + "  #wisp-twc-popup .twc-content{padding:20px 15px; max-height:45vh;}"
  + "  #wisp-twc-popup .twc-header{padding:15px 20px; min-height:70px; flex-direction:column; gap:12px; align-items:flex-start;}"
  + "  #wisp-twc-popup .twc-header h2{font-size:1.1rem;}"
  + "  #wisp-twc-popup .progress-container{min-width:100%; width:100%; padding:10px 12px;}"
  + "  #wisp-twc-popup .content-header h1{font-size:1.3rem;}"
  + "  #wisp-twc-popup .video-wrapper{margin-bottom:20px; max-height:30vh;}"
  + "  #wisp-twc-popup .btn{padding:12px 15px; font-size:.85rem; min-width:110px; flex:1;}"
  + "}"
  + "@media (max-width: 390px){"
  + "  #wisp-twc-popup .wisp-shell{height:min(85vh, 900px); border-radius:15px;}"
  + "  #wisp-twc-popup .twc-header{padding:12px 15px; min-height:60px;}"
  + "  #wisp-twc-popup .twc-header h2{font-size:.95rem;}"
  + "  #wisp-twc-popup .twc-content{padding:15px 12px; max-height:45vh;}"
  + "  #wisp-twc-popup .twc-sidebar{padding:15px 12px; max-height:30vh;}"
  + "  #wisp-twc-popup .content-header h1{font-size:1.1rem;}"
  + "  #wisp-twc-popup .btn{padding:10px 12px; font-size:.8rem;}"
  + "}";

  var style = document.createElement("style");
  style.id = "wisp-twc-styles";
  style.type = "text/css";
  style.appendChild(document.createTextNode(css));
  (document.head || document.documentElement).appendChild(style);
}

function showPopup() {
  if (document.getElementById("wisp-twc-popup")) return;

  injectStyles();

  var root = document.createElement("div");
  root.id = "wisp-twc-popup";

  // Backdrop + blurred bg image layer
  var bg = document.createElement("div");
  bg.className = "bg-overlay";
  var backdrop = document.createElement("div");
  backdrop.className = "wisp-backdrop";

  // Modal shell
  var shell = document.createElement("div");
  shell.className = "wisp-shell";

  // Close button
  var closeBtn = document.createElement("button");
  closeBtn.className = "wisp-close";
  closeBtn.type = "button";
  closeBtn.innerHTML = '<i class="fas fa-times"></i>';

  // Container required by tracker render()
  var trackerMount = document.createElement("div");
  trackerMount.id = "twc-tracker-widget";

  shell.appendChild(closeBtn);
  shell.appendChild(trackerMount);

  root.appendChild(bg);
  root.appendChild(backdrop);
  root.appendChild(shell);

  // Close behavior
  function teardown() {
    try { root.parentNode.removeChild(root); } catch (e2) {}
  }
  closeBtn.addEventListener("click", teardown);
  backdrop.addEventListener("click", teardown);

  document.body.appendChild(root);

  // Initialize tracker inside this popup
  WISP_TWC_initTracker();
}

/**
 * Minimal ES5 port of your tracker logic (scoped to the popup).
 * Stores progress in localStorage (same keys you used).
 */
function WISP_TWC_initTracker() {
  // Prevent duplicate init
  if (window.WISP_TWC_tracker && window.WISP_TWC_tracker.__inited) {
    return;
  }

  // iOS double-tap zoom prevention (scoped, safe)
  (function () {
    var lastTouchEnd = 0;
    document.addEventListener("touchend", function (event) {
      var now = new Date().getTime();
      if (now - lastTouchEnd <= 300) {
        try { event.preventDefault(); } catch (e1) {}
      }
      lastTouchEnd = now;
    }, false);
    document.addEventListener("touchstart", function(){}, { passive: true });
  })();

  function Tracker() {
    this.__inited = true;
    this.currentStep = 1;
    this.totalSteps = 7;

    var savedProgress;
    try { savedProgress = JSON.parse(localStorage.getItem("twcVideoProgress") || "{}"); } catch (e) { savedProgress = {}; }
    this.videoProgress = savedProgress;

    this.completedSteps = {};
    var savedSteps;
    try { savedSteps = JSON.parse(localStorage.getItem("twcCompletedSteps") || "[]"); } catch (e2) { savedSteps = []; }
    for (var i = 0; i < savedSteps.length; i++) this.completedSteps[String(savedSteps[i])] = true;

    this.steps = [
      { title: "Introduction & Quick Start", video: "https://storage.googleapis.com/msgsndr/Tu9uF1zIX4jfmQ8VZzYg/media/696ec82b156e0a73e0ee9321.mp4", hasVideo: true },
      { title: "Your Investment", video: "https://storage.googleapis.com/msgsndr/Tu9uF1zIX4jfmQ8VZzYg/media/696ec82ec7f17f7304d24b48.mp4", hasVideo: true },
      { title: "Your First 48 Hours", video: "https://storage.googleapis.com/msgsndr/Tu9uF1zIX4jfmQ8VZzYg/media/696ecd64eecbfa6d734ad1da.mp4", hasVideo: true },
      { title: "TWC Community & Training", video: "https://storage.googleapis.com/msgsndr/Tu9uF1zIX4jfmQ8VZzYg/media/696ecd70d4fb906bf95c4d1a.mp4", hasVideo: true },
      { title: "Your Role VS Our Role", video: "https://storage.googleapis.com/msgsndr/Tu9uF1zIX4jfmQ8VZzYg/media/696ed3268ec5c94bb3d29f3a.mp4", hasVideo: true },
      { title: "Next Steps", video: "https://storage.googleapis.com/msgsndr/Tu9uF1zIX4jfmQ8VZzYg/media/696ed326acaab06b41a46e1e.mp4", hasVideo: true },
      { title: "Start Here", video: "https://storage.googleapis.com/msgsndr/Tu9uF1zIX4jfmQ8VZzYg/media/696fd50572b8e1ce031c6edc.mp4", hasVideo: true }
    ];

    this.initializeProgress();
    this.render();
  }

  Tracker.prototype.initializeProgress = function () {
    for (var i = 1; i <= this.totalSteps; i++) {
      if (!this.videoProgress[i]) this.videoProgress[i] = { progress: 0 };
      if (typeof this.videoProgress[i].progress !== "number") this.videoProgress[i].progress = 0;
    }
  };

  Tracker.prototype.calculateTotalProgress = function () {
    var total = 0;
    for (var i = 1; i <= this.totalSteps; i++) total += (this.videoProgress[i].progress || 0);
    return Math.round(total / this.totalSteps);
  };

  Tracker.prototype.saveProgress = function () {
    try { localStorage.setItem("twcVideoProgress", JSON.stringify(this.videoProgress)); } catch (e) {}
  };

  Tracker.prototype.updateProgress = function (stepIndexZeroBased, p) {
    var stepKey = stepIndexZeroBased + 1;
    var progress = Math.min(Math.round(p), 100);
    if (progress > (this.videoProgress[stepKey].progress || 0)) {
      this.videoProgress[stepKey].progress = progress;
      this.saveProgress();
      this.refreshUIOnly();
    }
  };

  Tracker.prototype.refreshUIOnly = function () {
    var total = this.calculateTotalProgress();
    var mainBar = document.getElementById("main-bar-fill");
    var mainText = document.getElementById("main-percent-text");
    if (mainBar) mainBar.style.width = total + "%";
    if (mainText) mainText.textContent = total + "% Complete";

    for (var i = 0; i < this.steps.length; i++) {
      var fill = document.getElementById("step-fill-" + (i + 1));
      var percentText = document.getElementById("step-percent-" + (i + 1));
      var prog = this.videoProgress[i + 1].progress || 0;
      if (fill) fill.style.width = prog + "%";
      if (percentText) {
        percentText.textContent = prog + "%";
        if (prog > 40) percentText.className = "step-progress-text inside-fill";
        else percentText.className = "step-progress-text";
      }
    }
  };

  Tracker.prototype.goToStep = function (stepNum) {
    // Lock next steps until previous is 100%
    if (stepNum > 1) {
      var prevKey = stepNum - 1;
      if ((this.videoProgress[prevKey].progress || 0) < 100) {
        this.showLockMessage(stepNum);
        return;
      }
    }
    this.currentStep = stepNum;
    this.render();
    var content = document.querySelector("#wisp-twc-popup .twc-content");
    if (content) content.scrollTop = 0;
  };

  Tracker.prototype.showLockMessage = function (stepNum) {
    var wrap = document.querySelector("#wisp-twc-popup .video-wrapper");
    if (!wrap) return;
    var existing = wrap.querySelector(".lock-overlay");
    if (existing) existing.parentNode.removeChild(existing);

    var overlay = document.createElement("div");
    overlay.className = "lock-overlay";
    overlay.innerHTML =
      '<div class="lock-icon">🔒</div>' +
      '<div class="lock-message"><strong>Complete Step ' + (stepNum - 1) + ' first!</strong><br><br>' +
      'Please watch the previous video completely (100%) before moving to Step ' + stepNum + '.</div>';

    wrap.appendChild(overlay);

    setTimeout(function () {
      try { overlay.parentNode && overlay.parentNode.removeChild(overlay); } catch (e) {}
    }, 3000);
  };

  Tracker.prototype.render = function () {
    var container = document.getElementById("twc-tracker-widget");
    if (!container) return;

    var currentData = this.steps[this.currentStep - 1];
    var totalProgress = this.calculateTotalProgress();
    var isLastStep = this.currentStep === this.totalSteps;

    var html = [];
    html.push('<div class="twc-header">');
    html.push('  <h2>TWC New Member Success Tracker</h2>');
    html.push('  <div class="progress-container">');
    html.push('    <div class="progress-text">');
    html.push('      <span>Step ' + this.currentStep + '/' + this.totalSteps + '</span>');
    html.push('      <span id="main-percent-text">' + totalProgress + '% Complete</span>');
    html.push('    </div>');
    html.push('    <div class="progress-bar-bg"><div id="main-bar-fill" class="progress-bar-fill" style="width:' + totalProgress + '%"></div></div>');
    html.push('  </div>');
    html.push('</div>');

    html.push('<div class="twc-main">');

    // Content area
    html.push('<div class="twc-content">');
    html.push('  <div class="content-header"><h1>' + currentData.title + '</h1></div>');
    html.push('  <div class="video-wrapper">');
    if (currentData.hasVideo) {
      html.push('    <video id="main-video" controls playsinline src="' + currentData.video + '"></video>');
    } else {
      html.push('    <div class="video-placeholder"><div style="font-size:2.5rem;">✅</div><h3 style="margin-top:10px;">Ready to Complete</h3></div>');
    }
    html.push('  </div>');
    html.push('  <div class="instruction-card">');
    html.push('    <h4 style="margin:0 0 8px 0; font-size:.9rem;">Next Step:</h4>');
    html.push('    <p style="margin:0; color:var(--twc-text-light); font-size:.85rem;">Watch the video above and follow the roadmap to unlock your full potential.</p>');
    html.push('  </div>');
    html.push('</div>');

    // Sidebar
    html.push('<div class="twc-sidebar">');
    html.push('  <h4>Curriculum</h4>');

    for (var i = 0; i < this.steps.length; i++) {
      var prog = this.videoProgress[i + 1].progress || 0;
      var isLocked = i > 0 && (this.videoProgress[i].progress || 0) < 100;
      var isCurrent = (this.currentStep === (i + 1));
      var cardCls = "step-card" + (isCurrent ? " active" : "") + (isLocked ? " locked" : "");
      html.push('  <div class="' + cardCls + '" data-step="' + (i + 1) + '">');
      html.push('    <div class="step-num">' + (i + 1) + '</div>');
      html.push('    <div style="flex:1;">');
      html.push('      <div class="step-title">' + this.steps[i].title + '</div>');
      html.push('      <div class="step-progress-container">');
      html.push('        <div id="step-fill-' + (i + 1) + '" class="step-progress-fill" style="width:' + prog + '%"></div>');
      html.push('        <div id="step-percent-' + (i + 1) + '" class="step-progress-text' + (prog > 40 ? ' inside-fill' : '') + '">' + prog + '%</div>');
      html.push('      </div>');
      html.push('    </div>');
      html.push('  </div>');
    }

    html.push('</div>'); // sidebar
    html.push('</div>'); // main

    // Footer
    html.push('<div class="twc-footer">');
    html.push('  <button class="btn btn-prev" ' + (this.currentStep === 1 ? "disabled" : "") + ' id="wispPrevBtn">Back</button>');
    if (isLastStep) {
      html.push('  <button class="btn btn-complete" id="wispFinishBtn">Finish Journey</button>');
    } else {
      html.push('  <button class="btn btn-next" id="wispNextBtn">Next Step</button>');
    }
    html.push('</div>');

    container.innerHTML = html.join("");

    // Bind sidebar clicks
    var self = this;
    var cards = container.querySelectorAll(".step-card");
    for (var c = 0; c < cards.length; c++) {
      (function (el) {
        el.addEventListener("click", function () {
          var step = parseInt(el.getAttribute("data-step"), 10);
          self.goToStep(step);
        });
      })(cards[c]);
    }

    // Bind footer buttons
    var prevBtn = document.getElementById("wispPrevBtn");
    if (prevBtn) prevBtn.onclick = function () { self.goToStep(self.currentStep - 1); };
    var nextBtn = document.getElementById("wispNextBtn");
    if (nextBtn) nextBtn.onclick = function () { self.goToStep(self.currentStep + 1); };

    // Video progress listeners
    var video = document.getElementById("main-video");
    if (video) {
      video.ontimeupdate = function () {
        if (!video.duration) return;
        self.updateProgress(self.currentStep - 1, (video.currentTime / video.duration) * 100);
      };
      video.onended = function () {
        self.updateProgress(self.currentStep - 1, 100);
      };
    }
  };

  window.WISP_TWC_tracker = new Tracker();
}
