document.addEventListener("DOMContentLoaded", function () {
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      links.classList.toggle("open");
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { links.classList.remove("open"); });
    });
  }

  // Mark current nav link active
  var path = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a[href]").forEach(function (a) {
    var href = a.getAttribute("href").split("/").pop();
    if (href === path) a.classList.add("active");
  });

  // Simple contact form -> mailto fallback (no backend on static hosting)
  var form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = form.name.value.trim();
      var email = form.email.value.trim();
      var reason = form.reason ? form.reason.value : "";
      var message = form.message.value.trim();
      var subject = encodeURIComponent("Enquiry from derrydean.com: " + (reason || "General"));
      var body = encodeURIComponent(
        "Name: " + name + "\nEmail: " + email + "\nReason: " + reason + "\n\n" + message
      );
      window.location.href = "mailto:derry@derrydean.com?subject=" + subject + "&body=" + body;
    });
  }

  // RFP / brief upload form.
  // WEB3FORMS_KEY: replace the placeholder below with a free access key from web3forms.com
  // (enter an email at web3forms.com, a key is emailed instantly, no account/password needed)
  // to enable real file submission. Until then, this falls back to a pre-filled email draft
  // and asks the sender to attach their file(s) manually, since a plain mailto: link cannot
  // carry attachments.
  var WEB3FORMS_KEY = "YOUR_WEB3FORMS_ACCESS_KEY";
  var briefForm = document.getElementById("brief-form");
  if (briefForm) {
    briefForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var statusEl = document.getElementById("brief-form-status");
      var org = briefForm.org.value.trim();
      var name = briefForm.name.value.trim();
      var email = briefForm.email.value.trim();
      var type = briefForm.type ? briefForm.type.value : "";
      var deadline = briefForm.deadline.value;
      var description = briefForm.description.value.trim();

      if (WEB3FORMS_KEY === "YOUR_WEB3FORMS_ACCESS_KEY") {
        var fileInput = document.getElementById("brief-files");
        var fileNames = fileInput && fileInput.files.length
          ? Array.from(fileInput.files).map(function (f) { return f.name; }).join(", ")
          : "(none attached in this draft)";
        var subject = encodeURIComponent("RFP / Brief submission: " + (org || name));
        var body = encodeURIComponent(
          "Organisation: " + org + "\nContact: " + name + " (" + email + ")\n" +
          "Engagement type: " + type + "\nDeadline: " + (deadline || "n/a") + "\n" +
          "Files referenced: " + fileNames + "\n\n" + description +
          "\n\n[Please attach your document(s) to this email before sending.]"
        );
        if (statusEl) statusEl.textContent = "Opening your email client: please attach your file(s) before sending.";
        window.location.href = "mailto:derry@derrydean.com?subject=" + subject + "&body=" + body;
        return;
      }

      var formData = new FormData(briefForm);
      formData.append("access_key", WEB3FORMS_KEY);
      if (statusEl) statusEl.textContent = "Submitting…";
      fetch("https://api.web3forms.com/submit", { method: "POST", body: formData })
        .then(function (r) { return r.json(); })
        .then(function (data) {
          if (data.success) {
            if (statusEl) statusEl.textContent = "Received, thank you. You'll hear back within two business days.";
            briefForm.reset();
          } else if (statusEl) {
            statusEl.textContent = "Something went wrong, please email derry@derrydean.com directly.";
          }
        })
        .catch(function () {
          if (statusEl) statusEl.textContent = "Something went wrong, please email derry@derrydean.com directly.";
        });
    });
  }

  // Collaboration panel (writing.html "Let's Collaborate"). A track-pill single-select
  // plus a short form, mailto fallback like the other forms on the site. The three
  // "collab-pick" buttons in the intro cards jump straight to the panel and pre-select
  // the matching track, so a reader never has to hunt for a generic contact form.
  var collabForm = document.getElementById("collaborate-form");
  if (collabForm) {
    var collabPanel = document.getElementById("collaborate-panel");
    var trackPills = Array.from(collabForm.querySelectorAll(".track-pill"));

    function setActiveTrack(track) {
      trackPills.forEach(function (p) {
        p.classList.toggle("active", p.dataset.track === track);
      });
    }

    trackPills.forEach(function (pill) {
      pill.addEventListener("click", function () { setActiveTrack(pill.dataset.track); });
    });

    document.querySelectorAll(".collab-pick").forEach(function (btn) {
      btn.addEventListener("click", function () {
        setActiveTrack(btn.dataset.track);
        if (collabPanel) collabPanel.scrollIntoView({ behavior: "smooth", block: "start" });
        var idea = document.getElementById("collab-idea");
        if (idea) idea.focus({ preventScroll: true });
      });
    });

    collabForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var activePill = trackPills.filter(function (p) { return p.classList.contains("active"); })[0];
      var track = activePill ? activePill.dataset.track : "General collaboration";
      var name = collabForm.name.value.trim();
      var email = collabForm.email.value.trim();
      var idea = collabForm.idea.value.trim();
      var subject = encodeURIComponent("Collaboration proposal from derrydean.com: " + track);
      var body = encodeURIComponent(
        "Name: " + name + "\nEmail: " + email + "\nTrack: " + track + "\n\n" + idea
      );
      window.location.href = "mailto:derry@derrydean.com?subject=" + subject + "&body=" + body;
    });
  }

  // Book recommendation / invitation panel (writing.html "Reading"). Same mailto pattern.
  var bookForm = document.getElementById("book-form");
  if (bookForm) {
    bookForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var type = bookForm.type ? bookForm.type.value : "Book Recommendation";
      var detail = bookForm.detail.value.trim();
      var name = bookForm.name.value.trim();
      var email = bookForm.email.value.trim();
      var subject = encodeURIComponent("From derrydean.com: " + type);
      var body = encodeURIComponent(
        "Name: " + name + "\nEmail: " + email + "\nType: " + type + "\n\n" + detail
      );
      window.location.href = "mailto:derry@derrydean.com?subject=" + subject + "&body=" + body;
    });
  }

  // Intent-based CV filter (cv.html only). Chips toggle data-tags; sections show if they
  // carry no tags (always visible) or share a tag with the current selection. No selection
  // means show everything. "Download tailored PDF" uses window.print() against a dedicated
  // print stylesheet, so the exported PDF matches whatever is currently visible.
  var cvFilter = document.querySelector(".cv-filter");
  if (cvFilter) {
    var chips = Array.from(cvFilter.querySelectorAll(".cv-chip"));
    var sections = Array.from(document.querySelectorAll(".cv-section"));
    var emptyState = document.querySelector(".cv-empty");

    function activeTags() {
      return chips.filter(function (c) { return c.classList.contains("active"); })
        .map(function (c) { return c.dataset.tag; });
    }

    function applyFilter() {
      var tags = activeTags();
      var visibleCount = 0;
      sections.forEach(function (s) {
        var sectionTags = (s.dataset.tags || "").split(",").filter(Boolean);
        var alwaysOn = sectionTags.length === 0;
        var matches = alwaysOn || tags.length === 0 || sectionTags.some(function (t) { return tags.indexOf(t) !== -1; });
        s.hidden = !matches;
        if (matches) visibleCount++;
      });
      if (emptyState) emptyState.classList.toggle("show", visibleCount === 0);
    }

    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        chip.classList.toggle("active");
        applyFilter();
      });
    });

    var resetBtn = document.querySelector(".cv-reset");
    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        chips.forEach(function (c) { c.classList.remove("active"); });
        applyFilter();
      });
    }

    // .cv-print may now appear twice (the filter panel's button and the floating
    // "Download Tailored PDF" button), so bind to all of them, not just the first.
    document.querySelectorAll(".cv-print").forEach(function (printBtn) {
      printBtn.addEventListener("click", function () { window.print(); });
    });

    applyFilter();
  }

  // One-time scroll reveal for .logo-strip--reveal (currently the homepage "Trusted By"
  // strip). Adds .in-view the first time the strip enters the viewport; CSS handles the
  // actual stagger via each chip's --i custom property. Never re-fires, and if
  // IntersectionObserver isn't available the CSS default (fully visible) still applies.
  if ("IntersectionObserver" in window) {
    var revealStrips = document.querySelectorAll(".logo-strip--reveal");
    if (revealStrips.length) {
      var revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.2 });
      // Only opt a strip into the hidden starting state once we can guarantee the
      // observer will follow up and reveal it, so there's never a stranded opacity:0.
      revealStrips.forEach(function (strip) {
        strip.classList.add("js-stagger");
        revealObserver.observe(strip);
      });
    }
  }

  // Contact form: pre-select "Reason for contact" when arriving via a page-specific
  // floating button or link elsewhere on the site (e.g. Speaking's floating "Request a
  // Speaking Engagement" button links to contact.html#speaking). Keeps the destination
  // form context-aware instead of dropping the visitor into a blank generic form.
  var reasonSelect = document.getElementById("reason");
  if (reasonSelect) {
    var REASON_MAP = {
      speaking: "Speaking Engagement",
      advisory: "Advisory / Consulting",
      board: "Board / Governance Conversation",
      government: "Government / Multilateral Programme",
      press: "Press / Media",
      partnership: "Partnership",
      "strategy-call": "Advisory / Consulting",
      "advisory-session": "Advisory / Consulting",
      "half-day-sprint": "Advisory / Consulting"
    };
    // Fixed-fee session buttons on Work With Me route here (rather than a dead "#") while
    // online payment is being finalized. This starter line saves the visitor from having
    // to restate which session they want.
    var BOOKING_MESSAGE_MAP = {
      "strategy-call": "I'd like to book the 30-minute Strategy Call ($500).",
      "advisory-session": "I'd like to book the 60-minute Advisory Session ($1,000).",
      "half-day-sprint": "I'd like to book the Half-Day Advisory Sprint ($3,500)."
    };
    var key = window.location.hash.replace("#", "");
    if (REASON_MAP[key]) {
      reasonSelect.value = REASON_MAP[key];
      var messageField = document.getElementById("message");
      if (messageField && BOOKING_MESSAGE_MAP[key] && !messageField.value) {
        messageField.value = BOOKING_MESSAGE_MAP[key];
      }
      var nameField = document.getElementById("name");
      if (nameField) nameField.focus({ preventScroll: false });
    }
  }
});
