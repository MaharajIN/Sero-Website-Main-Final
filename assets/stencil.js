/* Sero Chocolates: shared behaviour for the Stencil look.
   Add to cart and the cart icon open the cart page (cart.html) instead of the old side drawer.
   This listener sits on window in the capture phase, so it runs before the shared cart script (sero.js). */
(function () {
  window.addEventListener('click', function (e) {
    var t = e.target;
    if (!t || !t.closest) return;
    var a = t.closest('[data-add]');
    if (a && window.Sero) {
      e.preventDefault(); e.stopImmediatePropagation();
      var buy = a.closest('.sp-buy'), out = buy && buy.querySelector('.sp-qty output');
      var q = out ? Math.max(1, +out.textContent || 1) : 1;
      window.Sero.add(a.dataset.add, q);
      location.href = 'cart.html?added=' + encodeURIComponent(a.dataset.add);
      return;
    }
    var c = t.closest('a.cart');
    if (c && !/cart\.html$/.test(location.pathname)) {
      e.preventDefault(); e.stopImmediatePropagation();
      location.href = 'cart.html';
    }
  }, true);
})();
