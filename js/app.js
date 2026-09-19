/**
 * Deniz Müzik - Ana Uygulama Mantığı (app.js)
 * Otomatik Arama Tamamlama, Kategori & Fiyat Filtreleri, Sıralama, Hero Slider & Toast Sistemi
 */

// Toast notification helper
window.showToast = function(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  const bgMap = {
    success: 'bg-stone-900 border-emerald-500 text-cream-50',
    warning: 'bg-stone-900 border-amber-500 text-cream-50',
    info: 'bg-stone-900 border-amber-600 text-cream-50',
    error: 'bg-red-900 border-red-500 text-cream-50'
  };

  const iconMap = {
    success: '✓',
    warning: '⚠️',
    info: 'ℹ️',
    error: '✕'
  };

  toast.className = `flex items-center gap-3 px-4 py-3 rounded-xl border-l-4 shadow-xl text-xs font-medium transform transition-all duration-300 translate-y-2 opacity-0 ${bgMap[type] || bgMap.info}`;
  toast.innerHTML = `
    <span class="text-sm font-bold">${iconMap[type] || '•'}</span>
    <span class="flex-1">${message}</span>
  `;

  container.appendChild(toast);

  // Trigger anim
  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-2', 'opacity-0');
  });

  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-2');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
};

class DenizMuzikApp {
  constructor() {
    this.currentCategory = 'all';
    this.searchQuery = '';
    this.currentSort = 'popular';
    this.maxPrice = 250000;
    this.onlyInStock = false;
    this.currentSlide = 0;
    this.slideInterval = null;

    this.init();
  }

  init() {
    this.initHeroSlider();
    this.initAnnouncementTicker();
    this.initSearchAutocomplete();
    this.initFiltersAndSorting();
    this.initModalsAndDrawers();
    this.renderCatalog();

    // Re-sync wishlist button styles
    if (window.quickViewManager) {
      window.quickViewManager.updateAllWishlistButtons();
    }
  }

  // --- 1. HERO SLIDER ---
  initHeroSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.hero-dot');
    const prevBtn = document.getElementById('heroPrevBtn');
    const nextBtn = document.getElementById('heroNextBtn');
    const heroSection = document.getElementById('heroSection');

    if (!slides.length) return;

    const goToSlide = (index) => {
      this.currentSlide = (index + slides.length) % slides.length;
      slides.forEach((slide, i) => {
        if (i === this.currentSlide) {
          slide.classList.remove('opacity-0', 'pointer-events-none');
          slide.classList.add('opacity-100', 'pointer-events-auto');
        } else {
          slide.classList.add('opacity-0', 'pointer-events-none');
          slide.classList.remove('opacity-100', 'pointer-events-auto');
        }
      });
      dots.forEach((dot, i) => {
        if (i === this.currentSlide) {
          dot.className = 'hero-dot w-8 h-2 rounded-full bg-cream-50 transition-all duration-300';
        } else {
          dot.className = 'hero-dot w-2 h-2 rounded-full bg-cream-50/40 transition-all duration-300 hover:bg-cream-50/70';
        }
      });
    };

