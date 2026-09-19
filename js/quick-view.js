/**
 * Deniz Müzik - Hızlı Bakış Modalı & Favoriler (Wishlist) Yönetimi
 */

class QuickViewAndWishlistManager {
  constructor() {
    this.wishlistKey = 'deniz_muzik_wishlist_v1';
    this.wishlist = this.loadWishlist();
    this.currentProduct = null;
    this.quickViewQty = 1;

    this.initElements();
    this.updateWishlistBadges();
  }

  initElements() {
    // Quick View Modal elements
    this.qvModal = document.getElementById('quickViewModal');
    this.qvOverlay = document.getElementById('quickViewOverlay');
    this.qvCloseBtn = document.getElementById('closeQuickViewBtn');

    if (this.qvCloseBtn) this.qvCloseBtn.addEventListener('click', () => this.closeQuickView());
    if (this.qvOverlay) this.qvOverlay.addEventListener('click', () => this.closeQuickView());

    // Wishlist Drawer elements
    this.wlDrawer = document.getElementById('wishlistDrawer');
    this.wlOverlay = document.getElementById('wishlistOverlay');
    this.wlCloseBtn = document.getElementById('closeWishlistBtn');
    this.wlItemsContainer = document.getElementById('wishlistItemsList');

    if (this.wlCloseBtn) this.wlCloseBtn.addEventListener('click', () => this.closeWishlist());
    if (this.wlOverlay) this.wlOverlay.addEventListener('click', () => this.closeWishlist());

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeQuickView();
        this.closeWishlist();
      }
    });
  }

  loadWishlist() {
    try {
      const stored = localStorage.getItem(this.wishlistKey);
      return stored ? JSON.parse(stored) : ["g-1", "p-1"];
    } catch (e) {
      return [];
    }
  }

  saveWishlist() {
    localStorage.setItem(this.wishlistKey, JSON.stringify(this.wishlist));
    this.updateWishlistBadges();
  }

  toggleWishlist(productId) {
    const idx = this.wishlist.indexOf(productId);
    const product = PRODUCTS_DATA.find(p => p.id === productId);

    if (idx > -1) {
      this.wishlist.splice(idx, 1);
      if (window.showToast) window.showToast(`"${product?.title?.substring(0, 24)}..." favorilerden çıkarıldı.`, 'info');
    } else {
      this.wishlist.push(productId);
      if (window.showToast) window.showToast(`"${product?.title?.substring(0, 24)}..." favorilere eklendi! ❤️`, 'success');
    }

    this.saveWishlist();
    this.updateAllWishlistButtons();
    this.renderWishlistDrawer();
  }

  isInWishlist(productId) {
    return this.wishlist.includes(productId);
  }

  updateWishlistBadges() {
    const badges = document.querySelectorAll('.wishlist-badge-count');
    badges.forEach(b => {
      b.textContent = this.wishlist.length;
      if (this.wishlist.length > 0) {
        b.classList.remove('hidden');
      } else {
        b.classList.add('hidden');
      }
    });
  }

  updateAllWishlistButtons() {
    document.querySelectorAll('[data-wishlist-btn]').forEach(btn => {
      const pid = btn.getAttribute('data-wishlist-btn');
      const isFavorited = this.isInWishlist(pid);
      if (isFavorited) {
        btn.classList.add('text-red-500', 'fill-red-500');
        btn.classList.remove('text-stone-400');
        const svg = btn.querySelector('svg');
        if (svg) svg.classList.add('fill-red-500');
      } else {
        btn.classList.remove('text-red-500', 'fill-red-500');
        btn.classList.add('text-stone-400');
        const svg = btn.querySelector('svg');
        if (svg) svg.classList.remove('fill-red-500');
      }
    });
  }

  openQuickView(productId) {
    const product = PRODUCTS_DATA.find(p => p.id === productId);
    if (!product) return;

    this.currentProduct = product;
    this.quickViewQty = 1;

    const cashPrice = calculateCashPrice(product.price);
    const container = document.getElementById('quickViewContent');
    if (!container) return;

    const isFav = this.isInWishlist(product.id);

    // Render Specs List
    const specsHtml = Object.entries(product.specs || {}).map(([key, val]) => `
      <div class="flex justify-between py-1 border-b border-stone-100 text-xs">
        <span class="text-stone-500 font-medium">${key}:</span>
        <span class="text-stone-800 font-semibold text-right max-w-[60%]">${val}</span>
      </div>
    `).join('');

    container.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 sm:p-8">
        <!-- Image & Gallery -->
        <div class="space-y-3">
          <div class="relative overflow-hidden rounded-xl border border-stone-200 bg-stone-100 aspect-square group">
            <img id="qvMainImage" src="${product.image}" alt="${product.title}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <span class="absolute top-3 left-3 bg-stone-900/90 text-cream-50 text-[11px] font-bold px-2.5 py-1 rounded backdrop-blur-xs">
              ${product.badge || product.categoryLabel}
            </span>
          </div>
          ${product.gallery && product.gallery.length > 1 ? `
          <div class="flex gap-2">
            ${product.gallery.map((img, i) => `
              <button onclick="document.getElementById('qvMainImage').src='${img}'" class="w-16 h-16 rounded-lg overflow-hidden border-2 border-stone-200 hover:border-amber-700 transition-colors">
                <img src="${img}" class="w-full h-full object-cover" />
              </button>
            `).join('')}
          </div>` : ''}
        </div>

        <!-- Product Details -->
        <div class="flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-amber-700 uppercase tracking-widest">${product.brand}</span>
              <span class="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Stokta Mevcut (${product.stockCount} adet)
              </span>
            </div>
            <h2 class="text-lg sm:text-xl font-bold text-stone-900 font-serif mt-1.5 leading-snug">${product.title}</h2>
            
            <!-- Rating -->
            <div class="flex items-center gap-2 mt-2">
              <div class="flex text-amber-700 text-xs">
                ${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))}
              </div>
              <span class="text-xs text-stone-500">(${product.reviewsCount} Değerlendirme & Yorum)</span>
            </div>

            <!-- Price Box -->
            <div class="mt-4 p-3.5 rounded-xl bg-stone-50 border border-stone-200/80">
              <div class="flex items-baseline gap-3">
                <span class="text-2xl font-extrabold text-stone-900">${formatTL(product.price)}</span>
                <span class="text-sm text-stone-400 line-through">${formatTL(product.originalPrice)}</span>
              </div>
              <div class="mt-1 flex items-center justify-between pt-2 border-t border-stone-200/60">
                <div class="flex items-center gap-1.5 text-xs text-stone-600">
                  <span class="px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 font-bold text-[10px]">%5 PEŞİN</span>
                  <span>Havale / Tek Çekim:</span>
                </div>
                <span class="text-sm font-bold text-emerald-700">${formatTL(cashPrice)}</span>
              </div>
            </div>

            <!-- Sound Preview Button -->
            <div class="mt-4">
              <button onclick="window.soundEngine.playTone('${product.soundType || 'acoustic-guitar'}')" class="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-cream-100 hover:bg-cream-200 text-stone-900 border border-amber-300 font-semibold text-xs tracking-wide transition-all shadow-2xs group">
                <span class="text-base group-hover:scale-125 transition-transform">🎵</span>
                <span>Bu Enstrümanın Canlı Tonunu Dinle (Web Audio)</span>
              </button>
            </div>

            <!-- Description -->
            <p class="mt-3 text-xs text-stone-600 leading-relaxed">${product.description}</p>

            <!-- Specs Accordion -->
            <div class="mt-4">
              <h5 class="text-xs font-bold text-stone-900 uppercase tracking-wider mb-2">Teknik Özellikler & Luthier Notu</h5>
              <div class="space-y-1">
                ${specsHtml}
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="mt-6 pt-4 border-t border-stone-200 space-y-3">
            <div class="flex gap-3">
              <!-- Quantity selector -->
              <div class="flex items-center border border-stone-300 rounded-lg bg-white overflow-hidden">
                <button onclick="window.quickViewManager.adjustQty(-1)" class="px-3 py-2 text-stone-600 hover:bg-stone-100 text-sm font-bold">−</button>
                <span id="qvQtyDisplay" class="px-4 py-2 text-xs font-bold text-stone-900 min-w-[32px] text-center">1</span>
                <button onclick="window.quickViewManager.adjustQty(1)" class="px-3 py-2 text-stone-600 hover:bg-stone-100 text-sm font-bold">+</button>
              </div>

              <!-- Add to Cart Button -->
              <button onclick="window.quickViewManager.addToCartFromQuickView()" class="flex-1 py-3 px-6 rounded-lg bg-stone-900 hover:bg-stone-800 text-cream-50 font-bold text-xs uppercase tracking-wider transition-colors shadow-sm flex items-center justify-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span>Sepete Ekle</span>
              </button>

              <!-- Favorite Toggle -->
              <button onclick="window.quickViewManager.toggleWishlist('${product.id}')" data-wishlist-btn="${product.id}" class="p-3 rounded-lg border border-stone-300 hover:border-red-400 text-stone-400 hover:text-red-500 transition-colors">
                <svg class="w-5 h-5 ${isFav ? 'fill-red-500 text-red-500' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>

            <div class="flex items-center justify-between text-[11px] text-stone-500 pt-1">
              <span class="flex items-center gap-1">🚚 PTT Kargo ile Sigortalı Gönderim</span>
              <span class="flex items-center gap-1">💳 Peşin Fiyatına 3 Taksit</span>
            </div>
          </div>
        </div>
      </div>
    `;

    if (this.qvModal && this.qvOverlay) {
      this.qvModal.classList.remove('hidden');
      this.qvOverlay.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    }
  }

  adjustQty(delta) {
    this.quickViewQty = Math.max(1, this.quickViewQty + delta);
    const display = document.getElementById('qvQtyDisplay');
    if (display) display.textContent = this.quickViewQty;
  }

  addToCartFromQuickView() {
    if (!this.currentProduct) return;
    if (window.cartManager) {
      window.cartManager.addItem(this.currentProduct.id, this.quickViewQty);
    }
    this.closeQuickView();
  }

  closeQuickView() {
    if (this.qvModal && this.qvOverlay) {
      this.qvModal.classList.add('hidden');
      this.qvOverlay.classList.add('hidden');
      document.body.style.overflow = '';
    }
  }

  openWishlist() {
    this.renderWishlistDrawer();
    if (this.wlDrawer && this.wlOverlay) {
      this.wlDrawer.classList.remove('translate-x-full');
      this.wlOverlay.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    }
  }

  closeWishlist() {
    if (this.wlDrawer && this.wlOverlay) {
      this.wlDrawer.classList.add('translate-x-full');
      this.wlOverlay.classList.add('hidden');
      document.body.style.overflow = '';
    }
  }

  renderWishlistDrawer() {
    if (!this.wlItemsContainer) return;
    const items = this.wishlist.map(id => PRODUCTS_DATA.find(p => p.id === id)).filter(Boolean);

    if (items.length === 0) {
      this.wlItemsContainer.innerHTML = `
        <div class="py-16 text-center text-stone-500">
          <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <p class="font-medium text-stone-700 text-base mb-1">Favori Listeniz Boş</p>
          <p class="text-xs text-stone-400 max-w-xs mx-auto mb-4">Beğendiğiniz enstrümanların kalp ikonuna tıklayarak favorilerinize ekleyin.</p>
        </div>
      `;
      return;
    }

    this.wlItemsContainer.innerHTML = items.map(p => `
      <div class="flex gap-3 py-3 border-b border-stone-200 items-center">
        <img src="${p.image}" alt="${p.title}" class="w-16 h-16 object-cover rounded-md border border-stone-200 bg-stone-100 flex-shrink-0" />
        <div class="flex-1 min-w-0">
          <h4 class="text-xs font-semibold text-stone-900 truncate">${p.title}</h4>
          <span class="text-xs font-bold text-stone-900 mt-1 block">${formatTL(p.price)}</span>
          <div class="mt-2 flex gap-2">
            <button onclick="window.cartManager.addItem('${p.id}', 1); window.quickViewManager.closeWishlist();" class="text-[11px] font-bold px-2.5 py-1 bg-stone-900 text-cream-50 rounded hover:bg-stone-800 transition-colors">
              Sepete Ekle
            </button>
            <button onclick="window.quickViewManager.toggleWishlist('${p.id}')" class="text-[11px] text-stone-400 hover:text-red-500 transition-colors">
              Kaldır
            </button>
          </div>
        </div>
      </div>
    `).join('');
  }
}

window.quickViewManager = new QuickViewAndWishlistManager();
