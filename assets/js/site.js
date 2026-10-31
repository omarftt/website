// Theme toggle, active section in the nav, BibTeX panels, last-updated date.
// The page is complete without this file; it only adds conveniences.
(function () {
  "use strict";

  var root = document.documentElement;
  var systemDark = window.matchMedia("(prefers-color-scheme: dark)");

  // Theme: an explicit choice is stored; otherwise the system setting applies.
  var toggle = document.querySelector(".theme-toggle");

  function currentTheme() {
    return root.dataset.theme || (systemDark.matches ? "dark" : "light");
  }

  function syncToggle() {
    if (!toggle) return;
    var dark = currentTheme() === "dark";
    toggle.setAttribute("aria-pressed", String(dark));
    toggle.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
  }

  if (toggle) {
    toggle.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      root.dataset.theme = next;
      try {
        localStorage.setItem("theme", next);
      } catch (e) {
        // Storage can be unavailable (private mode); the choice then lasts for this page view.
      }
      syncToggle();
    });
    if (systemDark.addEventListener) systemDark.addEventListener("change", syncToggle);
    syncToggle();
  }

  // Underline the nav link of the section being read.
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav-links a[href^='#']"));
  var sections = navLinks
    .map(function (a) { return document.getElementById(a.getAttribute("href").slice(1)); })
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    var inView = {};
    var markActive = function () {
      // The last section can be too short to reach the band, so the bottom of the page counts as it.
      var atBottom = window.scrollY > 0 &&
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      var active = atBottom
        ? sections[sections.length - 1]
        : sections.filter(function (s) { return inView[s.id]; })[0];
      navLinks.forEach(function (a) {
        if (active && a.getAttribute("href") === "#" + active.id) a.setAttribute("aria-current", "true");
        else a.removeAttribute("aria-current");
      });
    };
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) { inView[entry.target.id] = entry.isIntersecting; });
      markActive();
    }, { rootMargin: "-40% 0px -55% 0px" });
    sections.forEach(function (s) { observer.observe(s); });
    window.addEventListener("scroll", markActive, { passive: true });
  }

  // BibTeX: show/hide the entry and copy it to the clipboard.
  document.querySelectorAll(".bib-toggle").forEach(function (button) {
    var panel = document.getElementById(button.getAttribute("aria-controls"));
    if (!panel) return;
    button.addEventListener("click", function () {
      var open = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", String(!open));
      panel.hidden = open;
    });
  });

  document.querySelectorAll(".bib .copy").forEach(function (button) {
    button.addEventListener("click", function () {
      var code = button.closest(".bib").querySelector("code");
      var done = function (label) {
        button.textContent = label;
        setTimeout(function () { button.textContent = "Copy"; }, 1600);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(code.textContent.trim()).then(
          function () { done("Copied"); },
          function () { selectText(code); done("Press Ctrl+C"); }
        );
      } else {
        selectText(code);
        done("Press Ctrl+C");
      }
    });
  });

  function selectText(node) {
    var range = document.createRange();
    range.selectNodeContents(node);
    var selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  }

  // Last updated: GitHub Pages sends Last-Modified, so this tracks each deploy.
  var stamp = document.getElementById("last-updated");
  if (stamp && document.lastModified) {
    var date = new Date(document.lastModified);
    if (!isNaN(date.getTime())) {
      stamp.textContent = date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
      stamp.setAttribute("datetime", date.toISOString().slice(0, 10));
    }
  }
})();
