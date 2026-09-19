/**
 * Deniz Müzik - PayTR Güvenli Ödeme & PTT Kargo Checkout Simülasyonu
 * Peşin Fiyatına 3 Taksit, 256-bit SSL, 3D Secure Doğrulama ve Sipariş Takip
 */

class CheckoutManager {
  constructor() {
    this.currentStep = 1;
    this.summaryData = null;
    this.orderId = null;
    this.pttTrackingId = null;
    this.smsTimer = null;
    this.initElements();
  }

  initElements() {
    this.modal = document.getElementById('checkoutModal');
    this.overlay = document.getElementById('checkoutOverlay');
    this.closeBtn = document.getElementById('closeCheckoutBtn');

    // Step containers
    this.step1 = document.getElementById('checkoutStep1');
    this.step2 = document.getElementById('checkoutStep2');
    this.step3 = document.getElementById('checkoutStep3');
    this.step4 = document.getElementById('checkoutStep4');

    // Step indicators
    this.stepIndicators = document.querySelectorAll('.checkout-step-indicator');

    // Step buttons
    this.toStep2Btn = document.getElementById('toStep2Btn');
    this.backToStep1Btn = document.getElementById('backToStep1Btn');
    this.payWithPayTRBtn = document.getElementById('payWithPayTRBtn');
    this.confirmSmsBtn = document.getElementById('confirmSmsBtn');
    this.resendSmsBtn = document.getElementById('resendSmsBtn');
    this.finishOrderBtn = document.getElementById('finishOrderBtn');
    this.printInvoiceBtn = document.getElementById('printInvoiceBtn');

    // Inputs
    this.cardNumberInput = document.getElementById('paytrCardNumber');
    this.cardExpiryInput = document.getElementById('paytrCardExpiry');
    this.cardCvvInput = document.getElementById('paytrCardCvv');
    this.installmentsContainer = document.getElementById('paytrInstallmentsList');

    // Bind event listeners
    if (this.closeBtn) this.closeBtn.addEventListener('click', () => this.closeCheckout());
    if (this.overlay) this.overlay.addEventListener('click', () => this.closeCheckout());

    if (this.toStep2Btn) this.toStep2Btn.addEventListener('click', () => this.validateAndGoToStep2());
    if (this.backToStep1Btn) this.backToStep1Btn.addEventListener('click', () => this.setStep(1));
    if (this.payWithPayTRBtn) this.payWithPayTRBtn.addEventListener('click', () => this.simulatePayTRPayment());
    if (this.confirmSmsBtn) this.confirmSmsBtn.addEventListener('click', () => this.complete3DSecure());
    if (this.finishOrderBtn) this.finishOrderBtn.addEventListener('click', () => this.closeCheckout());
    if (this.printInvoiceBtn) this.printInvoiceBtn.addEventListener('click', () => window.print());

    // Card formatters
    if (this.cardNumberInput) {
      this.cardNumberInput.addEventListener('input', (e) => {
        let val = e.target.value.replace(/\D/g, '').substring(0, 16);
        val = val.replace(/(\d{4})(?=\d)/g, '$1 ');
        e.target.value = val;
      });
    }

    if (this.cardExpiryInput) {
      this.cardExpiryInput.addEventListener('input', (e) => {
        let val = e.target.value.replace(/\D/g, '').substring(0, 4);
        if (val.length >= 2) {
          val = val.substring(0, 2) + '/' + val.substring(2);
        }
        e.target.value = val;
      });
    }

    if (this.cardCvvInput) {
      this.cardCvvInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '').substring(0, 3);
      });
    }
  }

  openCheckout(summaryData) {
    this.summaryData = summaryData;
    this.setStep(1);
    this.updateOrderMiniSummary();
    if (this.modal && this.overlay) {
      this.modal.classList.remove('hidden');
      this.overlay.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    }
  }

  closeCheckout() {
    if (this.modal && this.overlay) {
      this.modal.classList.add('hidden');
      this.overlay.classList.add('hidden');
      document.body.style.overflow = '';
      clearInterval(this.smsTimer);
    }
  }

  setStep(stepNumber) {
    this.currentStep = stepNumber;
    [this.step1, this.step2, this.step3, this.step4].forEach((s, idx) => {
      if (s) {
        if (idx + 1 === stepNumber) {
          s.classList.remove('hidden');
        } else {
          s.classList.add('hidden');
        }
      }
    });

    // Update step badges
    this.stepIndicators.forEach((ind, idx) => {
      const stepIdx = idx + 1;
      if (stepIdx < stepNumber) {
        ind.className = 'checkout-step-indicator flex items-center gap-1.5 text-xs font-semibold text-emerald-600';
        ind.innerHTML = `<span class="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px]">✓</span> Adım ${stepIdx}`;
      } else if (stepIdx === stepNumber) {
        ind.className = 'checkout-step-indicator flex items-center gap-1.5 text-xs font-bold text-stone-900 border-b-2 border-stone-900 pb-1';
        ind.innerHTML = `<span class="w-5 h-5 rounded-full bg-stone-900 text-cream-50 flex items-center justify-center text-[10px]">${stepIdx}</span> Adım ${stepIdx}`;
      } else {
        ind.className = 'checkout-step-indicator flex items-center gap-1.5 text-xs font-medium text-stone-400';
        ind.innerHTML = `<span class="w-5 h-5 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center text-[10px]">${stepIdx}</span> Adım ${stepIdx}`;
      }
    });
  }

  updateOrderMiniSummary() {
    if (!this.summaryData) return;
    const miniContainer = document.getElementById('checkoutMiniSummary');
    if (miniContainer) {
      miniContainer.innerHTML = `
        <div class="bg-stone-50 p-4 rounded-xl border border-stone-200/80 mb-6">
          <div class="flex justify-between items-center mb-2 pb-2 border-b border-stone-200">
            <span class="text-xs text-stone-500 font-medium">Toplam Ürün Adedi:</span>
            <span class="text-xs font-bold text-stone-800">${this.summaryData.itemCount} Enstrüman / Ürün</span>
          </div>
          <div class="flex justify-between items-center mb-1 text-xs">
            <span class="text-stone-500">Ara Toplam:</span>
            <span class="font-semibold text-stone-800">${formatTL(this.summaryData.subtotal)}</span>
          </div>
          ${this.summaryData.cashDiscount > 0 ? `
          <div class="flex justify-between items-center mb-1 text-xs text-emerald-700 font-semibold">
            <span>Peşin / Havale İndirimi (%5):</span>
            <span>-${formatTL(this.summaryData.cashDiscount)}</span>
          </div>` : ''}
          ${this.summaryData.couponDiscount > 0 ? `
          <div class="flex justify-between items-center mb-1 text-xs text-amber-700 font-semibold">
            <span>Kupon İndirimi:</span>
            <span>-${formatTL(this.summaryData.couponDiscount)}</span>
          </div>` : ''}
          <div class="flex justify-between items-center mb-2 text-xs">
            <span class="text-stone-500">PTT Kargo:</span>
            <span class="font-semibold ${this.summaryData.isFreeShipping ? 'text-emerald-700' : 'text-stone-800'}">
              ${this.summaryData.isFreeShipping ? 'ÜCRETSİZ' : formatTL(this.summaryData.shipping)}
            </span>
          </div>
          <div class="flex justify-between items-center pt-2 border-t border-stone-200">
            <span class="text-sm font-bold text-stone-900">Ödenecek Tutar:</span>
            <span class="text-base font-extrabold text-stone-900">${formatTL(this.summaryData.grandTotal)}</span>
          </div>
        </div>
      `;
    }

    // Render Installments Options Table for PayTR
    this.renderInstallmentTable(this.summaryData.grandTotal);
  }

  renderInstallmentTable(total) {
    if (!this.installmentsContainer) return;
    const cashPriceWith5Off = Math.round(total * 0.95);
    const installment3 = Math.round(total / 3);
    const installment2 = Math.round(total / 2);
    const installment6 = Math.round((total * 1.05) / 6); // slight interest on 6

    this.installmentsContainer.innerHTML = `
      <label class="flex items-center justify-between p-3 rounded-lg border border-stone-200 hover:border-stone-900 cursor-pointer transition-colors bg-white">
        <div class="flex items-center gap-3">
          <input type="radio" name="paytrInstallment" value="1" checked class="w-4 h-4 text-stone-900 focus:ring-stone-900" />
          <div>
            <span class="text-xs font-bold text-stone-900">Tek Çekim (Peşin)</span>
            <span class="ml-2 inline-block px-1.5 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-900 rounded">%5 Anında İndirim</span>
          </div>
        </div>
        <div class="text-right">
          <span class="text-xs font-bold text-emerald-700">${formatTL(cashPriceWith5Off)}</span>
          <div class="text-[10px] text-stone-400 line-through">${formatTL(total)}</div>
        </div>
      </label>

      <label class="flex items-center justify-between p-3 rounded-lg border-2 border-stone-900 bg-stone-50/60 cursor-pointer relative">
        <div class="absolute -top-2.5 right-3 bg-stone-900 text-cream-50 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-2xs">
          ⭐ Deniz Müzik Özel Kampanyası
        </div>
        <div class="flex items-center gap-3">
          <input type="radio" name="paytrInstallment" value="3" class="w-4 h-4 text-stone-900 focus:ring-stone-900" />
          <div>
            <span class="text-xs font-bold text-stone-900">3 Taksit (Peşin Fiyatına)</span>
            <div class="text-[10px] text-stone-500 font-medium">Tüm Bonus, World, Maximum, Axess, Paraf kartlara</div>
          </div>
        </div>
        <div class="text-right">
          <span class="text-xs font-bold text-stone-900">3 x ${formatTL(installment3)}</span>
          <div class="text-[10px] text-stone-500">Toplam: ${formatTL(total)} (Vade Farksız)</div>
        </div>
      </label>

      <label class="flex items-center justify-between p-3 rounded-lg border border-stone-200 hover:border-stone-900 cursor-pointer transition-colors bg-white">
        <div class="flex items-center gap-3">
          <input type="radio" name="paytrInstallment" value="2" class="w-4 h-4 text-stone-900 focus:ring-stone-900" />
          <div>
            <span class="text-xs font-bold text-stone-900">2 Taksit (Peşin Fiyatına)</span>
          </div>
        </div>
        <div class="text-right">
          <span class="text-xs font-bold text-stone-900">2 x ${formatTL(installment2)}</span>
          <div class="text-[10px] text-stone-500">Toplam: ${formatTL(total)}</div>
        </div>
      </label>

      <label class="flex items-center justify-between p-3 rounded-lg border border-stone-200 hover:border-stone-900 cursor-pointer transition-colors bg-white">
        <div class="flex items-center gap-3">
          <input type="radio" name="paytrInstallment" value="6" class="w-4 h-4 text-stone-900 focus:ring-stone-900" />
          <div>
            <span class="text-xs font-bold text-stone-900">6 Taksit</span>
          </div>
        </div>
        <div class="text-right">
          <span class="text-xs font-bold text-stone-900">6 x ${formatTL(installment6)}</span>
          <div class="text-[10px] text-stone-500">Toplam: ${formatTL(Math.round(total * 1.05))}</div>
        </div>
      </label>
    `;
  }

  validateAndGoToStep2() {
    const name = document.getElementById('checkoutFullName')?.value.trim();
    const phone = document.getElementById('checkoutPhone')?.value.trim();
    const address = document.getElementById('checkoutAddress')?.value.trim();

    if (!name || !phone || !address) {
      if (window.showToast) window.showToast("Lütfen Ad Soyad, Telefon ve Adres alanlarını doldurunuz.", "warning");
      return;
    }

    this.customerData = {
      name,
      phone,
      address,
      city: document.getElementById('checkoutCity')?.value || 'Sakarya',
      district: document.getElementById('checkoutDistrict')?.value || 'Arifiye',
      note: document.getElementById('checkoutNote')?.value || ''
    };

    this.setStep(2);
  }

  simulatePayTRPayment() {
    const cardNum = this.cardNumberInput?.value.replace(/\s/g, '');
    const cardExpiry = this.cardExpiryInput?.value.trim();
    const cardCvv = this.cardCvvInput?.value.trim();

    if (!cardNum || cardNum.length < 16) {
      if (window.showToast) window.showToast("Lütfen geçerli 16 haneli kredi kartı numaranızı giriniz.", "warning");
      return;
    }
    if (!cardExpiry || cardExpiry.length < 5) {
      if (window.showToast) window.showToast("Lütfen kart son kullanma tarihini (AA/YY) giriniz.", "warning");
      return;
    }
    if (!cardCvv || cardCvv.length < 3) {
      if (window.showToast) window.showToast("Lütfen 3 haneli CVV güvenlik kodunu giriniz.", "warning");
      return;
    }

    // Launch 3D Secure SMS Verification simulation
    this.start3DSecure();
  }

  start3DSecure() {
    this.setStep(3);
    const maskedPhone = this.customerData?.phone 
      ? this.customerData.phone.replace(/(\d{4})\d{3}(\d{4})/, '$1***$2')
      : '0552***8454';
    
    const phoneNotice = document.getElementById('smsPhoneNotice');
    if (phoneNotice) {
      phoneNotice.textContent = `${maskedPhone} nolu telefonunuza 6 haneli PayTR 3D Secure doğrulama kodu gönderildi.`;
    }

    // Auto-fill a demo SMS code after 1.5 seconds for delight
    const smsInput = document.getElementById('smsCodeInput');
    if (smsInput) {
      smsInput.value = '';
      setTimeout(() => {
        smsInput.value = '548912';
        if (window.showToast) window.showToast("📱 PayTR 3D Secure Şifreniz: 548912 (Otomatik dolduruldu)", "info");
      }, 1200);
    }

    // Start 180s countdown timer
    let secondsLeft = 180;
    const timerDisplay = document.getElementById('smsTimerDisplay');
    clearInterval(this.smsTimer);
    this.smsTimer = setInterval(() => {
      secondsLeft--;
      const min = Math.floor(secondsLeft / 60);
      const sec = secondsLeft % 60;
      if (timerDisplay) {
        timerDisplay.textContent = `${min}:${sec < 10 ? '0' : ''}${sec}`;
      }
      if (secondsLeft <= 0) {
        clearInterval(this.smsTimer);
      }
    }, 1000);
  }

  complete3DSecure() {
    clearInterval(this.smsTimer);

    // Generate simulated Order ID & PTT Tracking
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    this.orderId = `DNZ-2026-${randomNum}`;
    this.pttTrackingId = `PTT-54${randomNum}TR`;

    // Clear user cart
    if (window.cartManager) {
      window.cartManager.clearCart();
    }

    // Render Confirmation Step
    const orderNoEl = document.getElementById('confirmedOrderNo');
    const pttTrackingEl = document.getElementById('confirmedPttTracking');
    const confirmedNameEl = document.getElementById('confirmedCustomerName');
    const confirmedAddressEl = document.getElementById('confirmedCustomerAddress');
    const confirmedTotalEl = document.getElementById('confirmedGrandTotal');

    if (orderNoEl) orderNoEl.textContent = this.orderId;
    if (pttTrackingEl) pttTrackingEl.textContent = this.pttTrackingId;
    if (confirmedNameEl) confirmedNameEl.textContent = this.customerData?.name || 'Müşteri';
    if (confirmedAddressEl) {
      confirmedAddressEl.textContent = `${this.customerData?.address}, ${this.customerData?.district} / ${this.customerData?.city}`;
    }
    if (confirmedTotalEl && this.summaryData) {
      confirmedTotalEl.textContent = formatTL(this.summaryData.grandTotal);
    }

    this.setStep(4);
    if (window.showToast) window.showToast("🎉 Siparişiniz başarıyla alındı! PTT Kargo ile yola çıkmaya hazırlanıyor.", "success");
  }
}

window.checkoutManager = new CheckoutManager();
