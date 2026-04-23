// Global cart + wishlist store. Persists to localStorage. Renders bag/wishlist drawers.
// Requires window.MW_PRODUCTS (from products.js) loaded before this script.
(function(){
  let MW_WISH = new Set();
  let MW_BAG  = {};
  try { MW_WISH = new Set(JSON.parse(localStorage.getItem('mwWishlist')||'[]')); } catch(e){}
  try { MW_BAG  = JSON.parse(localStorage.getItem('mwBag')||'{}'); } catch(e){}

  function $(id){ return document.getElementById(id); }
  function priceNum(p){ return parseFloat(String(p).replace(/[^0-9.]/g,''))||0; }

  function bagCount(){ return Object.values(MW_BAG).reduce((s,it)=>s+it.qty,0); }
  function bagTotal(){ return Object.values(MW_BAG).reduce((s,it)=>s + priceNum(it.price)*it.qty, 0); }

  function saveBag(){  try { localStorage.setItem('mwBag',  JSON.stringify(MW_BAG));         } catch(e){} }
  function saveWish(){ try { localStorage.setItem('mwWishlist', JSON.stringify([...MW_WISH])); } catch(e){} }

  function updateBadges(){
    const c = bagCount(), w = MW_WISH.size;
    document.querySelectorAll('[data-bag-badge]').forEach(b=>{
      if(c>0){ b.textContent=c; b.style.display='flex'; } else { b.style.display='none'; }
    });
    document.querySelectorAll('[data-wish-badge]').forEach(b=>{
      if(w>0){ b.textContent=w; b.style.display='flex'; } else { b.style.display='none'; }
    });
    const bc = $('bagCount'); if(bc) bc.textContent = c;
    const wc = $('wishHeaderCount'); if(wc) wc.textContent = w;
  }

  function renderBag(){
    const body = $('bagBody'), foot = $('bagFooter');
    if(!body) return;
    const ids = Object.keys(MW_BAG);
    if(ids.length===0){
      body.innerHTML = '<div class="bag-empty"><svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="#bbb" stroke-width="1.5"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg><p>Your bag is empty</p></div>';
      if(foot) foot.style.display='none';
      return;
    }
    body.innerHTML = ids.map(id=>{
      const it = MW_BAG[id];
      return `<div class="bag-item">
        <img class="bag-item__img" src="${it.img}" alt="${it.name}" onerror="this.style.background='#eee'">
        <div class="bag-item__info">
          <div>
            <h4 class="bag-item__name">${it.name}</h4>
            <p class="bag-item__price">${it.price}</p>
          </div>
          <div class="bag-item__bottom">
            <div class="bag-item__qty">
              <button class="bag-item__qbtn" onclick="mwBagQty('${id}',-1)">−</button>
              <span class="bag-item__qval">${it.qty}</span>
              <button class="bag-item__qbtn" onclick="mwBagQty('${id}',1)">+</button>
            </div>
            <button class="bag-item__remove" onclick="mwBagRemove('${id}')">Remove</button>
          </div>
        </div>
      </div>`;
    }).join('');
    const tt = $('bagTotal'); if(tt) tt.textContent = bagTotal().toFixed(2)+' DH';
    if(foot) foot.style.display='block';
  }

  function renderWish(){
    const body = $('wishBody'); if(!body) return;
    const ids = [...MW_WISH];
    if(ids.length===0){
      body.innerHTML = '<div class="bag-empty"><svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="#bbb" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg><p>Your wishlist is empty</p></div>';
      return;
    }
    body.innerHTML = ids.map(id=>{
      const p = window.mwProduct(id);
      if(!p) return '';
      return `<div class="bag-item">
        <img class="bag-item__img" src="${p.img}" alt="${p.name}" onerror="this.style.background='#eee'">
        <div class="bag-item__info">
          <div>
            <h4 class="bag-item__name">${p.name}</h4>
            <p class="bag-item__price">${p.price}</p>
          </div>
          <div class="bag-item__bottom">
            <button class="bag-item__remove" onclick="mwAddToBag(${p.id})" style="color:#291409;font-weight:600;">+ Add to Bag</button>
            <button class="bag-item__remove" onclick="mwWishRemove('${id}')">Remove</button>
          </div>
        </div>
      </div>`;
    }).join('');
  }

  function syncHearts(){
    document.querySelectorAll('.mw-wish, .bs-wish, .pc-wish').forEach(b=>{
      const oc = b.getAttribute('onclick')||'';
      const dp = b.getAttribute('data-pid');
      const m = oc.match(/mwToggleWish\(([0-9]+)/);
      const id = dp || (m && m[1]);
      if(!id) return;
      if(MW_WISH.has(String(id))) b.classList.add('active');
      else b.classList.remove('active');
    });
  }

  window.mwToggleWish = function(id, btn){
    id = String(id);
    if(MW_WISH.has(id)){ MW_WISH.delete(id); }
    else { MW_WISH.add(id); }
    saveWish(); updateBadges(); renderWish(); syncHearts();
  };
  window.mwWishRemove = function(id){
    MW_WISH.delete(String(id));
    saveWish(); updateBadges(); renderWish(); syncHearts();
  };
  window.mwAddToBag = function(id){
    id = String(id);
    const p = window.mwProduct(id); if(!p) return;
    if(MW_BAG[id]) MW_BAG[id].qty++;
    else MW_BAG[id] = {name:p.name, price:p.price, img:p.img, qty:1};
    saveBag(); updateBadges(); renderBag(); toast();
  };
  window.mwBagQty = function(id, delta){
    if(!MW_BAG[id]) return;
    MW_BAG[id].qty += delta;
    if(MW_BAG[id].qty<=0) delete MW_BAG[id];
    saveBag(); updateBadges(); renderBag();
  };
  window.mwBagRemove = function(id){
    delete MW_BAG[id]; saveBag(); updateBadges(); renderBag();
  };
  window.mwGetBag    = () => ({...MW_BAG});
  window.mwBagTotal  = bagTotal;
  window.mwBagCount  = bagCount;
  window.mwGetWish   = () => [...MW_WISH];
  window.mwRenderBag = renderBag;
  window.mwRenderWish= renderWish;

  function toast(){
    let t = $('mwGlobalToast');
    if(!t){
      t = document.createElement('div');
      t.id = 'mwGlobalToast';
      t.style.cssText = 'position:fixed;left:50%;transform:translateX(-50%);bottom:calc(var(--bottom-nav-height,72px) + 16px);background:#291409;color:#FEFCFB;padding:10px 18px;border-radius:24px;font-size:.85rem;font-weight:600;z-index:9999;opacity:0;transition:opacity .2s;pointer-events:none;';
      document.body.appendChild(t);
    }
    t.textContent = 'Added to bag!';
    t.style.opacity = '1';
    clearTimeout(window._mwToastT);
    window._mwToastT = setTimeout(()=>{ t.style.opacity='0'; }, 1800);
  }
  window.mwToast = toast;

  document.addEventListener('DOMContentLoaded', () => {
    updateBadges(); renderBag(); renderWish(); syncHearts();
    // Wishlist trigger from bottom-nav
    document.querySelectorAll('[data-open-wish]').forEach(el => {
      el.addEventListener('click', e => {
        e.preventDefault();
        const dr = $('wishDrawer'), ov = $('wishOverlay');
        if(dr && ov){ dr.classList.add('bag-drawer--open'); ov.classList.add('bag-overlay--open'); document.body.style.overflow='hidden'; renderWish(); }
      });
    });
    // Re-sync hearts whenever new cards are inserted (filters/pagination)
    const obs = new MutationObserver(() => syncHearts());
    obs.observe(document.body, { childList:true, subtree:true });
  });
})();
