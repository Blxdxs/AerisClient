const modules = {
  overview: {
    kicker: "SESSION", title: "Overview", status: "READY",
    oneLabel: "Mode", one: "Farming", twoLabel: "State", two: "Idle",
    chart: "Efficiency", value: "96.4%", task: "Garden rotation", progress: "74%",
    help: "Click a module to preview its controls."
  },
  farming: {
    kicker: "MODULE", title: "Farming", status: "RUNNING",
    oneLabel: "Crop", one: "Wheat", twoLabel: "Route", two: "Garden A",
    chart: "Consistency", value: "98.1%", task: "Harvest loop", progress: "82%",
    help: "Farming controls are ready for your mod implementation."
  },
  mining: {
    kicker: "MODULE", title: "Mining", status: "READY",
    oneLabel: "Target", one: "Mithril", twoLabel: "Route", two: "Tunnel",
    chart: "Uptime", value: "91.7%", task: "Tunnel sweep", progress: "61%",
    help: "Mining controls are ready for your mod implementation."
  },
  combat: {
    kicker: "MODULE", title: "Combat", status: "PAUSED",
    oneLabel: "Profile", one: "Balanced", twoLabel: "State", two: "Standby",
    chart: "Response", value: "97.2%", task: "Target scan", progress: "46%",
    help: "Use this panel for combat profiles, toggles, and keybinds."
  },
  fishing: {
    kicker: "MODULE", title: "Fishing", status: "READY",
    oneLabel: "Mode", one: "Normal fishing", twoLabel: "State", two: "Idle",
    chart: "Consistency", value: "94.8%", task: "Fishing", progress: "58%",
    help: "Fishing controls are ready for your mod implementation."
  },
  settings: {
    kicker: "SYSTEM", title: "Settings", status: "READY",
    oneLabel: "Theme", one: "Aeris Blue", twoLabel: "Scale", two: "100%",
    chart: "UI load", value: "Low", task: "Preferences", progress: "100%",
    help: "This section maps naturally to a settings screen in the mod."
  }
};

const $ = (id) => document.getElementById(id);

function setModule(name) {
  const data = modules[name];
  if (!data) return;

  document.querySelectorAll(".side-item").forEach((button) => {
    const active = button.dataset.module === name;
    button.classList.toggle("selected", active);
    button.setAttribute("aria-current", active ? "page" : "false");
  });

  $("panel-kicker").textContent = data.kicker;
  $("panel-title").textContent = data.title;
  $("panel-status").textContent = data.status;
  $("metric-one-label").textContent = data.oneLabel;
  $("metric-one").textContent = data.one;
  $("metric-two-label").textContent = data.twoLabel;
  $("metric-two").textContent = data.two;
  $("chart-label").textContent = data.chart;
  $("chart-value").textContent = data.value;
  $("task-title").textContent = data.task;
  $("task-progress").textContent = data.progress;
  $("footer-help").textContent = data.help;
  $("dash-state").textContent = data.status === "RUNNING" ? "Running" : "Ready";
}

document.querySelectorAll(".side-item").forEach((button) => {
  button.addEventListener("click", () => setModule(button.dataset.module));
});

document.querySelectorAll(".control-toggle").forEach((button) => {
  button.addEventListener("click", () => {
    const next = !button.classList.contains("on");
    button.classList.toggle("on", next);
    button.setAttribute("aria-pressed", String(next));
    showToast(`${button.querySelector("b").textContent}: ${next ? "enabled" : "disabled"}`);
  });
});

$("preview-action").addEventListener("click", () => {
  $("dash-state").textContent = "Running";
  $("panel-status").textContent = "RUNNING";
  showToast("Preview routine started.");
  setTimeout(() => {
    $("dash-state").textContent = "Ready";
    $("panel-status").textContent = "READY";
  }, 1600);
});

let toastTimer;
function showToast(message) {
  const toast = $("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}


/* Cursor interaction: the preview subtly turns toward the cursor and the
   surrounding cards/glow follow it with different depth values. */
(() => {
  const visual = document.querySelector(".visual");
  const dashboard = document.querySelector(".dashboard");
  const halo = document.querySelector(".halo");
  const floatTop = document.querySelector(".float-top");
  const floatBottom = document.querySelector(".float-bottom");
  const magnetic = document.querySelectorAll(".button-primary, .nav-button");

  if (!visual || !dashboard || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  let targetX = 0, targetY = 0;
  let currentX = 0, currentY = 0;
  let raf = 0;

  function pointerMove(event) {
    const rect = visual.getBoundingClientRect();
    const x = (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const y = (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);

    targetX = Math.max(-1, Math.min(1, x));
    targetY = Math.max(-1, Math.min(1, y));
  }

  function pointerLeave() {
    targetX = 0;
    targetY = 0;
  }

  function frame() {
    currentX += (targetX - currentX) * 0.08;
    currentY += (targetY - currentY) * 0.08;

    dashboard.style.setProperty("--rx", `${2 - currentY * 5}deg`);
    dashboard.style.setProperty("--ry", `${-4 + currentX * 7}deg`);
    dashboard.style.setProperty("--mx", `${currentX * 5}px`);
    dashboard.style.setProperty("--my", `${currentY * 5}px`);

    halo.style.setProperty("--gx", `${currentX * 38}px`);
    halo.style.setProperty("--gy", `${currentY * 38}px`);

    floatTop.style.setProperty("--fx", `${currentX * 18}px`);
    floatTop.style.setProperty("--fy", `${currentY * 11}px`);
    floatBottom.style.setProperty("--fx", `${currentX * -14}px`);
    floatBottom.style.setProperty("--fy", `${currentY * -9}px`);

    raf = requestAnimationFrame(frame);
  }

  visual.addEventListener("pointermove", pointerMove);
  visual.addEventListener("pointerleave", pointerLeave);
  cancelAnimationFrame(raf);
  frame();

  /* Small magnetic effect for the main CTAs. */
  magnetic.forEach((button) => {
    button.addEventListener("pointermove", (event) => {
      const rect = button.getBoundingClientRect();
      const x = (event.clientX - (rect.left + rect.width / 2)) * 0.12;
      const y = (event.clientY - (rect.top + rect.height / 2)) * 0.12;
      button.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    });
    button.addEventListener("pointerleave", () => {
      button.style.transform = "";
    });
  });
})();
