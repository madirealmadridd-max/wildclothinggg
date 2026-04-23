// Shared shell: injects header, menu drawer, bag/wishlist drawers, and bottom nav into <body>.
// Pages with class "page" should call WildShell.mount() (auto-runs on DOMContentLoaded).

(function(){
  const ICONS = {
    chev: '<svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>',
    user: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
    heart: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
  };

  const BADGE_STYLE = 'position:absolute;top:-2px;right:-4px;min-width:16px;height:16px;padding:0 4px;background:#291409;color:#FEFCFB;border-radius:8px;font-size:10px;font-weight:700;display:none;align-items:center;justify-content:center;line-height:1;';

  function buildHeader(active){
    return `
    <header class="header header--fixed" id="header" style="position:fixed;top:0;left:50%;transform:translateX(-50%);width:100%;max-width:var(--frame-width);z-index:100;">
      <div class="header__left">
        <button class="icon-btn" id="menuBtn" aria-label="Open menu">
          <svg viewBox="0 0 24 24"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></svg>
        </button>
      </div>
      <a href="index.html" class="header__logo">WILD CLOTHING</a>
      <div class="header__right">
        <button class="icon-btn icon-btn--wish" aria-label="Wishlist" id="wishBtn" style="position:relative;">
          <svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          <span data-wish-badge style="${BADGE_STYLE}"></span>
        </button>
        <button class="icon-btn icon-btn--cart" aria-label="Cart" id="bagBtn" style="position:relative;">
          <svg viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          <span data-bag-badge style="${BADGE_STYLE}"></span>
        </button>
      </div>
    </header>

    <div class="menu-overlay" id="menuOverlay"></div>
    <aside class="menu-drawer" id="menuDrawer">
      <div class="menu-drawer__header">
        <span class="menu-drawer__title">Menu</span>
        <button class="menu-drawer__close" id="closeMenu" aria-label="Close menu">&times;</button>
      </div>
      <nav class="menu-drawer__nav">
        <a href="new-arrivals.html" class="menu-drawer__item${active==='new'?' menu-drawer__item--active':''}">New Arrivals${ICONS.chev}</a>
        <a href="shop.html" class="menu-drawer__item${active==='shop'?' menu-drawer__item--active':''}">Shop${ICONS.chev}</a>
        <a href="clothing.html" class="menu-drawer__item${active==='clothing'?' menu-drawer__item--active':''}">Clothing${ICONS.chev}</a>
        <a href="shop.html#perfumes" class="menu-drawer__item">Perfumes${ICONS.chev}</a>
        <a href="cart.html" class="menu-drawer__item${active==='cart'?' menu-drawer__item--active':''}">Cart${ICONS.chev}</a>
        <a href="index.html" class="menu-drawer__item">Sale${ICONS.chev}</a>
      </nav>
      <div class="menu-drawer__footer">
        <a href="login.html" class="menu-drawer__footer-btn" style="text-decoration:none">${ICONS.user}Account</a>
        <button class="menu-drawer__footer-btn" data-open-wish>${ICONS.heart}Wishlist</button>
      </div>
    </aside>

    <div class="bag-overlay" id="wishOverlay"></div>
    <aside class="bag-drawer" id="wishDrawer">
      <div class="menu-drawer__header">
        <span class="menu-drawer__title">Wishlist (<span id="wishHeaderCount">0</span>)</span>
        <button class="menu-drawer__close" id="closeWish" aria-label="Close wishlist">&times;</button>
      </div>
      <div class="bag-body" id="wishBody"><div class="bag-empty"><p>Your wishlist is empty</p></div></div>
    </aside>

    <div class="bag-overlay" id="bagOverlay"></div>
    <aside class="bag-drawer" id="bagDrawer">
      <div class="menu-drawer__header">
        <span class="menu-drawer__title">Your Bag (<span id="bagCount">0</span>)</span>
        <button class="menu-drawer__close" id="closeBag" aria-label="Close bag">&times;</button>
      </div>
      <div class="bag-body" id="bagBody"><div class="bag-empty">
        <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="#bbb" stroke-width="1.5"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
        <p>Your bag is empty</p>
      </div></div>
      <div class="bag-footer" id="bagFooter" style="display:none;padding:14px 16px;border-top:1px solid #eee;background:#fff;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
          <span style="font-size:.8rem;color:#666;letter-spacing:.5px;">SUBTOTAL</span>
          <span id="bagTotal" style="font-weight:700;color:#291409;">0.00 DH</span>
        </div>
        <a href="cart.html" style="display:block;text-align:center;padding:10px;border:1px solid #291409;color:#291409;text-decoration:none;font-size:.8rem;font-weight:700;letter-spacing:.5px;border-radius:4px;margin-bottom:8px;">VIEW CART</a>
        <a href="cart.html#checkout" style="display:block;text-align:center;padding:12px;background:#291409;color:#FEFCFB;text-decoration:none;font-size:.8rem;font-weight:700;letter-spacing:.5px;border-radius:4px;">CHECKOUT</a>
      </div>
    </aside>`;
  }

  function buildBottomNav(active){
    const item = (href, key, label, svg, extra='') => `<a href="${href}" class="bottom-nav__item${active===key?' bottom-nav__item--active':''}" ${extra} style="position:relative;">${svg}${label}</a>`;
    return `
    <nav class="bottom-nav">
      ${item('index.html','home','Home','<svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>')}
      ${item('shop.html','shop','Shop','<svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>')}
      ${item('#','wish','Wishlist','<svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg><span data-wish-badge style="position:absolute;top:6px;right:30%;min-width:16px;height:16px;padding:0 4px;background:#291409;color:#FEFCFB;border-radius:8px;font-size:10px;font-weight:700;display:none;align-items:center;justify-content:center;line-height:1;"></span>','data-open-wish')}
      ${item('login.html','account','Account','<svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>')}
    </nav>`;
  }

  function wireDrawers(){
    const $ = id => document.getElementById(id);
    const open = (d,o) => { d.classList.add('menu-drawer--open','bag-drawer--open'); o.classList.add('menu-overlay--open','bag-overlay--open'); document.body.style.overflow='hidden'; };
    const close = (d,o) => { d.classList.remove('menu-drawer--open','bag-drawer--open'); o.classList.remove('menu-overlay--open','bag-overlay--open'); document.body.style.overflow=''; };
    const pairs = [['menuBtn','closeMenu','menuDrawer','menuOverlay'],
                   ['bagBtn','closeBag','bagDrawer','bagOverlay'],
                   ['wishBtn','closeWish','wishDrawer','wishOverlay']];
    pairs.forEach(([b,c,d,o]) => {
      const btn=$(b), cls=$(c), dr=$(d), ov=$(o);
      if (btn) btn.addEventListener('click', () => { open(dr,ov); if(dr.id==='bagDrawer'&&window.mwRenderBag) window.mwRenderBag(); if(dr.id==='wishDrawer'&&window.mwRenderWish) window.mwRenderWish(); });
      if (cls) cls.addEventListener('click', () => close(dr,ov));
      if (ov)  ov.addEventListener('click', () => close(dr,ov));
    });
    const header = $('header');
    if (header) window.addEventListener('scroll', () => {
      header.classList.toggle('header--scrolled', window.pageYOffset > 4);
    }, { passive: true });
  }

  window.WildShell = {
    mount({ active = '', activeNav = '' } = {}) {
      const app = document.querySelector('.app');
      if (!app) return;
      app.insertAdjacentHTML('afterbegin', buildHeader(active));
      app.insertAdjacentHTML('beforeend', buildBottomNav(activeNav));
      wireDrawers();
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
    const root = document.querySelector('[data-shell]');
    if (root) WildShell.mount({ active: root.dataset.shell, activeNav: root.dataset.nav || '' });
  });
})();
