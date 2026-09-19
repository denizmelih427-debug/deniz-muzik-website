/**
 * Deniz Müzik - Sepet Yönetimi ve Dinamik Hesaplamalar
 * PTT Kargo 2.000 TL Ücretsiz Kargo İlerleme Çubuğu & PayTR / %5 Peşin İndirimi
 */

class CartManager {
  constructor() {
    this.storageKey = 'deniz_muzik_cart_v1';
    this.items = this.loadCart();
    this.paymentMethod = 'credit_card'; // 'credit_card' (PayTR 3 taksit) or 'cash' (5% instant discount)
    this.appliedCoupon = null; // { code: 'DENIZ10', discountPercent: 10 }
    this.freeShippingThreshold = 2000;
    this.standardShippingCost = 149;
    
    this.initElements();
    this.render();
  }

  initElements() {
    this.drawer = document.getElementById('cartDrawer');
    this.overlay = document.getElementById('cartOverlay');
    this.closeBtn = document.getElementById('closeCartBtn');
    this.cartItemsContainer = document.getElementById('cartItemsList');
    this.badgeCounters = document.querySelectorAll('.cart-badge-count');
    this.subtotalEl = document.getElementById('cartSubtotal');
    this.shippingEl = document.getElementById('cartShipping');
    this.cashDiscountRow = document.getElementById('cartCashDiscountRow');
    this.cashDiscountEl = document.getElementById('cartCashDiscount');
    this.couponDiscountRow = document.getElementById('cartCouponDiscountRow');
    this.couponDiscountEl = document.getElementById('cartCouponDiscount');
    this.totalEl = document.getElementById('cartGrandTotal');
    this.shippingProgressFill = document.getElementById('shippingProgressFill');
    this.shippingMessageEl = document.getElementById('shippingProgressMessage');
    this.payMethodRadios = document.querySelectorAll('input[name="cartPaymentOption"]');
    this.checkoutBtn = document.getElementById('cartCheckoutBtn');
    this.couponInput = document.getElementById('cartCouponInput');
    this.applyCouponBtn = document.getElementById('cartApplyCouponBtn');
    this.couponMessage = document.getElementById('cartCouponMsg');

    // Event listeners
    if (this.closeBtn) this.closeBtn.addEventListener('click', () => this.closeDrawer());
    if (this.overlay) this.overlay.addEventListener('click', () => this.closeDrawer());

    this.payMethodRadios.forEach(radio => {
      radio.addEventListener('change', (e) => {
        this.paymentMethod = e.target.value;
        this.render();
      });
    });

    if (this.applyCouponBtn) {
      this.applyCouponBtn.addEventListener('click', () => this.handleApplyCoupon());
    }

    if (this.checkoutBtn) {
      this.checkoutBtn.addEventListener('click', () => {
        if (this.items.length === 0) {
          if (window.showToast) window.showToast("Sepetiniz boş. Lütfen önce ürün ekleyin.", "warning");
          return;
        }
        this.closeDrawer();
        if (window.checkoutManager) {
          window.checkoutManager.openCheckout(this.getCheckoutSummary());
        }
      });
    }

    // Global keyboard listener
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isDrawerOpen()) {
        this.closeDrawer();
      }
    });
  }

  loadCart() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [
        // Varsayılan zengin sepet örneği (kullanıcı hemen görebilsin)
        {
          id: "g-1",
          quantity: 1
        },
        {
          id: "a-1",
          quantity: 2
        }
      ];
    } catch (e) {
      return [];
    }
  }

  saveCart() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.items));
  }

  addItem(productId, quantity = 1) {
    const existing = this.items.find(item => item.id === productId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      this.items.push({ id: productId, quantity });
    }
    this.saveCart();
    this.render();

    // Trigger bounce animation on badge
    this.badgeCounters.forEach(badge => {
      badge.classList.remove('scale-125', 'bg-amber-600');
      void badge.offsetWidth;
      badge.classList.add('scale-125', 'bg-amber-600');
      setTimeout(() => badge.classList.remove('scale-125', 'bg-amber-600'), 300);
    });

    const product = PRODUCTS_DATA.find(p => p.id === productId);
    if (window.showToast && product) {
      window.showToast(`"${product.title.substring(0, 32)}..." sepete eklendi!`, 'success');
    }
  }

  updateQuantity(productId, newQty) {
    if (newQty <= 0) {
      this.removeItem(productId);
      return;
    }
    const item = this.items.find(i => i.id === productId);
    if (item) {
      item.quantity = newQty;
      this.saveCart();
      this.render();
    }
  }

  removeItem(productId) {
    const product = PRODUCTS_DATA.find(p => p.id === productId);
    this.items = this.items.filter(i => i.id !== productId);
    this.saveCart();
    this.render();
    if (window.showToast && product) {
      window.showToast(`Ürün sepetten kaldırıldı.`, 'info');
    }
  }

  clearCart() {
    this.items = [];
    this.saveCart();
    this.render();
  }

  handleApplyCoupon() {
    const code = (this.couponInput?.value || '').trim().toUpperCase();
    if (!code) return;

    if (code === 'DENIZ10') {
      this.appliedCoupon = { code: 'DENIZ10', discountPercent: 10, label: '%10 Deniz Müzik Hoş Geldin İndirimi' };
      if (this.couponMessage) {
        this.couponMessage.textContent = '✅ DENIZ10 kuponu uygulandı: %10 İndirim!';
        this.couponMessage.className = 'text-xs text-emerald-600 font-semibold mt-1';
      }
      if (window.showToast) window.showToast('DENIZ10 kuponu başarıyla uygulandı!', 'success');
    } else if (code === 'MUZIK54') {
      this.appliedCoupon = { code: 'MUZIK54', flatDiscount: 500, label: '500 TL Sakarya Yerel Alışveriş Desteği' };
      if (this.couponMessage) {
        this.couponMessage.textContent = '✅ MUZIK54 kuponu uygulandı: 500 TL İndirim!';
        this.couponMessage.className = 'text-xs text-emerald-600 font-semibold mt-1';
      }
      if (window.showToast) window.showToast('MUZIK54 kuponu uygulandı!', 'success');
    } else {
      if (this.couponMessage) {
        this.couponMessage.textContent = '❌ Geçersiz kupon kodu. (İpucu: DENIZ10 veya MUZIK54)';
        this.couponMessage.className = 'text-xs text-red-600 font-medium mt-1';
      }
      return;
    }
    this.render();
  }

  getCartDetailed() {
    return this.items.map(item => {
      const product = PRODUCTS_DATA.find(p => p.id === item.id);
      return {
        ...item,
        product
      };
    }).filter(item => item.product !== undefined);
  }

  calculateTotals() {
    const detailed = this.getCartDetailed();
    const subtotal = detailed.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    
    // Free shipping check (PTT Kargo 2000 TL)
    const isFreeShipping = subtotal >= this.freeShippingThreshold || subtotal === 0;
    const shipping = isFreeShipping ? 0 : this.standardShippingCost;
    const remainingForFreeShipping = Math.max(0, this.freeShippingThreshold - subtotal);
    const shippingProgress = Math.min(100, Math.round((subtotal / this.freeShippingThreshold) * 100));

    // Cash discount (%5)
    let cashDiscount = 0;
    if (this.paymentMethod === 'cash') {
      cashDiscount = Math.round(subtotal * 0.05);
    }

    // Coupon discount
    let couponDiscount = 0;
    if (this.appliedCoupon) {
      if (this.appliedCoupon.discountPercent) {
        couponDiscount = Math.round((subtotal - cashDiscount) * (this.appliedCoupon.discountPercent / 100));
      } else if (this.appliedCoupon.flatDiscount) {
        couponDiscount = Math.min(subtotal, this.appliedCoupon.flatDiscount);
      }
    }

    const grandTotal = Math.max(0, subtotal - cashDiscount - couponDiscount + shipping);

    return {
      subtotal,
      shipping,
      isFreeShipping,
      remainingForFreeShipping,
      shippingProgress,
      cashDiscount,
      couponDiscount,
      grandTotal,
      itemCount: this.items.reduce((sum, i) => sum + i.quantity, 0)
    };
  }

  getCheckoutSummary() {
    const totals = this.calculateTotals();
    const items = this.getCartDetailed();
    return {
      items,
      paymentMethod: this.paymentMethod,
      appliedCoupon: this.appliedCoupon,
      ...totals
    };
  }

  render() {
    const detailed = this.getCartDetailed();
    const totals = this.calculateTotals();

    // Update Badges
    this.badgeCounters.forEach(badge => {
      badge.textContent = totals.itemCount;
      if (totals.itemCount > 0) {
        badge.classList.remove('hidden');
      } else {
        badge.classList.add('hidden');
      }
    });

    // Update Free Shipping Progress Bar
    if (this.shippingProgressFill && this.shippingMessageEl) {
      this.shippingProgressFill.style.width = `${totals.shippingProgress}%`;
      
      if (totals.subtotal === 0) {
        this.shippingMessageEl.innerHTML = `<span>🚚 <strong>2.000 TL</strong> üzeri siparişlerde PTT Kargo ÜCRETSİZ!</span>`;
        this.shippingProgressFill.className = 'h-2 rounded-full transition-all duration-500 bg-amber-700';
      } else if (totals.isFreeShipping) {
        this.shippingMessageEl.innerHTML = `<span class="text-emerald-700 font-semibold flex items-center gap-1.5"><svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> Harika! <strong>PTT Kargo ÜCRETSİZ</strong> fırsatını yakaladınız! 🎉</span>`;
        this.shippingProgressFill.className = 'h-2 rounded-full transition-all duration-500 bg-emerald-700';
      } else {
        this.shippingMessageEl.innerHTML = `<span>Ücretsiz Kargo için <strong>${formatTL(totals.remainingForFreeShipping)}</strong> daha ürün ekleyin!</span>`;
        this.shippingProgressFill.className = 'h-2 rounded-full transition-all duration-500 bg-amber-700';
      }
    }

    // Render Items List
    if (this.cartItemsContainer) {
      if (detailed.length === 0) {
        this.cartItemsContainer.innerHTML = `
          <div class="py-16 text-center text-stone-500">
            <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <p class="font-medium text-stone-700 text-lg mb-1">Sepetiniz Boş</p>
            <p class="text-xs text-stone-400 max-w-xs mx-auto mb-6">Deniz Müzik seçkin enstrüman koleksiyonunu keşfetmeye hemen başlayın.</p>
            <button onclick="window.cartManager.closeDrawer()" class="px-5 py-2.5 bg-stone-900 text-cream-50 hover:bg-stone-800 text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors shadow-sm">
              Alışverişe Başla
            </button>
          </div>
        `;
      } else {
        this.cartItemsContainer.innerHTML = detailed.map(item => `
          <div class="flex gap-4 py-4 border-b border-stone-200/80 items-start group">
            <img src="${item.product.image}" alt="${item.product.title}" class="w-20 h-20 object-cover rounded-md border border-stone-200 bg-stone-100 flex-shrink-0" />
            <div class="flex-1 min-w-0">
              <div class="flex justify-between items-start">
                <span class="text-[11px] font-semibold text-amber-700 tracking-wider uppercase">${item.product.brand}</span>
                <button onclick="window.cartManager.removeItem('${item.product.id}')" class="text-stone-400 hover:text-red-500 transition-colors p-1" title="Ürünü Sil">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
              <h4 class="text-xs font-semibold text-stone-900 truncate mt-0.5" title="${item.product.title}">${item.product.title}</h4>
              <div class="mt-2 flex items-center justify-between">
                <!-- Quantity selector -->
                <div class="flex items-center border border-stone-300 rounded bg-white overflow-hidden shadow-2xs">
                  <button onclick="window.cartManager.updateQuantity('${item.product.id}', ${item.quantity - 1})" class="px-2 py-0.5 text-stone-600 hover:bg-stone-100 transition-colors text-sm font-semibold">−</button>
                  <span class="px-2.5 py-0.5 text-xs font-bold text-stone-800 min-w-[20px] text-center">${item.quantity}</span>
                  <button onclick="window.cartManager.updateQuantity('${item.product.id}', ${item.quantity + 1})" class="px-2 py-0.5 text-stone-600 hover:bg-stone-100 transition-colors text-sm font-semibold">+</button>
                </div>
                <!-- Price -->
                <div class="text-right">
                  <span class="text-xs font-bold text-stone-900">${formatTL(item.product.price * item.quantity)}</span>
                  ${item.quantity > 1 ? `<div class="text-[10px] text-stone-400 font-normal">Birim: ${formatTL(item.product.price)}</div>` : ''}
                </div>
              </div>
            </div>
          </div>
        `).join('');
      }
    }

    // Update Summary Row Numbers
    if (this.subtotalEl) this.subtotalEl.textContent = formatTL(totals.subtotal);
    if (this.shippingEl) {
      this.shippingEl.innerHTML = totals.shipping === 0 
        ? `<span class="text-emerald-700 font-semibold">ÜCRETSİZ (PTT)</span>` 
        : formatTL(totals.shipping);
    }

    // Cash discount row toggle
    if (this.cashDiscountRow && this.cashDiscountEl) {
      if (totals.cashDiscount > 0) {
        this.cashDiscountRow.classList.remove('hidden');
        this.cashDiscountEl.textContent = `-${formatTL(totals.cashDiscount)}`;
      } else {
        this.cashDiscountRow.classList.add('hidden');
      }
    }

    // Coupon discount row toggle
    if (this.couponDiscountRow && this.couponDiscountEl) {
      if (totals.couponDiscount > 0) {
        this.couponDiscountRow.classList.remove('hidden');
        this.couponDiscountEl.textContent = `-${formatTL(totals.couponDiscount)}`;
      } else {
        this.couponDiscountRow.classList.add('hidden');
      }
    }

    if (this.totalEl) this.totalEl.textContent = formatTL(totals.grandTotal);
  }

  openDrawer() {
    this.render();
    if (this.drawer && this.overlay) {
      this.drawer.classList.remove('translate-x-full');
      this.overlay.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    }
  }

  closeDrawer() {
    if (this.drawer && this.overlay) {
      this.drawer.classList.add('translate-x-full');
      this.overlay.classList.add('hidden');
      document.body.style.overflow = '';
    }
  }

  isDrawerOpen() {
    return this.drawer && !this.drawer.classList.contains('translate-x-full');
  }
}

window.cartManager = new CartManager();
