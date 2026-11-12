/* =====================================================================
   SERO CHOCOLATES - VERSION 2 - MOTION
   Works with assets/motion.css. Used on home, gifts, membership, contact and our story.
   It adds the classes; the look lives in the CSS. Nothing here changes the content.
   ===================================================================== */
(() => {
  const root = document.documentElement;
  if (!root.classList.contains("mo-on")) return; // motion switched off (reduced motion)
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const page = location.pathname.split("/").pop() || "index.html";

  /* ---------- 1. headline: words rise one by one ---------- */
  const heroH1 = document.querySelector(".hero h1, .pg-hero h1, .mb-hero h1, .cx-hero h1, .ab-hero h1");
  if (heroH1) {
    let n = 0;
    const split = (node) => {
      [...node.childNodes].forEach((c) => {
        if (c.nodeType === 3) {
          const frag = document.createDocumentFragment();
          c.textContent.split(/(\s+)/).forEach((t) => {
            if (!t) return;
            if (/^\s+$/.test(t)) return frag.appendChild(document.createTextNode(" "));
            const w = document.createElement("span");
            w.className = "mw";
            const i = document.createElement("span");
            i.textContent = t;
            i.style.setProperty("--wi", n++);
            w.appendChild(i);
            frag.appendChild(w);
          });
          c.replaceWith(frag);
        } else if (c.nodeType === 1 && c.tagName !== "BR") split(c);
      });
    };
    heroH1.setAttribute("aria-label", heroH1.textContent.trim());
    split(heroH1);
    heroH1.classList.add("mo-split");
  }

  /* ---------- 2. what rises, what scales down, per page ---------- */
  // [selector, effect, stagger the matches]  effect: up | l | r | fig | bg
  const common = [
    [".ab-head, .cx-head", "up", false],
  ];
  const lists = {
    "index.html": [
      [".cats .cat", "up", true],
      [".steps li", "up", true],
      [".story .top > div:last-child > *", "up", true],
      [".sclub-in > *", "up", true],
      [".faq details", "up", true],
    ],
    "custom-gifts.html": [
      [".split .im", "bg", false],
      [".split .tx > *", "up", true],
      [".types .type", "up", true],
      [".gt", "up", true],
      [".slips .slip", "up", true],
      [".gq-bg", "bg", false],
      [".gq-head", "up", false],
      [".gq-list details", "up", true],
      [".band-cta .cta-tx > *", "up", true],
      [".cta-pics img", "r", true],
      [".pg h2", "up", false],
    ],
    "membership.html": [
      [".mb-strip li", "up", true],
      [".mb-split .pic", "bg", false],
      [".mb-split .tx > *", "up", true],
      [".mb-vault .head", "up", false],
      [".mb-dual2 .tbl, .mb-dual2 .mb-cmp", "l", false],
      [".mb-dual2 .collage", "r", false],
      [".mb-faqsplit .ph", "bg", false],
      [".mb-faqsplit .faq2 details", "up", true],
      [".mb-club .ask", "up", false],
      [".sclub-in > *", "up", true],
    ],
    "contact.html": [
      [".cx-pick .switch button", "up", true],
      [".cx-t", "up", true],
      [".cx-side", "bg", false],
      ["#fHome, #fCorp", "up", false],
      [".cx-how li", "up", true],
      [".cx-faq .cx-acc details", "up", true],
      [".cx-split .cx-bg", "bg", false],
      [".cx-acc.dark > *", "up", true],
    ],
    "about.html": [
      [".ab-origin-in > *", "up", true],
      [".ab-origin-photo", "fig", false],
      [".ab-today-photo", "fig", false],
      [".ab-today-grid > div > *", "up", true],
      [".ab-farms article", "up", true],
      [".ab-tcopy > *", "up", true],
      [".ab-collage figure", "fig", true],
      [".ab-collage .seal", "up", false],
      [".ab-arches li", "up", true],
      [".ab-impact .ab-w > h2, .ab-impact .ab-w > p", "up", true],
      [".ab-chain li", "up", true],
      [".ab-ledger .in", "l", false],
      [".ab-ledger .out", "r", false],
      [".ab-mosaic figure", "fig", true],
      [".ab-taste > div", "up", true],
      [".ab-senses h2, .ab-senses li, .ab-senses > .ab-btn", "up", true],
      [".ab-acc details", "up", true],
      [".ab-faqstage", "bg", false],
      [".ab-journey h2", "up", false],
    ],
  };
  const list = common.concat(lists[page] || []);
  const seen = new Set();
  const io = new IntersectionObserver(
    (es) =>
      es.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("mo-in");
          io.unobserve(e.target);
        }
      }),
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
  );
  list.forEach(([sel, fx, stagger]) => {
    $$(sel).forEach((el, i) => {
      if (seen.has(el) || el.closest(".ab-hero, .pg-hero, .cx-hero, .mb-hero, .hero")) return;
      seen.add(el);
      el.classList.add(fx === "fig" ? "mo-fig" : fx === "bg" ? "mo-bg" : "mo");
      if (fx === "l") el.classList.add("mo-l");
      if (fx === "r") el.classList.add("mo-r");
      if (stagger) {
        const sibs = el.parentElement ? [...el.parentElement.children].filter((c) => c.matches(sel)) : [el];
        el.style.setProperty("--md", Math.max(0, sibs.indexOf(el)) * 0.09 + "s");
      }
      io.observe(el);
    });
  });
  // safety net: anything already on screen is shown even if the observer is slow
  setTimeout(
    () => $$(".mo:not(.mo-in), .mo-fig:not(.mo-in), .mo-bg:not(.mo-in)").forEach((el) => el.getBoundingClientRect().top < innerHeight * 0.92 && el.classList.add("mo-in")),
    500,
  );

  /* ---------- 3. numbers count up once ---------- */
  const counters = $$(".ab-stats dt, .ab-years u, .pg-hero .facts b, .mb-hero .num").filter((el) => /^\d[\d,]*[+%]?$/.test(el.textContent.trim()));
  const co = new IntersectionObserver(
    (es) =>
      es.forEach((e) => {
        if (!e.isIntersecting) return;
        co.unobserve(e.target);
        const el = e.target;
        const m = el.dataset.moText.match(/^(\d[\d,]*)([+%]?)$/);
        const to = +m[1].replace(/,/g, "");
        const t0 = performance.now();
        const dur = 1600;
        const tick = (t) => {
          const k = Math.min(1, (t - t0) / dur);
          const v = Math.round(to * (1 - Math.pow(1 - k, 3)));
          el.textContent = v.toLocaleString("en-US") + m[2];
          if (k < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }),
    { threshold: 0.6 },
  );
  counters.forEach((el) => {
    el.dataset.moText = el.textContent.trim();
    co.observe(el);
  });

  /* ---------- 4. parallax: hero pictures move slower than the page ---------- */
  const heroes = $$(".pg-hero, .mb-hero, .cx-hero, .ab-hero, .hero");
  if (heroes.length) {
    let ticking = false;
    const run = () => {
      const y = Math.min(scrollY * 0.18, 110);
      heroes.forEach((h) => h.style.setProperty("--py", y + "px"));
      ticking = false;
    };
    addEventListener(
      "scroll",
      () => {
        if (!ticking && scrollY < innerHeight * 1.2) {
          ticking = true;
          requestAnimationFrame(run);
        }
      },
      { passive: true },
    );
  }
})();
