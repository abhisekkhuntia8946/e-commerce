/* ==========================================================================
   TechHub Store - Core Application Logic (app.js)
   ========================================================================== */

class StoreApp {
  constructor() {
    this.products = PRODUCTS || [];
    this.filteredProducts = [...this.products];
    
    // Persistent States
    this.cart = JSON.parse(localStorage.getItem('techhub_cart')) || [];
    this.wishlist = JSON.parse(localStorage.getItem('techhub_wishlist')) || [];
    this.theme = localStorage.getItem('techhub_theme') || 'light';
    this.currentUser = JSON.parse(localStorage.getItem('techhub_user')) || null;
    this.orders = JSON.parse(localStorage.getItem('techhub_orders')) || [
      {
        orderId: "TH-IN-984210",
        date: "08 Aug 2026",
        itemsCount: 2,
        total: 164899,
        paymentMode: "UPI / QR Code",
        status: "Delivered Today"
      }
    ];
    
    // Filter States
    this.activeCategory = 'All';
    this.activeBrand = 'All';
    this.maxPrice = 200000;
    this.searchQuery = '';
    this.sortBy = 'featured';
    
    // Promo State
    this.appliedDiscount = 0; // percentage
    this.promoCode = '';

    // Initialize Application
    this.init();
  }

  /* Currency Formatter for Indian Rupees (₹) */
  formatINR(amount) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  }

  init() {
    // 1. Apply Initial Theme
    this.applyTheme(this.theme);

    // 2. Render Initial Categories & Brands Sidebar & Products
    this.renderCategories();
    this.renderBrands();
    this.filterAndRenderProducts();

    // 3. Update Cart, Wishlist & User Auth UI
    this.updateCartUI();
    this.updateWishlistUI();
    this.updateAuthUI();

    // 4. Attach Event Listeners
    this.attachEventListeners();

    // 5. Start Flash Sale Timer & Time to Buy Ticker
    this.startFlashSaleTimer();
    this.startTimeToBuyTicker();
  }

  /* ==========================================================================
     Theme Switcher Logic
     ========================================================================== */
  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('techhub_theme', theme);
    this.theme = theme;
    
    const themeIcon = document.getElementById('theme-icon');
    if (themeIcon) {
      themeIcon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    }
  }

  toggleTheme() {
    const newTheme = this.theme === 'light' ? 'dark' : 'light';
    this.applyTheme(newTheme);
    this.showToast(`Switched to ${newTheme.toUpperCase()} theme mode!`);
  }

  /* ==========================================================================
     Catalog Rendering & Filtering Logic
     ========================================================================== */
  renderCategories() {
    const categoryList = document.getElementById('category-filter-list');
    if (!categoryList) return;

    // Get unique categories and count
    const categoriesMap = { 'All': this.products.length };
    this.products.forEach(p => {
      categoriesMap[p.category] = (categoriesMap[p.category] || 0) + 1;
    });

    categoryList.innerHTML = Object.entries(categoriesMap).map(([cat, count]) => `
      <li>
        <button class="category-btn ${this.activeCategory === cat ? 'active' : ''}" 
                onclick="app.filterByCategory('${cat}')">
          <span>${cat}</span>
          <span class="count">${count}</span>
        </button>
      </li>
    `).join('');
  }

  renderBrands() {
    const container = document.getElementById('brand-filter-list');
    if (!container) return;

    const brandsSet = new Set(this.products.map(p => p.brand).filter(Boolean));
    const brands = ['All', ...Array.from(brandsSet)];

    container.innerHTML = brands.map(b => `
      <button class="brand-btn ${this.activeBrand === b ? 'active' : ''}" onclick="app.filterByBrand('${b}')">
        ${b}
      </button>
    `).join('');
  }

  filterByBrand(brand) {
    this.activeBrand = brand;
    this.renderBrands();
    this.filterAndRenderProducts();
  }

  filterAndRenderProducts() {
    let result = [...this.products];

    // Filter Category
    if (this.activeCategory !== 'All') {
      result = result.filter(p => p.category === this.activeCategory);
    }

    // Filter Brand
    if (this.activeBrand !== 'All') {
      result = result.filter(p => p.brand === this.activeBrand);
    }

    // Filter Price
    result = result.filter(p => p.price <= this.maxPrice);

    // Filter Search Query
    if (this.searchQuery.trim() !== '') {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.category.toLowerCase().includes(q) ||
        (p.brand && p.brand.toLowerCase().includes(q)) ||
        p.description.toLowerCase().includes(q)
      );
    }

    // Sort Products
    if (this.sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (this.sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (this.sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    this.filteredProducts = result;
    this.renderProductsGrid(result);
  }

  renderProductsGrid(products) {
    const grid = document.getElementById('products-grid');
    const countLabel = document.getElementById('visible-products-count');
    if (!grid) return;

    if (countLabel) countLabel.innerText = products.length;

    if (products.length === 0) {
      grid.innerHTML = `
        <div class="no-products">
          <i class="fa-solid fa-box-open"></i>
          <h3>No matching products found</h3>
          <p style="color: var(--text-muted); margin-top: 6px;">Try adjusting your search query or price slider threshold.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = products.map(product => {
      const isSaved = this.wishlist.includes(product.id);
      const isFreeDelivery = product.price >= 500;
      const discountPercent = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

      return `
        <div class="product-card">
          ${product.badge ? `<span class="product-badge ${product.badge.toLowerCase()}">${product.badge}</span>` : ''}
          
          <button class="wishlist-toggle-btn ${isSaved ? 'active' : ''}" 
                  onclick="app.toggleWishlist(${product.id})" 
                  title="${isSaved ? 'Remove from Wishlist' : 'Add to Wishlist'}">
            <i class="${isSaved ? 'fa-solid fa-heart' : 'fa-regular fa-heart'}"></i>
          </button>

          <div class="product-img-wrapper" onclick="app.quickViewProduct(${product.id})">
            <img src="${product.image}" alt="${product.name}" loading="lazy">
            <button class="quick-view-btn" onclick="event.stopPropagation(); app.quickViewProduct(${product.id})">
              <i class="fa-solid fa-eye"></i> Quick View
            </button>
          </div>

          <div class="product-category">${product.category}</div>
          <h3 class="product-title" title="${product.name}" onclick="app.quickViewProduct(${product.id})">${product.name}</h3>

          <div class="product-rating">
            <div class="stars">
              ${'<i class="fa-solid fa-star"></i>'.repeat(Math.floor(product.rating))}
              ${product.rating % 1 !== 0 ? '<i class="fa-solid fa-star-half-stroke"></i>' : ''}
            </div>
            <span class="rating-count">(${product.reviewsCount})</span>
            ${isFreeDelivery ? `<span class="free-shipping-tag"><i class="fa-solid fa-truck-fast"></i> FREE Delivery</span>` : ''}
          </div>

          ${product.emiStarting ? `
            <div style="margin-bottom: 8px;">
              <span class="emi-badge"><i class="fa-solid fa-credit-card"></i> No-Cost EMI from ${this.formatINR(product.emiStarting)}/mo</span>
            </div>
          ` : ''}

          <!-- Time to Buy Urgency Badge -->
          <div class="time-to-buy-badge">
            <i class="fa-solid fa-clock"></i>
            <span>Order in <strong class="time-to-buy-clock">02h 45m 00s</strong> for Next-Day Delivery</span>
          </div>

          <!-- Product Delivery Reach Date Badge -->
          <div class="card-delivery-date">
            <i class="fa-solid fa-truck-fast"></i> Get it by <strong>${this.getShortDeliveryDate(2)}</strong>
          </div>

          <div class="product-footer">
            <div class="price-box">
              <span class="current-price">${this.formatINR(product.price)}</span>
              ${product.originalPrice ? `
                <div style="display: flex; gap: 6px; align-items: center;">
                  <span class="original-price">${this.formatINR(product.originalPrice)}</span>
                  <span style="color: var(--success-green); font-size: 0.78rem; font-weight: 800;">${discountPercent}% OFF</span>
                </div>
              ` : ''}
            </div>
            <div class="product-action-btns">
              <button class="add-cart-btn" onclick="app.addToCart(${product.id})" title="Add to Cart">
                <i class="fa-solid fa-plus"></i> Add
              </button>
              <button class="buy-now-btn" onclick="app.buyNow(${product.id})" title="Buy Now Instant Checkout">
                <i class="fa-solid fa-bolt"></i> Buy Now
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  /* ==========================================================================
     Live Search Dropdown & Synchronized Catalog Filter
     ========================================================================== */
  handleLiveSearch(query, source = 'header') {
    this.searchQuery = query;

    const headerInput = document.getElementById('live-search-input');
    const sidebarInput = document.getElementById('sidebar-search-input');
    const headerClear = document.getElementById('header-search-clear');
    const sidebarClear = document.getElementById('sidebar-search-clear');
    const activeSearchPill = document.getElementById('active-search-pill');
    const activeSearchText = document.getElementById('active-search-query-text');

    if (source === 'header' && sidebarInput) {
      sidebarInput.value = query;
    } else if (source === 'sidebar' && headerInput) {
      headerInput.value = query;
    }

    const hasQuery = query.trim().length > 0;
    if (headerClear) headerClear.style.display = hasQuery ? 'flex' : 'none';
    if (sidebarClear) sidebarClear.style.display = hasQuery ? 'flex' : 'none';

    if (activeSearchPill && activeSearchText) {
      if (hasQuery) {
        activeSearchText.innerText = query;
        activeSearchPill.style.display = 'inline-flex';
      } else {
        activeSearchPill.style.display = 'none';
      }
    }

    const dropdown = document.getElementById('search-dropdown-results');
    if (dropdown) {
      if (!hasQuery) {
        dropdown.classList.remove('active');
      } else {
        const matches = this.products.filter(p => 
          p.name.toLowerCase().includes(query.toLowerCase()) || 
          p.category.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 5);

        if (matches.length === 0) {
          dropdown.innerHTML = `<div style="padding: 16px; text-align: center; color: var(--text-muted); font-size: 0.9rem;">No products matching "${query}"</div>`;
        } else {
          dropdown.innerHTML = matches.map(p => `
            <div class="search-dropdown-item" onclick="app.quickViewProduct(${p.id}); document.getElementById('search-dropdown-results').classList.remove('active');">
              <img src="${p.image}" alt="${p.name}">
              <div class="search-dropdown-info">
                <div class="title">${p.name}</div>
                <div class="price">${this.formatINR(p.price)} ${p.price >= 500 ? '<span style="color: var(--success-green); font-size: 0.75rem; margin-left: 6px;">(FREE Delivery)</span>' : ''}</div>
              </div>
            </div>
          `).join('');
        }
        dropdown.classList.add('active');
      }
    }

    this.filterAndRenderProducts();
  }

  clearSearch() {
    this.searchQuery = '';
    const headerInput = document.getElementById('live-search-input');
    const sidebarInput = document.getElementById('sidebar-search-input');
    const headerClear = document.getElementById('header-search-clear');
    const sidebarClear = document.getElementById('sidebar-search-clear');
    const activeSearchPill = document.getElementById('active-search-pill');

    if (headerInput) headerInput.value = '';
    if (sidebarInput) sidebarInput.value = '';
    if (headerClear) headerClear.style.display = 'none';
    if (sidebarClear) sidebarClear.style.display = 'none';
    if (activeSearchPill) activeSearchPill.style.display = 'none';

    document.getElementById('search-dropdown-results')?.classList.remove('active');
    this.filterAndRenderProducts();
  }

  /* ==========================================================================
     Cart & Buy Now State Management
     ========================================================================== */
  buyNow(productId) {
    const product = this.products.find(p => p.id === productId);
    if (!product) return;

    const existingIndex = this.cart.findIndex(item => item.productId === productId);
    if (existingIndex > -1) {
      this.cart[existingIndex].quantity += 1;
    } else {
      this.cart.push({ productId, quantity: 1 });
    }

    this.saveCartState();
    this.updateCartUI();
    this.showToast(`Proceeding to Buy Now checkout for "${product.name}"!`, 'success');
    this.startCheckout();
  }

  addToCart(productId, qty = 1) {
    const product = this.products.find(p => p.id === productId);
    if (!product) return;

    const existingIndex = this.cart.findIndex(item => item.productId === productId);
    if (existingIndex > -1) {
      this.cart[existingIndex].quantity += qty;
    } else {
      this.cart.push({ productId, quantity: qty });
    }

    this.saveCartState();
    this.updateCartUI();
    this.showToast(`Added "${product.name}" to cart!`, 'success');
  }

  updateCartQuantity(productId, delta) {
    const itemIndex = this.cart.findIndex(item => item.productId === productId);
    if (itemIndex > -1) {
      this.cart[itemIndex].quantity += delta;
      if (this.cart[itemIndex].quantity <= 0) {
        this.cart.splice(itemIndex, 1);
      }
    }
    this.saveCartState();
    this.updateCartUI();
  }

  removeFromCart(productId) {
    this.cart = this.cart.filter(item => item.productId !== productId);
    this.saveCartState();
    this.updateCartUI();
    this.showToast('Item removed from cart');
  }

  saveCartState() {
    localStorage.setItem('techhub_cart', JSON.stringify(this.cart));
  }

  updateCartUI() {
    const badgeCount = document.getElementById('cart-badge-count');
    const totalItems = this.cart.reduce((acc, item) => acc + item.quantity, 0);
    if (badgeCount) badgeCount.innerText = totalItems;

    const container = document.getElementById('cart-items-container');
    if (!container) return;

    if (this.cart.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 40px 10px;">
          <i class="fa-solid fa-cart-arrow-down" style="font-size: 3rem; color: var(--text-muted); margin-bottom: 14px;"></i>
          <h4>Your cart is empty</h4>
          <p style="font-size: 0.88rem; color: var(--text-muted); margin-top: 6px;">Discover high-performance gadgets in our catalog.</p>
        </div>
      `;
    } else {
      container.innerHTML = this.cart.map(item => {
        const p = this.products.find(prod => prod.id === item.productId);
        if (!p) return '';
        return `
          <div class="cart-item">
            <img src="${p.image}" class="cart-item-img" alt="${p.name}">
            <div class="cart-item-info">
              <div class="cart-item-title">${p.name}</div>
              <div class="cart-item-price">${this.formatINR(p.price * item.quantity)}</div>
              <div class="quantity-controls">
                <button class="qty-btn" onclick="app.updateCartQuantity(${p.id}, -1)">-</button>
                <span class="qty-count">${item.quantity}</span>
                <button class="qty-btn" onclick="app.updateCartQuantity(${p.id}, 1)">+</button>
              </div>
            </div>
            <button class="cart-item-remove" onclick="app.removeFromCart(${p.id})" title="Remove">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        `;
      }).join('');
    }

    // Totals calculation (Free delivery above ₹500)
    const subtotal = this.cart.reduce((acc, item) => {
      const p = this.products.find(prod => prod.id === item.productId);
      return acc + (p ? p.price * item.quantity : 0);
    }, 0);

    const discountAmount = subtotal * (this.appliedDiscount / 100);
    const isFreeShipping = subtotal >= 500;
    const shipping = (isFreeShipping || subtotal === 0) ? 0 : 49.00;
    const grandTotal = subtotal - discountAmount + shipping;

    document.getElementById('cart-subtotal').innerText = `${this.formatINR(subtotal)}`;
    document.getElementById('cart-discount').innerText = `-${this.formatINR(discountAmount)}`;
    
    const shippingElem = document.getElementById('cart-shipping');
    if (shippingElem) {
      if (isFreeShipping && subtotal > 0) {
        shippingElem.innerHTML = `<span style="color: var(--success-green); font-weight: 800;"><i class="fa-solid fa-check-circle"></i> FREE</span>`;
      } else if (subtotal === 0) {
        shippingElem.innerText = '₹0';
      } else {
        shippingElem.innerText = `${this.formatINR(shipping)}`;
      }
    }

    document.getElementById('cart-total').innerText = `${this.formatINR(grandTotal)}`;

    // Free shipping progress bar (₹500 threshold)
    const progressText = document.getElementById('shipping-progress-text');
    const progressBar = document.getElementById('shipping-progress-bar');
    if (progressText && progressBar) {
      if (subtotal >= 500) {
        progressText.innerHTML = `<i class="fa-solid fa-circle-check" style="color: var(--success-green);"></i> <strong>Order above ₹500!</strong> Delivery charge waived (FREE Shipping)!`;
        progressBar.style.width = '100%';
        progressBar.style.background = 'var(--success-green)';
      } else {
        const remaining = 500 - subtotal;
        progressText.innerHTML = `Add <strong>${this.formatINR(remaining)}</strong> more for <strong>FREE Express Shipping</strong> (Orders over ₹500)`;
        progressBar.style.width = `${Math.min((subtotal / 500) * 100, 100)}%`;
        progressBar.style.background = 'var(--accent-gradient)';
      }
    }
  }

  applyPromoCode(code) {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'TECH10') {
      this.appliedDiscount = 10;
      this.promoCode = 'TECH10';
      this.showToast('Promo TECH10 applied: 10% OFF!', 'success');
    } else if (cleanCode === 'SAVE20') {
      this.appliedDiscount = 20;
      this.promoCode = 'SAVE20';
      this.showToast('VIP Coupon SAVE20 applied: 20% OFF!', 'success');
    } else {
      this.showToast('Invalid promo code. Try TECH10 or SAVE20', 'warning');
    }
    this.updateCartUI();
  }

  /* ==========================================================================
     Wishlist State Management
     ========================================================================== */
  toggleWishlist(productId) {
    const index = this.wishlist.indexOf(productId);
    const p = this.products.find(item => item.id === productId);

    if (index > -1) {
      this.wishlist.splice(index, 1);
      this.showToast(`Removed "${p ? p.name : ''}" from Wishlist`);
    } else {
      this.wishlist.push(productId);
      this.showToast(`Saved "${p ? p.name : ''}" to Wishlist!`, 'success');
    }

    localStorage.setItem('techhub_wishlist', JSON.stringify(this.wishlist));
    this.updateWishlistUI();
    this.filterAndRenderProducts(); // Update heart icon states
  }

  updateWishlistUI() {
    const badgeCount = document.getElementById('wishlist-badge-count');
    if (badgeCount) badgeCount.innerText = this.wishlist.length;

    const container = document.getElementById('wishlist-items-container');
    if (!container) return;

    if (this.wishlist.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 40px 10px;">
          <i class="fa-regular fa-heart" style="font-size: 3rem; color: var(--text-muted); margin-bottom: 14px;"></i>
          <h4>Your wishlist is empty</h4>
          <p style="font-size: 0.88rem; color: var(--text-muted); margin-top: 6px;">Click the heart icon on any product to save it here.</p>
        </div>
      `;
    } else {
      container.innerHTML = this.wishlist.map(id => {
        const p = this.products.find(prod => prod.id === id);
        if (!p) return '';
        return `
          <div class="cart-item">
            <img src="${p.image}" class="cart-item-img" alt="${p.name}">
            <div class="cart-item-info">
              <div class="cart-item-title">${p.name}</div>
              <div class="cart-item-price">$${p.price.toFixed(2)}</div>
              <button class="btn-primary" style="padding: 6px 14px; font-size: 0.8rem; margin-top: 6px;" onclick="app.addToCart(${p.id}); app.toggleWishlist(${p.id});">
                Move to Cart
              </button>
            </div>
            <button class="cart-item-remove" onclick="app.toggleWishlist(${p.id})" title="Remove">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
        `;
      }).join('');
    }
  }

  /* ==========================================================================
     Quick View Modal Logic
     ========================================================================== */
  quickViewProduct(productId) {
    const product = this.products.find(p => p.id === productId);
    if (!product) return;

    const modalContent = document.getElementById('quick-view-content');
    const modalBackdrop = document.getElementById('quick-view-modal');
    const isFreeDelivery = product.price >= 500;
    const discountPercent = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

    const imagesList = (product.images && product.images.length > 0) ? product.images : [product.image];
    const reviewsList = (product.reviews && product.reviews.length > 0) ? product.reviews : [
      { id: 999, author: "Verified TechHub Customer", rating: 5, date: "Recently", comment: "Outstanding quality! Super fast delivery and great packaging.", verified: true, helpful: 14, photos: [] }
    ];

    if (modalContent && modalBackdrop) {
      modalContent.innerHTML = `
        <div class="quick-view-container-sequential">
          <!-- 1. TOP: Multi-Photo Image Gallery -->
          <div class="modal-section-card">
            <div class="product-category">${product.category}</div>
            <h2 class="modal-title" style="margin-bottom: 14px;">${product.name}</h2>
            
            <div class="quick-view-media" style="width: 100%; max-height: 420px; text-align: center;">
              <img id="main-quickview-img" src="${imagesList[0]}" alt="${product.name}" style="max-height: 380px; width: auto; object-fit: contain; border-radius: var(--radius-md);">
              ${imagesList.length > 1 ? `
                <div class="gallery-thumbnails-wrapper" style="justify-content: center; margin-top: 14px;">
                  ${imagesList.map((img, idx) => `
                    <button class="gallery-thumb-btn ${idx === 0 ? 'active' : ''}" onclick="app.switchGalleryImage('${img}', this)">
                      <img src="${img}" alt="${product.name} photo ${idx + 1}">
                    </button>
                  `).join('')}
                </div>
              ` : ''}
            </div>
          </div>

          <!-- 2. UNDER IT: Product Price & Offers Banner -->
          <div class="modal-section-card" style="background: linear-gradient(135deg, rgba(59, 130, 246, 0.06) 0%, rgba(16, 185, 129, 0.06) 100%);">
            <div class="modal-section-title">
              <i class="fa-solid fa-indian-rupee-sign" style="color: var(--accent-primary);"></i> Price & Special Offers
            </div>

            <div style="display: flex; align-items: baseline; gap: 12px; margin-bottom: 10px; flex-wrap: wrap;">
              <span style="font-family: var(--font-heading); font-size: 2.2rem; font-weight: 900; color: var(--accent-primary);">${this.formatINR(product.price)}</span>
              ${product.originalPrice ? `
                <span style="font-size: 1.1rem; color: var(--text-muted); text-decoration: line-through;">${this.formatINR(product.originalPrice)}</span>
                <span style="background: var(--success-green); color: #ffffff; padding: 3px 10px; border-radius: var(--radius-full); font-size: 0.82rem; font-weight: 800;">${discountPercent}% OFF</span>
              ` : ''}
            </div>

            ${product.emiStarting ? `
              <div style="margin-bottom: 12px;">
                <span class="emi-badge" style="font-size: 0.85rem; padding: 6px 14px;"><i class="fa-solid fa-credit-card"></i> No-Cost EMI starting from ${this.formatINR(product.emiStarting)}/mo</span>
              </div>
            ` : ''}

            ${isFreeDelivery ? `
              <div class="shipping-waived-highlight" style="margin-bottom: 12px;">
                <i class="fa-solid fa-truck-fast"></i> Order eligible for FREE Express Next-Day Delivery! (Above ₹500)
              </div>
            ` : ''}

            <!-- Delivery Reach Date Banner in Product Modal -->
            <div class="delivery-arrival-banner" style="margin-bottom: 12px; padding: 10px 14px;">
              <i class="fa-solid fa-truck-fast"></i>
              <div class="delivery-arrival-text">
                <strong style="font-size: 0.85rem;">Guaranteed Doorstep Delivery Date:</strong>
                <span style="font-size: 0.9rem;">Order now to get it by <strong>${this.getEstimatedDeliveryDate(2)}</strong> (By 5:00 PM)</span>
              </div>
            </div>

            <!-- Time to Buy Banner -->
            <div class="time-to-buy-badge" style="margin-bottom: 0; padding: 10px 14px; font-size: 0.88rem;">
              <i class="fa-solid fa-clock" style="font-size: 1.1rem;"></i>
              <span>Order within <strong class="time-to-buy-clock">02h 45m 00s</strong> for Guaranteed Dispatch Today!</span>
            </div>
          </div>

          <!-- 3. UNDER IT: Customer Reviews & Customer Uploaded Photos -->
          <div class="modal-section-card">
            <div class="reviews-header">
              <div class="modal-section-title" style="border: none; padding: 0; margin: 0;">
                <i class="fa-solid fa-star" style="color: #f59e0b;"></i> Customer Reviews & Customer Photos (${product.reviewsCount})
              </div>
              <span style="font-size: 0.92rem; color: var(--text-muted);">Rating <strong>${product.rating}</strong> / 5.0</span>
            </div>

            <div class="reviews-list-box" id="modal-reviews-list">
              ${reviewsList.map(r => `
                <div class="review-card">
                  <div class="review-meta">
                    <span class="reviewer-name">
                      ${r.author}
                      ${r.verified ? `<span class="verified-badge"><i class="fa-solid fa-circle-check"></i> Verified Buyer</span>` : ''}
                    </span>
                    <span class="review-date">${r.date}</span>
                  </div>
                  <div class="stars" style="font-size: 0.85rem; margin: 4px 0;">
                    ${'<i class="fa-solid fa-star" style="color:#f59e0b;"></i>'.repeat(Math.floor(r.rating))}
                    ${r.rating % 1 !== 0 ? '<i class="fa-solid fa-star-half-stroke" style="color:#f59e0b;"></i>' : ''}
                  </div>
                  <div class="review-comment">${r.comment}</div>
                  
                  <!-- Customer Uploaded Review Photos -->
                  ${(r.photos && r.photos.length > 0) ? `
                    <div class="review-customer-photos">
                      ${r.photos.map(p => `
                        <img src="${p}" class="customer-photo-thumb" alt="Customer review photo" onclick="app.switchGalleryImage('${p}', null)">
                      `).join('')}
                    </div>
                  ` : ''}

                  <button class="helpful-btn" onclick="this.innerHTML='<i class=\\'fa-solid fa-thumbs-up\\'></i> Helpful (${(r.helpful || 0) + 1})'; this.disabled=true;">
                    <i class="fa-regular fa-thumbs-up"></i> Helpful (${r.helpful || 0})
                  </button>
                </div>
              `).join('')}
            </div>

            <!-- Write a Review Form -->
            <div class="add-review-box">
              <h4><i class="fa-solid fa-pen-to-square" style="color: var(--accent-primary);"></i> Write a Customer Review & Add Photo</h4>
              <form onsubmit="app.submitProductReview(event, ${product.id})">
                <div style="display: flex; gap: 10px; margin-bottom: 8px; flex-wrap: wrap;">
                  <input type="text" id="review-author-input" class="review-input-field" placeholder="Your Name (e.g. Abhisek K.)" required style="margin-bottom:0; flex:1;">
                  <select id="review-rating-input" class="review-input-field" style="width: 140px; margin-bottom:0;" required>
                    <option value="5">⭐⭐⭐⭐⭐ (5/5)</option>
                    <option value="4">⭐⭐⭐⭐ (4/5)</option>
                    <option value="3">⭐⭐⭐ (3/5)</option>
                    <option value="2">⭐⭐ (2/5)</option>
                    <option value="1">⭐ (1/5)</option>
                  </select>
                </div>
                <textarea id="review-comment-input" class="review-input-field" rows="2" placeholder="Share details of your experience with this product..." required></textarea>
                <input type="url" id="review-photo-input" class="review-input-field" placeholder="Optional Photo URL (e.g. https://...)" style="margin-bottom: 10px;">
                <button type="submit" class="btn-primary" style="padding: 10px 18px; font-size: 0.88rem; width: 100%;">
                  Submit Verified Customer Review
                </button>
              </form>
            </div>
          </div>

          <!-- 4. UNDER IT: All Features & Key Specifications -->
          <div class="modal-section-card">
            <div class="modal-section-title">
              <i class="fa-solid fa-list-check" style="color: var(--accent-primary);"></i> All Features & Technical Specifications
            </div>

            <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 18px; line-height: 1.6;">${product.description}</p>

            <ul class="modal-specs-list">
              ${Object.entries(product.specs).map(([key, val]) => `
                <li>
                  <strong>${key}</strong>
                  <span>${val}</span>
                </li>
              `).join('')}
            </ul>
          </div>

          <!-- 5. UNDER IT: Buy Option & Add to Cart (Connected to Payment Modal) -->
          <div class="modal-section-card action-bar-sticky">
            <button class="add-cart-btn" style="padding: 14px 20px; font-size: 0.95rem; flex: 1; justify-content: center;" onclick="app.addToCart(${product.id}); app.closeModals();">
              <i class="fa-solid fa-bag-shopping"></i> Add to Cart
            </button>
            <button class="btn-buy-now-large" style="flex: 1;" onclick="app.buyNowDirectToPayment(${product.id});">
              <i class="fa-solid fa-bolt"></i> Buy Now (Pay via UPI / COD)
            </button>
            <button class="icon-btn" onclick="app.toggleWishlist(${product.id})" title="Wishlist">
              <i class="${this.wishlist.includes(product.id) ? 'fa-solid fa-heart' : 'fa-regular fa-heart'}" style="${this.wishlist.includes(product.id) ? 'color: var(--sale-red)' : ''}"></i>
            </button>
          </div>
        </div>
      `;
      modalBackdrop.classList.add('active');
    }
  }

  buyNowDirectToPayment(productId) {
    const product = this.products.find(p => p.id === productId);
    if (!product) return;

    const existingIndex = this.cart.findIndex(item => item.productId === productId);
    if (existingIndex > -1) {
      this.cart[existingIndex].quantity += 1;
    } else {
      this.cart.push({ productId, quantity: 1 });
    }

    this.saveCartState();
    this.updateCartUI();
    this.closeModals();

    const checkoutModal = document.getElementById('checkout-modal');
    if (checkoutModal) checkoutModal.classList.add('active');
    this.setCheckoutStep(2); // Jump straight to Payment Step (UPI & Cash on Delivery)
    this.showToast(`Proceeding to UPI / Cash on Delivery Payment for "${product.name}"!`, 'success');
  }

  switchGalleryImage(imgUrl, btnElem) {
    const mainImg = document.getElementById('main-quickview-img');
    if (mainImg) mainImg.src = imgUrl;

    const allThumbs = document.querySelectorAll('.gallery-thumb-btn');
    allThumbs.forEach(t => t.classList.remove('active'));
    if (btnElem) btnElem.classList.add('active');
  }

  submitProductReview(event, productId) {
    event.preventDefault();
    const product = this.products.find(p => p.id === productId);
    if (!product) return;

    const author = document.getElementById('review-author-input')?.value || 'Verified Customer';
    const rating = parseFloat(document.getElementById('review-rating-input')?.value || '5');
    const comment = document.getElementById('review-comment-input')?.value || '';
    const photoUrl = document.getElementById('review-photo-input')?.value || '';

    if (!product.reviews) product.reviews = [];

    const photosList = photoUrl.trim() !== '' ? [photoUrl] : [];

    const newReview = {
      id: Date.now(),
      author: author,
      rating: rating,
      date: 'Just now',
      comment: comment,
      verified: true,
      helpful: 0,
      photos: photosList
    };

    product.reviews.unshift(newReview);
    product.reviewsCount = (product.reviewsCount || 0) + 1;

    this.showToast('Thank you! Your verified review has been published.', 'success');
    this.quickViewProduct(productId);
    this.filterAndRenderProducts();
  }

  /* ==========================================================================
     Checkout Modal & Order Receipt Logic
     ========================================================================== */
  startCheckout() {
    if (this.cart.length === 0) {
      this.showToast('Your cart is empty! Add items first.', 'warning');
      return;
    }
    this.closeDrawers();
    const modal = document.getElementById('checkout-modal');
    if (modal) modal.classList.add('active');
    this.setCheckoutStep(1);
  }

  setCheckoutStep(step) {
    const formStep1 = document.getElementById('checkout-shipping-form');
    const formStep2 = document.getElementById('checkout-payment-step');
    const formStep3 = document.getElementById('checkout-success-step');

    const ind1 = document.getElementById('step-indicator-1');
    const ind2 = document.getElementById('step-indicator-2');
    const ind3 = document.getElementById('step-indicator-3');

    if (step === 1) {
      formStep1.style.display = 'block';
      formStep2.style.display = 'none';
      formStep3.style.display = 'none';
      ind1.classList.add('active');
      ind2.classList.remove('active');
      ind3.classList.remove('active');
    } else if (step === 2) {
      formStep1.style.display = 'none';
      formStep2.style.display = 'block';
      formStep3.style.display = 'none';
      ind1.classList.add('active');
      ind2.classList.add('active');
      ind3.classList.remove('active');
    } else if (step === 3) {
      formStep1.style.display = 'none';
      formStep2.style.display = 'none';
      formStep3.style.display = 'block';
      ind1.classList.add('active');
      ind2.classList.add('active');
      ind3.classList.add('active');

      this.renderOrderReceipt();
    }
  }

  getEstimatedDeliveryDate(daysToAdd = 2) {
    const date = new Date();
    date.setDate(date.getDate() + daysToAdd);
    return date.toLocaleDateString('en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }

  getShortDeliveryDate(daysToAdd = 2) {
    const date = new Date();
    date.setDate(date.getDate() + daysToAdd);
    return date.toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  }

  renderOrderReceipt() {
    const successStep = document.getElementById('checkout-success-step');
    if (!successStep) return;

    const selectedPayment = document.querySelector('input[name="payment-method"]:checked')?.value || 'upi';
    let paymentLabel = 'UPI / QR Code';
    if (selectedPayment === 'cod') paymentLabel = 'Cash on Delivery (COD)';
    if (selectedPayment === 'card') paymentLabel = 'Credit / Debit Card';
    if (selectedPayment === 'netbanking') paymentLabel = 'Net Banking';

    const orderId = 'TH-IN-' + Math.floor(100000 + Math.random() * 900000);
    const arrivalDateStr = this.getEstimatedDeliveryDate(2);
    
    const subtotal = this.cart.reduce((acc, item) => {
      const p = this.products.find(prod => prod.id === item.productId);
      return acc + (p ? p.price * item.quantity : 0);
    }, 0);

    const discountAmount = subtotal * (this.appliedDiscount / 100);
    const isFreeShipping = subtotal >= 500;
    const shipping = (isFreeShipping || subtotal === 0) ? 0 : 49.00;
    const grandTotal = subtotal - discountAmount + shipping;

    // Record order in user orders history
    this.orders.unshift({
      orderId: orderId,
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      expectedDelivery: arrivalDateStr,
      itemsCount: this.cart.reduce((a, b) => a + b.quantity, 0),
      total: grandTotal,
      paymentMode: paymentLabel,
      status: "Out for Delivery"
    });
    localStorage.setItem('techhub_orders', JSON.stringify(this.orders));

    successStep.innerHTML = `
      <div class="order-success-box">
        <div class="success-icon"><i class="fa-solid fa-check"></i></div>
        <h2 style="font-family: var(--font-heading); font-size: 1.8rem; margin-bottom: 6px;">Order Confirmed!</h2>
        <p style="color: var(--text-muted); font-size: 0.95rem;">Thank you for shopping with TechHub India. Your order is being processed.</p>
        
        <!-- Delivery Arrival Date Banner -->
        <div class="delivery-arrival-banner">
          <i class="fa-solid fa-truck-fast"></i>
          <div class="delivery-arrival-text">
            <strong>Guaranteed Doorstep Delivery Date:</strong>
            <span>${arrivalDateStr} (By 5:00 PM)</span>
          </div>
        </div>

        <div class="receipt-card">
          <div style="display: flex; justify-content: space-between; font-weight: 700; margin-bottom: 12px; border-bottom: 1px solid var(--border-color); padding-bottom: 8px;">
            <span>Order ID:</span>
            <span style="color: var(--accent-primary);">${orderId}</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 0.88rem; margin-bottom: 12px; color: var(--text-muted);">
            <span>Payment Mode:</span>
            <strong style="color: var(--text-main);">${paymentLabel}</strong>
          </div>
          <div style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 12px;">
            Items Purchased (${this.cart.reduce((a, b) => a + b.quantity, 0)}):
          </div>
          ${this.cart.map(item => {
            const p = this.products.find(prod => prod.id === item.productId);
            return `<div style="display: flex; justify-content: space-between; font-size: 0.88rem; margin-bottom: 6px;">
              <span>${item.quantity}x ${p ? p.name : ''}</span>
              <strong>${this.formatINR(p ? p.price * item.quantity : 0)}</strong>
            </div>`;
          }).join('')}
          <div style="border-top: 1px dashed var(--border-color); padding-top: 10px; margin-top: 10px; display: flex; justify-content: space-between; font-weight: 800; font-size: 1.1rem;">
            <span>Total Amount Paid:</span>
            <span style="color: var(--success-green);">${this.formatINR(grandTotal)}</span>
          </div>
        </div>

        <button class="btn-primary" style="width: 100%;" onclick="app.clearCartAndCloseModal()">
          Continue Shopping
        </button>
      </div>
    `;

    // Clear local storage cart
    this.cart = [];
    this.saveCartState();
    this.updateCartUI();
  }

  clearCartAndCloseModal() {
    this.closeModals();
  }

  /* ==========================================================================
     UI Event Listeners & Modals/Drawers Controls
     ========================================================================== */
  attachEventListeners() {
    // Theme Toggle
    document.getElementById('theme-toggle-btn')?.addEventListener('click', () => this.toggleTheme());

    // Drawers Open / Close
    document.getElementById('open-cart-btn')?.addEventListener('click', () => this.openCartDrawer());
    document.getElementById('close-cart-btn')?.addEventListener('click', () => this.closeDrawers());
    document.getElementById('cart-drawer-backdrop')?.addEventListener('click', () => this.closeDrawers());

    document.getElementById('open-wishlist-btn')?.addEventListener('click', () => this.openWishlistDrawer());
    document.getElementById('close-wishlist-btn')?.addEventListener('click', () => this.closeDrawers());
    document.getElementById('wishlist-drawer-backdrop')?.addEventListener('click', () => this.closeDrawers());

    // Modals Close
    document.getElementById('close-quickview-btn')?.addEventListener('click', () => this.closeModals());
    document.getElementById('quick-view-modal')?.addEventListener('click', (e) => {
      if (e.target.id === 'quick-view-modal') this.closeModals();
    });

    document.getElementById('close-checkout-btn')?.addEventListener('click', () => this.closeModals());

    // Live Search Inputs (Header & Sidebar)
    const searchInput = document.getElementById('live-search-input');
    searchInput?.addEventListener('input', (e) => this.handleLiveSearch(e.target.value, 'header'));

    const sidebarSearchInput = document.getElementById('sidebar-search-input');
    sidebarSearchInput?.addEventListener('input', (e) => this.handleLiveSearch(e.target.value, 'sidebar'));

    // Search Clear Buttons
    document.getElementById('header-search-clear')?.addEventListener('click', () => this.clearSearch());
    document.getElementById('sidebar-search-clear')?.addEventListener('click', () => this.clearSearch());

    // Hide search dropdown on click outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.search-wrapper')) {
        document.getElementById('search-dropdown-results')?.classList.remove('active');
      }
    });

    // Price Slider
    const priceRange = document.getElementById('price-range');
    priceRange?.addEventListener('input', (e) => {
      this.maxPrice = parseFloat(e.target.value);
      document.getElementById('price-range-label').innerText = `${this.formatINR(this.maxPrice)}`;
      this.filterAndRenderProducts();
    });

    // Reset Filters Button
    document.getElementById('reset-filters-btn')?.addEventListener('click', () => {
      this.activeCategory = 'All';
      this.activeBrand = 'All';
      this.maxPrice = 200000;
      this.sortBy = 'featured';
      if (priceRange) priceRange.value = 200000;
      document.getElementById('price-range-label').innerText = '₹2,00,000';
      document.getElementById('sort-select').value = 'featured';
      this.clearSearch();
      this.renderCategories();
      this.renderBrands();
      this.showToast('Reset all product filters');
    });

    // Sort Select
    document.getElementById('sort-select')?.addEventListener('change', (e) => {
      this.sortBy = e.target.value;
      this.filterAndRenderProducts();
    });

    // Promo Code Apply
    document.getElementById('apply-promo-btn')?.addEventListener('click', () => {
      const codeInput = document.getElementById('promo-code-input');
      if (codeInput) this.applyPromoCode(codeInput.value);
    });

    // Checkout Flow Buttons
    document.getElementById('start-checkout-btn')?.addEventListener('click', () => this.startCheckout());
    document.getElementById('to-payment-step-btn')?.addEventListener('click', () => this.setCheckoutStep(2));
    document.getElementById('place-order-btn')?.addEventListener('click', () => this.setCheckoutStep(3));

    // User Account Header Pill Button Listener
    document.getElementById('open-account-drawer-btn')?.addEventListener('click', () => {
      if (this.currentUser) {
        this.openAccountDrawer();
      } else {
        this.openAuthModal();
      }
    });

    document.getElementById('close-account-drawer-btn')?.addEventListener('click', () => this.closeDrawers());
    document.getElementById('account-drawer-backdrop')?.addEventListener('click', () => this.closeDrawers());
    document.getElementById('close-auth-btn')?.addEventListener('click', () => this.closeModals());
  }

  /* ==========================================================================
     User Authentication & Account Management (Login, Sign-Up & Logout)
     ========================================================================== */
  updateAuthUI() {
    const pillAvatar = document.getElementById('user-pill-avatar');
    const pillLabel = document.getElementById('user-pill-label');
    const drawerAvatar = document.getElementById('drawer-avatar-initials');
    const drawerName = document.getElementById('drawer-user-name');
    const drawerEmail = document.getElementById('drawer-user-email');

    if (this.currentUser) {
      // Get Initials from Name
      const names = this.currentUser.name.trim().split(' ');
      const initials = names.length > 1 ? (names[0][0] + names[names.length - 1][0]).toUpperCase() : names[0].slice(0, 2).toUpperCase();

      if (pillAvatar) pillAvatar.innerText = initials;
      if (pillLabel) pillLabel.innerText = names[0];
      if (drawerAvatar) drawerAvatar.innerText = initials;
      if (drawerName) drawerName.innerText = this.currentUser.name;
      if (drawerEmail) drawerEmail.innerText = this.currentUser.email;
    } else {
      if (pillAvatar) pillAvatar.innerHTML = '<i class="fa-solid fa-user"></i>';
      if (pillLabel) pillLabel.innerText = 'Account';
      if (drawerAvatar) drawerAvatar.innerText = 'TH';
      if (drawerName) drawerName.innerText = 'Guest User';
      if (drawerEmail) drawerEmail.innerText = 'Log in for VIP benefits';
    }
  }

  openAccountDrawer() {
    this.closeDrawers();
    document.getElementById('account-drawer')?.classList.add('active');
    document.getElementById('account-drawer-backdrop')?.classList.add('active');
  }

  openMyOrdersModal() {
    this.closeModals();
    const modal = document.getElementById('my-orders-modal');
    const container = document.getElementById('my-orders-list-container');
    if (!container || !modal) return;

    if (this.orders.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 40px 10px;">
          <i class="fa-solid fa-box-open" style="font-size: 3rem; color: var(--text-muted); margin-bottom: 14px;"></i>
          <h4>No orders placed yet</h4>
          <p style="font-size: 0.88rem; color: var(--text-muted); margin-top: 6px;">Your completed purchases will appear here.</p>
        </div>
      `;
    } else {
      container.innerHTML = this.orders.map(o => {
        const reachDate = o.expectedDelivery || this.getEstimatedDeliveryDate(2);
        return `
          <div class="orders-history-card">
            <div class="order-history-header">
              <div>
                <strong style="color: var(--accent-primary); display: block; font-size: 0.95rem;">Order #${o.orderId}</strong>
                <span style="font-size: 0.78rem; color: var(--text-muted);">Placed on ${o.date}</span>
              </div>
              <span class="order-status-pill"><i class="fa-solid fa-truck-fast"></i> ${o.status || 'Out for Delivery'}</span>
            </div>

            <!-- Delivery Arrival Date Banner -->
            <div class="delivery-arrival-banner" style="margin: 10px 0; padding: 10px 14px;">
              <i class="fa-solid fa-calendar-check" style="font-size: 1.3rem;"></i>
              <div class="delivery-arrival-text">
                <strong style="font-size: 0.82rem;">Delivery Expected By:</strong>
                <span style="font-size: 0.9rem; color: var(--text-main);">${reachDate} (By 5:00 PM)</span>
              </div>
            </div>

            <!-- Tracking Timeline Bar -->
            <div class="tracking-timeline-bar">
              <div class="timeline-step completed">
                <div class="timeline-dot"><i class="fa-solid fa-check"></i></div>
                <span>Order Placed</span>
              </div>
              <div class="timeline-step completed">
                <div class="timeline-dot"><i class="fa-solid fa-box"></i></div>
                <span>Packed</span>
              </div>
              <div class="timeline-step active">
                <div class="timeline-dot"><i class="fa-solid fa-truck"></i></div>
                <span>Dispatched</span>
              </div>
              <div class="timeline-step">
                <div class="timeline-dot"><i class="fa-solid fa-house"></i></div>
                <span>Delivery</span>
              </div>
            </div>

            <div style="display: flex; justify-content: space-between; font-size: 0.88rem; margin-top: 12px; margin-bottom: 6px;">
              <span>Payment Mode: <strong>${o.paymentMode || 'UPI / COD'}</strong></span>
              <span>Total Paid: <strong style="color: var(--success-green); font-size: 1rem;">${this.formatINR(o.total)}</strong></span>
            </div>

            <div style="font-size: 0.82rem; color: var(--text-muted); margin-top: 8px; border-top: 1px dashed var(--border-color); padding-top: 8px; display: flex; justify-content: space-between; align-items: center;">
              <span>Items Count: <strong>${o.itemsCount || 1} Item(s)</strong></span>
              <button class="btn-outline" style="padding: 4px 10px; font-size: 0.75rem;" onclick="app.showToast('Downloading official tax invoice PDF for ${o.orderId}...')">
                <i class="fa-solid fa-download"></i> Tax Invoice PDF
              </button>
            </div>
          </div>
        `;
      }).join('');
    }

    modal.classList.add('active');
  }

  openAuthModal() {
    this.closeDrawers();
    const modal = document.getElementById('auth-modal');
    if (modal) modal.classList.add('active');
  }

  switchAuthTab(tab) {
    const loginBtn = document.getElementById('tab-login-btn');
    const registerBtn = document.getElementById('tab-register-btn');
    const loginForm = document.getElementById('auth-login-form');
    const regForm = document.getElementById('auth-register-form');

    if (tab === 'login') {
      loginBtn?.classList.add('active');
      registerBtn?.classList.remove('active');
      if (loginForm) loginForm.style.display = 'block';
      if (regForm) regForm.style.display = 'none';
    } else {
      registerBtn?.classList.add('active');
      loginBtn?.classList.remove('active');
      if (regForm) regForm.style.display = 'block';
      if (loginForm) loginForm.style.display = 'none';
    }
  }

  handleLoginSubmit(event) {
    event.preventDefault();
    const email = document.getElementById('login-email')?.value || 'user@techhub.in';
    const name = email.split('@')[0].replace('.', ' ');
    const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
    
    this.loginUser(email, formattedName);
  }

  handleRegisterSubmit(event) {
    event.preventDefault();
    const name = document.getElementById('reg-name')?.value || 'Valued Member';
    const email = document.getElementById('reg-email')?.value || 'member@techhub.in';

    this.loginUser(email, name);
  }

  loginUser(email, name) {
    this.currentUser = {
      name: name,
      email: email,
      joined: new Date().toLocaleDateString('en-IN')
    };

    localStorage.setItem('techhub_user', JSON.stringify(this.currentUser));
    this.updateAuthUI();
    this.closeModals();
    this.showToast(`Welcome back, ${name}! Logged in successfully.`, 'success');
  }

  logoutUser() {
    const name = this.currentUser ? this.currentUser.name : 'User';
    this.currentUser = null;
    localStorage.removeItem('techhub_user');

    this.updateAuthUI();
    this.closeDrawers();
    this.closeModals();
    this.showToast(`Successfully logged out. Goodbye, ${name}!`, 'info');
  }

  openCartDrawer() {
    this.closeDrawers();
    document.getElementById('cart-drawer')?.classList.add('active');
    document.getElementById('cart-drawer-backdrop')?.classList.add('active');
  }

  openWishlistDrawer() {
    this.closeDrawers();
    document.getElementById('wishlist-drawer')?.classList.add('active');
    document.getElementById('wishlist-drawer-backdrop')?.classList.add('active');
  }

  closeDrawers() {
    document.querySelectorAll('.drawer').forEach(d => d.classList.remove('active'));
    document.querySelectorAll('.drawer-backdrop').forEach(b => b.classList.remove('active'));
  }

  closeModals() {
    document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.remove('active'));
  }

  scrollToCatalog() {
    document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
  }

  /* ==========================================================================
     Toast Notifications Engine
     ========================================================================== */
  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let icon = 'fa-circle-info';
    if (type === 'success') icon = 'fa-circle-check';
    if (type === 'warning') icon = 'fa-triangle-exclamation';

    toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  /* ==========================================================================
     Flash Sale Countdown & Time to Buy Ticker Timers
     ========================================================================== */
  startFlashSaleTimer() {
    let seconds = 8 * 3600 + 45 * 60 + 30; // 8 hours, 45 mins, 30 secs
    
    setInterval(() => {
      if (seconds > 0) seconds--;

      const h = Math.floor(seconds / 3600);
      const m = Math.floor((seconds % 3600) / 60);
      const s = seconds % 60;

      const hElem = document.getElementById('timer-hours');
      const mElem = document.getElementById('timer-minutes');
      const sElem = document.getElementById('timer-seconds');

      if (hElem) hElem.innerText = String(h).padStart(2, '0');
      if (mElem) mElem.innerText = String(m).padStart(2, '0');
      if (sElem) sElem.innerText = String(s).padStart(2, '0');
    }, 1000);
  }

  startTimeToBuyTicker() {
    setInterval(() => {
      const now = new Date();
      let target = new Date(now);
      target.setHours(17, 0, 0, 0); // 5 PM cut-off
      if (now > target) {
        target.setDate(target.getDate() + 1);
      }
      const diff = Math.max(0, Math.floor((target - now) / 1000));
      const h = Math.floor(diff / 3600);
      const m = Math.floor((diff % 3600) / 60);
      const s = diff % 60;
      const formatted = `${String(h).padStart(2, '0')}h ${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s`;

      document.querySelectorAll('.time-to-buy-clock').forEach(elem => {
        elem.innerText = formatted;
      });
    }, 1000);
  }
}

// Instantiate App globally
const app = new StoreApp();