    const nextSlide = () => goToSlide(this.currentSlide + 1);
    const prevSlide = () => goToSlide(this.currentSlide - 1);

    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);

    dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => goToSlide(idx));
    });

    // Auto rotate every 6 seconds
    const startAutoplay = () => {
      this.slideInterval = setInterval(nextSlide, 6000);
    };
    const stopAutoplay = () => {
      clearInterval(this.slideInterval);
    };

    startAutoplay();
    if (heroSection) {
      heroSection.addEventListener('mouseenter', stopAutoplay);
      heroSection.addEventListener('mouseleave', startAutoplay);
    }
  }

  // --- 2. ANNOUNCEMENT TICKER ---
  initAnnouncementTicker() {
    const messages = [
      "🚚 2.000 TL ve Üzeri Tüm Alışverişlerde PTT Kargo ile Ücretsiz & Sigortalı Teslimat",
      "💳 Peşin Fiyatına 3 Taksit İmkanı (Tüm Bonus, World, Maximum, Axess Kartlara Komisyonsuz)",
      "⚡ Tek Çekim & Havale / EFT Ödemelerinde Anında %5 Ekstra İndirim Fırsatı",
      "📍 Sakarya Arifiye Showroom Mağazamızda Özel Luthier Ayarları ve Deneme Odaları"
    ];
    let msgIndex = 0;
    const tickerEl = document.getElementById('announcementTickerText');
    if (!tickerEl) return;

    setInterval(() => {
      msgIndex = (msgIndex + 1) % messages.length;
      tickerEl.style.opacity = '0';
      tickerEl.style.transform = 'translateY(-6px)';
      setTimeout(() => {
        tickerEl.textContent = messages[msgIndex];
        tickerEl.style.opacity = '1';
        tickerEl.style.transform = 'translateY(0)';
      }, 300);
    }, 4500);
  }

  // --- 3. SEARCH & AUTOCOMPLETE ---
  initSearchAutocomplete() {
    const searchInputs = [
      document.getElementById('headerSearchInput'),
      document.getElementById('mobileSearchInput')
    ].filter(Boolean);

    const resultsBox = document.getElementById('searchAutocompleteBox');

    searchInputs.forEach(input => {
      input.addEventListener('input', (e) => {
        const query = e.target.value.trim().toLowerCase();
        this.searchQuery = query;

        if (query.length < 2) {
          if (resultsBox) resultsBox.classList.add('hidden');
          this.renderCatalog();
          return;
        }

        const matches = PRODUCTS_DATA.filter(p => 
          p.title.toLowerCase().includes(query) ||
          p.brand.toLowerCase().includes(query) ||
          p.categoryLabel.toLowerCase().includes(query) ||
          p.subCategory.toLowerCase().includes(query)
        );

        if (resultsBox) {
          if (matches.length === 0) {
            resultsBox.innerHTML = `
              <div class="p-4 text-center text-xs text-stone-500">
                "${query}" ile eşleşen enstrüman bulunamadı.
              </div>
            `;
          } else {
            resultsBox.innerHTML = `
              <div class="p-2 border-b border-stone-100 flex items-center justify-between text-[11px] text-stone-500 font-medium">
                <span>Sonuçlar (${matches.length})</span>
                <span class="text-amber-700">Deniz Müzik Koleksiyonu</span>
              </div>
              <div class="max-h-80 overflow-y-auto divide-y divide-stone-100">
                ${matches.slice(0, 6).map(p => `
                  <div onclick="window.quickViewManager.openQuickView('${p.id}'); document.getElementById('searchAutocompleteBox').classList.add('hidden');" class="flex items-center gap-3 p-3 hover:bg-stone-50 cursor-pointer transition-colors group">
                    <img src="${p.image}" class="w-12 h-12 object-cover rounded border border-stone-200" />
                    <div class="flex-1 min-w-0">
                      <div class="text-[10px] uppercase font-bold text-amber-700 tracking-wider">${p.brand} · ${p.categoryLabel}</div>
                      <div class="text-xs font-semibold text-stone-900 truncate group-hover:text-amber-800 transition-colors">${p.title}</div>
                      <div class="text-xs font-extrabold text-stone-800 mt-0.5">${formatTL(p.price)}</div>
                    </div>
                  </div>
                `).join('')}
              </div>
            `;
          }
          resultsBox.classList.remove('hidden');
        }

        this.renderCatalog();
      });

      input.addEventListener('focus', () => {
        if (input.value.trim().length >= 2 && resultsBox) {
          resultsBox.classList.remove('hidden');
        }
      });
    });

    // Close autocomplete when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('#headerSearchContainer') && resultsBox) {
        resultsBox.classList.add('hidden');
      }
    });
  }

  // --- 4. FILTERS & SORTING ---
  initFiltersAndSorting() {
    // Category tabs
    const categoryButtons = document.querySelectorAll('[data-category-filter]');
    categoryButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const cat = btn.getAttribute('data-category-filter');
        this.setCategory(cat);
      });
    });

    // Sort select
    const sortSelect = document.getElementById('catalogSortSelect');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        this.currentSort = e.target.value;
        this.renderCatalog();
      });
    }

    // Price range slider
    const priceSlider = document.getElementById('catalogPriceSlider');
    const priceDisplay = document.getElementById('catalogPriceDisplay');
    if (priceSlider && priceDisplay) {
      priceSlider.addEventListener('input', (e) => {
        this.maxPrice = parseInt(e.target.value, 10);
        priceDisplay.textContent = formatTL(this.maxPrice);
        this.renderCatalog();
      });
    }

    // Stock only checkbox
    const stockCheckbox = document.getElementById('catalogStockOnly');
    if (stockCheckbox) {
      stockCheckbox.addEventListener('change', (e) => {
        this.onlyInStock = e.target.checked;
        this.renderCatalog();
      });
    }
  }

  setCategory(category) {
    this.currentCategory = category;

    // Update active styling on category buttons
    document.querySelectorAll('[data-category-filter]').forEach(btn => {
      const cat = btn.getAttribute('data-category-filter');
      if (cat === category) {
        btn.className = 'px-4 py-2 rounded-full text-xs font-bold bg-stone-900 text-cream-50 shadow-sm transition-all';
      } else {
        btn.className = 'px-4 py-2 rounded-full text-xs font-semibold bg-stone-100 text-stone-700 hover:bg-stone-200 transition-all';
      }
    });

    // Scroll slightly to catalog if clicked from nav
    const catalogHeader = document.getElementById('catalogSection');
    if (catalogHeader && window.scrollY > 400) {
      catalogHeader.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    this.renderCatalog();
  }

  getFilteredProducts() {
    return PRODUCTS_DATA.filter(product => {
      // Category match
      if (this.currentCategory !== 'all' && product.category !== this.currentCategory) {
        return false;
      }
      // Price match
      if (product.price > this.maxPrice) {
        return false;
      }
      // Stock match
      if (this.onlyInStock && !product.inStock) {
        return false;
      }
      // Query match
      if (this.searchQuery) {
        const q = this.searchQuery;
        const matches = product.title.toLowerCase().includes(q) ||
                        product.brand.toLowerCase().includes(q) ||
                        product.categoryLabel.toLowerCase().includes(q) ||
                        product.subCategory.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    }).sort((a, b) => {
      switch (this.currentSort) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'popular':
        default:
          return b.reviewsCount - a.reviewsCount;
      }
    });
  }

  renderCatalog() {
    const grid = document.getElementById('productsGrid');
    const countEl = document.getElementById('catalogResultsCount');
    if (!grid) return;

    const filtered = this.getFilteredProducts();

    if (countEl) {
      countEl.textContent = `${filtered.length} enstrüman listeleniyor`;
    }

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="col-span-full py-16 text-center text-stone-500 bg-stone-50/60 rounded-2xl border border-stone-200/80">
          <div class="text-4xl mb-3">🔍</div>
          <h3 class="text-base font-bold text-stone-800">Seçilen kriterlere uygun enstrüman bulunamadı</h3>
          <p class="text-xs text-stone-500 mt-1 max-w-sm mx-auto">Lütfen fiyat filtresini yükseltmeyi veya kategori filtresini sıfırlamayı deneyin.</p>
          <button onclick="window.app.resetFilters()" class="mt-4 px-4 py-2 bg-stone-900 text-cream-50 rounded-lg text-xs font-bold hover:bg-stone-800 transition-colors">
            Filtreleri Temizle
          </button>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered.map(product => {
      const cashPrice = calculateCashPrice(product.price);
      const isFav = window.quickViewManager ? window.quickViewManager.isInWishlist(product.id) : false;

      return `
        <div class="group bg-white rounded-2xl border border-stone-200/90 overflow-hidden hover:shadow-xl hover:border-stone-400 transition-all duration-300 flex flex-col justify-between relative">
          <!-- Image Section with badges & floating buttons -->
          <div class="relative overflow-hidden bg-stone-100 aspect-square">
            <img src="${product.image}" alt="${product.title}" loading="lazy" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            
            <!-- Category & Badge Tags -->
            <div class="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
              ${product.badge ? `
                <span class="px-2.5 py-1 rounded text-[10px] font-bold tracking-wide uppercase bg-stone-900/90 text-cream-50 backdrop-blur-xs shadow-2xs">
                  ${product.badge}
                </span>
              ` : ''}
              <span class="px-2 py-0.5 rounded text-[9px] font-bold tracking-wider uppercase bg-amber-100/90 text-amber-950">
                ${product.subCategory}
              </span>
            </div>

            <!-- Wishlist Heart Button -->
            <button onclick="window.quickViewManager.toggleWishlist('${product.id}')" data-wishlist-btn="${product.id}" class="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white text-stone-400 hover:text-red-500 shadow-sm backdrop-blur-xs transition-colors z-10" title="Favorilere Ekle">
              <svg class="w-4 h-4 ${isFav ? 'fill-red-500 text-red-500' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>

            <!-- Quick View Overlay Button (Hover Reveal) -->
            <div class="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
              <button onclick="window.quickViewManager.openQuickView('${product.id}')" class="flex-1 py-2 px-3 bg-stone-900/90 hover:bg-stone-900 text-cream-50 text-xs font-bold rounded-lg shadow backdrop-blur-xs transition-colors flex items-center justify-center gap-1.5">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                Hızlı Bakış
              </button>
              <button onclick="window.soundEngine.playTone('${product.soundType || 'acoustic-guitar'}')" class="p-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg shadow transition-colors" title="Canlı Enstrüman Sesini Dinle">
                🎵
              </button>
            </div>
          </div>

          <!-- Card Content Body -->
          <div class="p-4 flex-1 flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between text-[11px] text-stone-500 mb-1">
                <span class="font-bold text-amber-700 tracking-wider uppercase">${product.brand}</span>
                <div class="flex items-center gap-1 text-amber-700 font-semibold">
                  <span>★</span>
                  <span>${product.rating.toFixed(1)}</span>
                  <span class="text-stone-400 font-normal">(${product.reviewsCount})</span>
                </div>
              </div>

              <h3 onclick="window.quickViewManager.openQuickView('${product.id}')" class="font-semibold text-stone-900 text-xs sm:text-sm hover:text-amber-800 transition-colors cursor-pointer line-clamp-2 leading-snug" title="${product.title}">
                ${product.title}
              </h3>
            </div>

            <!-- Price & Buy Section -->
            <div class="mt-4 pt-3 border-t border-stone-100 space-y-2">
              <div class="flex items-baseline justify-between">
                <div>
                  <div class="text-base sm:text-lg font-extrabold text-stone-900 leading-none">
                    ${formatTL(product.price)}
                  </div>
                  <div class="text-[11px] text-stone-400 line-through mt-0.5">
                    ${formatTL(product.originalPrice)}
                  </div>
                </div>

                <!-- 5% Cash Discount Pill -->
                <div class="text-right">
                  <div class="text-[9px] font-bold text-amber-900 bg-amber-100/90 px-1.5 py-0.5 rounded inline-block">
                    Peşin: ${formatTL(cashPrice)}
                  </div>
                  <div class="text-[9px] text-stone-400 block">%5 Ekstra İndirim</div>
                </div>
              </div>

              <!-- Quick Add to Cart Button -->
              <button onclick="window.cartManager.addItem('${product.id}', 1)" class="w-full py-2.5 px-4 bg-stone-900 hover:bg-stone-800 text-cream-50 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 shadow-2xs group">
                <svg class="w-3.5 h-3.5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span>Sepete Ekle</span>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    if (window.quickViewManager) {
      window.quickViewManager.updateAllWishlistButtons();
    }
  }

  resetFilters() {
    this.currentCategory = 'all';
    this.searchQuery = '';
    this.maxPrice = 250000;
    this.onlyInStock = false;
    this.currentSort = 'popular';

    const searchInput = document.getElementById('headerSearchInput');
    if (searchInput) searchInput.value = '';

    const priceSlider = document.getElementById('catalogPriceSlider');
    const priceDisplay = document.getElementById('catalogPriceDisplay');
    if (priceSlider) priceSlider.value = 250000;
    if (priceDisplay) priceDisplay.textContent = formatTL(250000);

    const stockCheckbox = document.getElementById('catalogStockOnly');
    if (stockCheckbox) stockCheckbox.checked = false;

    this.setCategory('all');
  }

  // --- 5. MODALS & DRAWERS ---
  initModalsAndDrawers() {
    // Mobile Drawer Toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileDrawer = document.getElementById('mobileMenuDrawer');
    const mobileOverlay = document.getElementById('mobileMenuOverlay');
    const closeMobileBtn = document.getElementById('closeMobileMenuBtn');

    if (mobileMenuBtn && mobileDrawer && mobileOverlay) {
      mobileMenuBtn.addEventListener('click', () => {
        mobileDrawer.classList.remove('-translate-x-full');
        mobileOverlay.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
      });
      const closeMobile = () => {
        mobileDrawer.classList.add('-translate-x-full');
        mobileOverlay.classList.add('hidden');
        document.body.style.overflow = '';
      };
      if (closeMobileBtn) closeMobileBtn.addEventListener('click', closeMobile);
      mobileOverlay.addEventListener('click', closeMobile);
    }

    // Account Modal
    const accountBtns = document.querySelectorAll('.open-account-modal');
    const accountModal = document.getElementById('accountModal');
    const accountOverlay = document.getElementById('accountOverlay');
    const closeAccountBtn = document.getElementById('closeAccountBtn');

    if (accountModal && accountOverlay) {
      accountBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          accountModal.classList.remove('hidden');
          accountOverlay.classList.remove('hidden');
          document.body.style.overflow = 'hidden';
        });
      });
      const closeAccount = () => {
        accountModal.classList.add('hidden');
        accountOverlay.classList.add('hidden');
        document.body.style.overflow = '';
      };
      if (closeAccountBtn) closeAccountBtn.addEventListener('click', closeAccount);
      accountOverlay.addEventListener('click', closeAccount);
    }

    // Header Cart & Wishlist click listeners
    const cartToggleBtns = document.querySelectorAll('.toggle-cart-drawer');
    cartToggleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        if (window.cartManager) window.cartManager.openDrawer();
      });
    });

    const wishlistToggleBtns = document.querySelectorAll('.toggle-wishlist-drawer');
    wishlistToggleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        if (window.quickViewManager) window.quickViewManager.openWishlist();
      });
    });
  }
}

// Instantiate on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.app = new DenizMuzikApp();
});
