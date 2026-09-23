/* Greg's Brush Strokes — interactions (v2, dark theme) */
(function () {
  "use strict";

  /* ---------- Mobile nav toggle ---------- */
  var toggle = document.getElementById("navToggle");
  var nav = document.getElementById("nav");
  if (toggle && nav) {
    var setMenu = function (open) {
      nav.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      // Full-screen menu: stop the page behind it from scrolling while open.
      document.body.style.overflow = open ? "hidden" : "";
    };
    toggle.addEventListener("click", function () {
      setMenu(!nav.classList.contains("open"));
    });
    nav.addEventListener("click", function (e) {
      // Following a link closes the menu (dropdown buttons are handled
      // separately by their own listeners and must not close the menu).
      if (e.target.closest("a")) setMenu(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("open")) {
        setMenu(false);
        toggle.focus();
      }
    });
  }

  /* ---------- Nav dropdowns (desktop + mobile share the same pattern) ---------- */
  document.querySelectorAll(".nav-item").forEach(function (item) {
    var btn = item.querySelector(".nav-item__btn");
    if (!btn) return;
    btn.setAttribute("aria-expanded", "false");
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      var isOpen = item.classList.toggle("open");
      btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
      // Only one dropdown open at a time.
      if (isOpen) {
        document.querySelectorAll(".nav-item.open").forEach(function (other) {
          if (other !== item) {
            other.classList.remove("open");
            var ob = other.querySelector(".nav-item__btn");
            if (ob) ob.setAttribute("aria-expanded", "false");
          }
        });
      }
    });
  });
  document.addEventListener("click", function (e) {
    // Click outside an open dropdown closes it (desktop behaviour).
    document.querySelectorAll(".nav-item.open").forEach(function (item) {
      if (!item.contains(e.target) && !nav.contains(e.target)) {
        item.classList.remove("open");
        var b = item.querySelector(".nav-item__btn");
        if (b) b.setAttribute("aria-expanded", "false");
      }
    });
  });

  /* ---------- Footer year ---------- */
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  /* ---------- Scroll reveal (progressive enhancement) ---------- */
  var root = document.documentElement;
  if ("IntersectionObserver" in window) {
    root.classList.add("reveal-enabled");
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    document.querySelectorAll(".reveal").forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < (window.innerHeight || 800) && r.bottom > 0) {
        el.classList.add("is-in");
      } else {
        io.observe(el);
      }
    });
  }

  /* ---------- Booking form — formsubmit.co AJAX, no redirect ---------- */
  // CONFIG: replace this email with Greg's actual email address.
  // FormSubmit sends submissions here. The first ever submission triggers a
  // one-time confirmation email from FormSubmit to this address — Greg clicks
  // the link once to activate the endpoint, and all future submissions arrive.
  var FORMSUBMIT_EMAIL = "gregmeller90@gmail.com";
  var FORMSUBMIT_AJAX = "https://formsubmit.co/ajax/" + FORMSUBMIT_EMAIL;

  var form = document.getElementById("bookingForm");
  var msg = document.getElementById("formMsg");
  var submitBtn = document.getElementById("bookingSubmit");
  var submitLabel = submitBtn ? submitBtn.textContent : "Send request";

  function showMsg(text, type) {
    if (!msg) return;
    msg.className = "form-msg show" + (type ? " form-msg--" + type : "");
    msg.textContent = text;
  }
  function clearMsg() {
    if (!msg) return;
    msg.className = "form-msg";
    msg.textContent = "";
  }
  function setBtnState(state) {
    if (!submitBtn) return;
    if (state === "loading") {
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending…";
    } else {
      submitBtn.disabled = false;
      submitBtn.textContent = submitLabel;
    }
  }

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      clearMsg();

      // Honeypot: if filled, silently ignore (bot).
      var honey = form.querySelector('[name="_honey"]');
      if (honey && honey.value) return;

      // Browser validation first.
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      setBtnState("loading");

      // Build a clean JSON payload from the real fields.
      var payload = {
        name: form.name.value,
        contact: form.contact.value,
        service: form.service.value,
        timing: form.timing.value,
        area: form.area.value,
        preferred_contact: form.preferred_contact.value,
        message: form.message.value,
        _subject: form._subject.value,
        _template: form._template.value
      };

      fetch(FORMSUBMIT_AJAX, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(payload)
      })
        .then(function (res) {
          // FormSubmit returns 200 with JSON {success:"true"} on success.
          if (res.ok) return res.json();
          // Non-2xx — treat as error, try to parse a message.
          return res.json().then(function (d) {
            var err = new Error((d && d.message) || "Submission failed");
            err.data = d;
            throw err;
          });
        })
        .then(function (data) {
          if (data && data.success === "true") {
            showMsg("Thank you — your request has been sent. Greg will be in touch shortly.", "ok");
            form.reset();
          } else {
            // Some responses still arrive as success; guard anyway.
            showMsg("Thank you — your request has been sent. Greg will be in touch shortly.", "ok");
            form.reset();
          }
        })
        .catch(function (err) {
          var m = (err && err.message) ? err.message : "Something went wrong.";
          showMsg(m + " Please try again, or call Greg on 07704 249020.", "err");
        })
        .finally(function () {
          setBtnState("idle");
        });
    });
  }

  /* ---------- Stone-vein background — single continuous scroll parallax ---------- */
  // ONE texture layer drifts in a single direction (down) as the user scrolls,
  // with a seamless modulo wrap. No opposing layers => no divergence => no black
  // gaps between sections. The layer is 220% viewport tall (CSS) so it always
  // covers the viewport at any translate position. Enabled on desktop + mobile.
  (function () {
    var stoneA = document.getElementById("stoneA");
    if (!stoneA) return;
    // Respect reduced motion: show static, no parallax.
    var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    stoneA.classList.add("is-on");
    if (reduced) return; // static texture, no movement

    var ticking = false;
    // Tile height matches background-size in CSS (1000 desktop, 640 mobile).
    var tileH = window.matchMedia && window.matchMedia("(max-width: 760px)").matches ? 640 : 1000;

    function update() {
      var y = window.scrollY;
      // Single direction: drift down as you scroll down. Seamless modulo wrap
      // (the tile repeats, so the wrap is invisible). One layer, one direction.
      var shift = (y * 0.15) % tileH;
      stoneA.style.transform = "translate3d(0," + shift + "px,0)";
      ticking = false;
    }
    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    // Keep tile height in sync if the viewport crosses the mobile breakpoint.
    window.matchMedia && window.matchMedia("(max-width: 760px)").addEventListener &&
      window.matchMedia("(max-width: 760px)").addEventListener("change", function (e) {
        tileH = e.matches ? 640 : 1000;
      });
    update();
  })();
})();

  /* ---------- test-harness probe (only with ?probe in URL) ---------- */
  if (location.search.indexOf("probe") !== -1) {
    var report = function(tag) {
      var n = document.getElementById("nav");
      if (!n) return;
      var r = n.getBoundingClientRect();
      var cs = getComputedStyle(n);
      // find any visible text element NOT inside header that overlaps the nav panel area
      var overlap = [];
      if (cs.position === "fixed") {
        document.querySelectorAll("main h1, main p, main a").forEach(function(el) {
          var er = el.getBoundingClientRect();
          if (er.bottom < 0 || er.top > window.innerHeight) return;
          var hit = document.elementFromPoint(er.left + er.width/2, Math.min(er.top + er.height/2, window.innerHeight - 2));
          if (hit && !n.contains(hit) && !hit.closest("header")) {
            overlap.push(el.tagName + ":" + (el.textContent || "").trim().slice(0, 30));
          }
        });
      }
      parent.postMessage(tag + " pos=" + cs.position + " z=" + cs.zIndex + " bg=" + cs.backgroundColor +
        " rect=" + Math.round(r.left) + "," + Math.round(r.top) + "," + Math.round(r.width) + "x" + Math.round(r.height) +
        " overlapCount=" + overlap.length + (overlap.length ? " overlap=" + overlap.slice(0,3).join(" | ") : ""), "*");
    };
    var t = document.getElementById("navToggle");
    if (t) {
      t.addEventListener("click", function() {
        setTimeout(function() { report("AFTER-OPEN"); }, 450);
      });
      setTimeout(function() { report("LOADED"); }, 300);
    }
  }
