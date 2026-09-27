/* Varinder Singh — Portfolio
   Small, dependency-free interactions: header state, mobile nav,
   scroll reveal, image lightbox, copy-to-clipboard and footer year. */
(function () {
  "use strict";

  var doc = document;
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Header shadow once the page scrolls */
  var header = doc.querySelector(".site-header");
  function onScroll() {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* Mobile navigation */
  var toggle = doc.querySelector(".nav-toggle");
  var nav = doc.getElementById("site-nav");
  if (toggle && nav) {
    var setOpen = function (open) {
      nav.classList.toggle("is-open", open);
      if (header) header.classList.toggle("nav-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      toggle.querySelector(".i-menu").style.display = open ? "none" : "";
      toggle.querySelector(".i-close").style.display = open ? "" : "none";
    };
    toggle.addEventListener("click", function () {
      setOpen(!nav.classList.contains("is-open"));
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setOpen(false);
    });
    doc.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        setOpen(false);
        toggle.focus();
      }
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 880) setOpen(false);
    });
  }

  /* Reveal on scroll */
  var revealEls = doc.querySelectorAll(".reveal");
  if (!reduceMotion && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* Lightbox for case-study galleries */
  var triggers = Array.prototype.slice.call(doc.querySelectorAll("[data-lightbox]"));
  if (triggers.length) {
    var box = doc.createElement("div");
    box.className = "lightbox";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");
    box.setAttribute("aria-label", "Screenshot viewer");
    box.innerHTML =
      '<button class="lb-btn lb-close" type="button" aria-label="Close">' + svg("x") + "</button>" +
      '<button class="lb-btn lb-prev" type="button" aria-label="Previous screenshot">' + svg("left") + "</button>" +
      '<button class="lb-btn lb-next" type="button" aria-label="Next screenshot">' + svg("right") + "</button>" +
      "<figure><img alt=\"\"><figcaption></figcaption></figure>";
    doc.body.appendChild(box);

    var img = box.querySelector("img");
    var cap = box.querySelector("figcaption");
    var index = 0;
    var lastFocus = null;

    var show = function (i) {
      index = (i + triggers.length) % triggers.length;
      var t = triggers[index];
      img.src = t.getAttribute("data-lightbox");
      img.alt = t.getAttribute("data-caption") || "";
      cap.textContent = t.getAttribute("data-caption") || "";
    };
    var open = function (i) {
      lastFocus = doc.activeElement;
      show(i);
      box.classList.add("is-open");
      doc.body.style.overflow = "hidden";
      box.querySelector(".lb-close").focus();
    };
    var close = function () {
      box.classList.remove("is-open");
      doc.body.style.overflow = "";
      if (lastFocus) lastFocus.focus();
    };

    triggers.forEach(function (t, i) {
      t.addEventListener("click", function (e) {
        e.preventDefault();
        open(i);
      });
    });
    box.querySelector(".lb-close").addEventListener("click", close);
    box.querySelector(".lb-prev").addEventListener("click", function () { show(index - 1); });
    box.querySelector(".lb-next").addEventListener("click", function () { show(index + 1); });
    box.addEventListener("click", function (e) { if (e.target === box) close(); });
    doc.addEventListener("keydown", function (e) {
      if (!box.classList.contains("is-open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") show(index - 1);
      if (e.key === "ArrowRight") show(index + 1);
    });
    if (triggers.length < 2) {
      box.querySelector(".lb-prev").style.display = "none";
      box.querySelector(".lb-next").style.display = "none";
    }
  }

  function svg(name) {
    var paths = {
      x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
      left: '<path d="m15 18-6-6 6-6"/>',
      right: '<path d="m9 18 6-6-6-6"/>'
    };
    return '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + paths[name] + "</svg>";
  }

  /* Copy email to clipboard */
  var toast;
  function showToast(message) {
    if (!toast) {
      toast = doc.createElement("div");
      toast.className = "toast";
      toast.setAttribute("role", "status");
      toast.setAttribute("aria-live", "polite");
      doc.body.appendChild(toast);
    }
    toast.innerHTML = '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>' + message;
    toast.classList.add("is-visible");
    clearTimeout(showToast.t);
    showToast.t = setTimeout(function () { toast.classList.remove("is-visible"); }, 2200);
  }

  doc.querySelectorAll("[data-copy]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var value = btn.getAttribute("data-copy");
      var done = function () { showToast("Email copied to clipboard"); };
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(value).then(done, fallback);
      } else {
        fallback();
      }
      function fallback() {
        var ta = doc.createElement("textarea");
        ta.value = value;
        ta.setAttribute("readonly", "");
        ta.style.position = "absolute";
        ta.style.left = "-9999px";
        doc.body.appendChild(ta);
        ta.select();
        try { doc.execCommand("copy"); done(); } catch (err) { window.location.href = "mailto:" + value; }
        doc.body.removeChild(ta);
      }
    });
  });

  /* Current year in the footer */
  doc.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
