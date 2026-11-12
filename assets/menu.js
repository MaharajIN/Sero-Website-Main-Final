/* Menu helper, same on every page (tablet and phone).
   - adds a close button when the page does not have one
   - a tap anywhere outside the open menu closes it (and does nothing else)
   - Escape closes it
   - a floating menu button appears when the header's own menu button has scrolled out of view */
(function () {
  var burger = document.getElementById("burger");
  var drawer = document.getElementById("drawer");
  if (!burger || !drawer) return;

  var closeBtn = document.getElementById("drawerX");
  var ownClose = false;
  if (!closeBtn) {
    ownClose = true;
    closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "dr-x";
    closeBtn.setAttribute("aria-label", "Close menu");
    closeBtn.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>';
    drawer.insertBefore(closeBtn, drawer.firstChild);
  }
  var isOpen = function () {
    return drawer.classList.contains("open");
  };
  var close = function () {
    if (!isOpen()) return;
    if (ownClose) drawer.classList.remove("open");
    else closeBtn.click(); // the page's own close handler also resets its state
  };
  if (ownClose) closeBtn.addEventListener("click", close);

  // floating button
  var fm = document.createElement("button");
  fm.type = "button";
  fm.className = "fm";
  fm.setAttribute("aria-label", "Open menu");
  fm.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18" /></svg>';
  document.body.appendChild(fm);
  fm.addEventListener("click", function (e) {
    e.stopPropagation(); // the page's older "tap outside" code must not see this tap
    if (!isOpen()) burger.click();
  });
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(
      function (entries) {
        fm.classList.toggle("show", !entries[0].isIntersecting);
      },
      { threshold: 0.1 },
    ).observe(burger);
  } else {
    window.addEventListener(
      "scroll",
      function () {
        fm.classList.toggle("show", window.scrollY > 200);
      },
      { passive: true },
    );
  }

  // tap outside: close the menu and swallow the tap so nothing underneath is activated
  document.addEventListener(
    "click",
    function (e) {
      if (!isOpen()) return;
      var t = e.target;
      if (drawer.contains(t) || burger.contains(t) || fm.contains(t)) return;
      e.preventDefault();
      e.stopPropagation();
      close();
    },
    true,
  );
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") close();
  });
})();
