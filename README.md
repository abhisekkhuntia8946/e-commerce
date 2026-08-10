# 🛒 TechHub - Flipkart & Amazon Style E-Commerce Superstore 🇮🇳

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Status](https://img.shields.io/badge/Status-Active%20Superstore-brightgreen?style=for-the-badge)](#)

Welcome to **TechHub**, a full-featured, high-performance Flipkart and Amazon inspired **Indian E-Commerce Superstore** built with pure Vanilla HTML5, CSS3 (Modern Glassmorphism & Custom Design Tokens), and Modular ES6+ JavaScript.

---

## ✨ Key Features & Highlights

### 🇮🇳 1. Indian Rupee (`₹`) Localization & Free Delivery Meter
- **Currency System**: All product prices, discounts, subtotal, shipping fees, and checkout totals are formatted using Indian Rupee standards (`₹X,XX,XXX`).
- **Free Shipping Threshold**: Free Express Shipping on orders **over ₹500** (`₹0 FREE`). Standard shipping fee of **₹49** applies for subtotal under ₹500.
- **Dynamic Progress Bar**: Live shipping meter tracks remaining amount needed for FREE shipping.

### 📱 2. Mega Superstore Catalog (36+ Items & 12 Categories)
Includes items across 12 diverse lifestyle & tech categories:
- 📱 **Smartphones**: Apple iPhone 15 Pro Max, Google Pixel 8 Pro, OnePlus 12 5G, Nothing Phone (2), Vivo X100 Pro, Oppo Find N3 Flip, Xiaomi 14 Ultra, Realme GT 5 Pro, Samsung S24 Ultra.
- 💻 **Laptops & Computers**: Apple MacBook Pro M3 Max, Dell XPS 15 OLED Touch, Lenovo Legion Pro 5 Gaming, Asus ROG Strix.
- 🎧 **Audio & Speakers**: Apple AirPods Pro 2, Sony WH-1000XM5 ANC Headphones, JBL Flip 6 Waterproof Speaker.
- ⌚ **Wearables**: Apple Watch Ultra 2 Titanium, PulseFit GT AMOLED Smartwatch.
- 📺 **TV & Appliances**: Sony BRAVIA 55" 4K Smart OLED TV, Dyson V15 Laser Cordless Vacuum.
- 👟 **Footwear**: Nike Air Max Flyknit, Woodland Leather Hiking Boots, Skechers GoWalk Slip-On, Adidas Ultraboost Light.
- 🕶️ **Sunglasses**: Ray-Ban Aviator Classic Polarized, Oakley Radar EV Path Sports.
- 👗 **Women's Fashion**: Zara Tiered Floral Summer Maxi Dress, Biba Silk Anarkali Kurti Set, H&M Satin Side-Slit Evening Dress.
- 👔 **Men's Fashion**: Levi's 501 Original Fit Jeans, US Polo Assn Cotton Polo T-Shirt, Zara Vintage Washed Denim Jacket.
- 🪑 **Furniture**: Electric Height-Adjustable Standing Desk, Ergonomic Mesh Executive Office Chair, Solid Sheesham Wood Study Table.
- 🥦 **Vegetables & Groceries**: Organic Farm Fresh Daily Vegetable Combo Basket, California Roasted Almonds & Cashews Box, Nescafe Gold Blend Coffee.

### 🏷️ 3. Interactive Brand Filter System
- Dedicated **Filter by Brand** pills in the catalog sidebar supporting 30+ top brands:
  - *Apple, Google, Dell, Lenovo, JBL, Sony, Dyson, Nike, Adidas, Puma, Ray-Ban, Fastrack, Oakley, Zara, Biba, H&M, Levi's, US Polo Assn, Woodland, Skechers, Organic Fresh, Nescafe, TechHub Home, etc.*

### 💳 4. Multi-Mode Indian Payment Gateway
Integrated multi-step checkout modal featuring:
- 📱 **UPI / QR Code**: Google Pay, PhonePe, Paytm, BHIM UPI
- 💵 **Cash on Delivery (COD)**: Pay cash or UPI at delivery doorstep
- 💳 **Credit / Debit Cards**: RuPay, Visa, MasterCard with No-Cost EMI options
- 🏛️ **Net Banking**: SBI, HDFC, ICICI, Axis, Kotak

### 📸 5. Product Detail Modal Sequence & Photo Gallery
Clicking any product card opens a modal structured in the requested vertical layout:
1. 📸 **Top**: Multi-Photo Image Gallery with interactive thumbnail photo switcher.
2. 🏷️ **Price & Offers**: Price in `₹`, original price, discount % badge, No-Cost EMI starting tag, and Time to Buy urgency ticker.
3. ⭐ **Customer Reviews & Customer Uploaded Photos**: Verified buyer reviews with star ratings, comments, and **Customer Uploaded Photos**. Includes an interactive "Write a Review" form with photo attachment support.
4. 📋 **Features & Specifications**: All product specifications grid & detailed description.
5. ⚡ **Action Bar (Buy Now & Add to Cart)**: **Buy Now** directly jumps to the UPI & Cash on Delivery Payment step in checkout.

### 👤 6. Clean Header UI & Account Menu Drawer
- **Single Account Button** (`[ 👤 Account ▾ ]` or `[ AK Abhisek ▾ ]`).
- **Account Menu Drawer**: Slide-over drawer displaying User Profile Card (Avatar initials, Name, Email, VIP Prime badge), **My Orders**, **My Wishlist**, **Settings**, and **Log Out**.
- 📦 **My Orders History Modal**: Displays past order references (e.g. `#TH-IN-984210`), delivery status pill (`Out for Delivery`), payment mode, total paid in `₹`, and invoice download option.

### 🌙 7. Dark & Light Theme Switcher
- Smooth toggle between sleek Dark Mode (Tailored dark hues) and Crisp Light Mode with instant `localStorage` persistence.

---

## 📁 Project Architecture & File Directory

```
Ecommer wesite/
│
├── index.html        # Main HTML5 Structure, Modals & Slide-over Drawers
├── styles.css        # Core Design System, Animations, CSS Custom Properties
├── products.js       # Product Data Store (36 Items, Specs, Images, Reviews)
├── app.js            # Core Application Logic, Filtering, Cart, Auth & Modals
└── README.md         # Technical Project Documentation
```

---

## 🛠️ Tech Stack & Implementation Details

- **HTML5**: Semantic elements (`<header>`, `<main>`, `<aside>`, `<section>`, `<footer>`).
- **CSS3**: Modern Vanilla CSS, Flexbox, Grid, Glassmorphism backdrop-blur, custom CSS variables, keyframe animations.
- **JavaScript (ES6+)**: Object-Oriented Architecture (`StoreApp` class), DOM Manipulation, Event Handling, `localStorage` state persistence, Intl currency formatting.
- **Icons & Typography**: FontAwesome 6.5 Pro & Google Fonts (`Outfit`, `Inter`).

---

## 🚀 Getting Started

### Prerequisites
- Any modern web browser (Google Chrome, Mozilla Firefox, Microsoft Edge, Safari).
- No external npm/node dependencies required.

### Installation & Execution
1. Clone or download this project repository.
2. Navigate to the project directory:
   ```bash
   cd "Ecommer wesite"
   ```
3. Open `index.html` in your web browser, or serve locally using Live Server.

---

## 📄 License & Credits

Crafted for excellence as a high-performance E-Commerce Superstore demo.  
&copy; 2026 TechHub Store Inc. All rights reserved.
