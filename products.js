/* ==========================================================================
   TechHub Store - Flipkart & Amazon Style Superstore Catalog
   Brands: Apple, OnePlus, Nothing, Vivo, Oppo, Xiaomi/Mi, Realme, Samsung,
           Google, Dell, Lenovo, JBL, Sony, Dyson, Nike, Adidas, Puma, Ray-Ban,
           Fastrack, Oakley, Vogue, Zara, Biba, H&M, Levi's, US Polo Assn,
           Woodland, Skechers, Organic Fresh, Nescafe, TechHub Home, etc.
   Categories: Smartphones, Laptops, Audio, TV & Appliances, Furniture, 
               Vegetables & Groceries, Footwear, Sunglasses, Women's Fashion, Men's Fashion, Wearables, Gaming
   Prices in Indian Rupees (₹)
   Multi-Photo Galleries, Verified Reviews with Customer Uploaded Photos
   ========================================================================== */

const PRODUCTS = [
  /* ---------------- Smartphones Section ---------------- */
  {
    id: 1,
    name: "Apple iPhone 15 Pro Max (256GB, Natural Titanium)",
    brand: "Apple",
    category: "Smartphones",
    price: 159900,
    originalPrice: 169900,
    rating: 4.9,
    reviewsCount: 8420,
    badge: "Top Flagship",
    inStock: true,
    isFlashSale: true,
    emiStarting: 13325,
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=800&q=80"
    ],
    reviews: [
      {
        id: 101,
        author: "Rahul Sharma",
        rating: 5,
        date: "2 days ago",
        comment: "The titanium finish feels insanely premium in hand! 5x optical zoom camera is unbelievable for night concert shots.",
        verified: true,
        helpful: 42,
        photos: [
          "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=300&q=80",
          "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=300&q=80"
        ]
      },
      {
        id: 102,
        author: "Priya Patel",
        rating: 5,
        date: "1 week ago",
        comment: "Battery life easily lasts 1.5 days of heavy usage. A17 Pro chip plays AAA games without heating up.",
        verified: true,
        helpful: 28,
        photos: [
          "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=300&q=80"
        ]
      },
      {
        id: 103,
        author: "Vikram Malhotra",
        rating: 4.5,
        date: "2 weeks ago",
        comment: "Action button is so handy for instant camera access. Super fast delivery by TechHub India!",
        verified: true,
        helpful: 15,
        photos: []
      }
    ],
    colors: ["#bead9f", "#1f2022", "#e2e3e5"],
    specs: {
      Processor: "A17 Pro Bionic Chip 3nm",
      Camera: "48MP Main + 5x Telephoto Zoom",
      Display: "6.7-inch Super Retina XDR OLED 120Hz ProMotion",
      Build: "Grade 5 Titanium Frame with Action Button",
      Battery: "4422mAh with 20W Fast Charge + MagSafe Wireless",
      OS: "iOS 17 (Upgradeable to iOS 18)"
    },
    description: "Forged in titanium. Revolutionary A17 Pro chip, customizable Action button, most powerful iPhone camera system ever with 5x optical zoom."
  },
  {
    id: 2,
    name: "Google Pixel 8 Pro (12GB RAM, 128GB, Bay Blue)",
    brand: "Google",
    category: "Smartphones",
    price: 106999,
    originalPrice: 114999,
    rating: 4.8,
    reviewsCount: 3410,
    badge: "Best Camera AI",
    inStock: true,
    isFlashSale: true,
    emiStarting: 8916,
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1546054454-aa26e2b734c7?auto=format&fit=crop&w=800&q=80"
    ],
    reviews: [
      {
        id: 201,
        author: "Amitav Roy",
        rating: 5,
        date: "3 days ago",
        comment: "Best AI camera features ever! Magic Editor and Best Take make family photo editing so easy.",
        verified: true,
        helpful: 34,
        photos: [
          "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=300&q=80"
        ]
      },
      {
        id: 202,
        author: "Sneha Nair",
        rating: 4.5,
        date: "5 days ago",
        comment: "The 120Hz LTPO display is blindingly bright outdoors under direct Indian sunlight.",
        verified: true,
        helpful: 19,
        photos: []
      }
    ],
    colors: ["#38bdf8", "#09090b"],
    specs: {
      Processor: "Google Tensor G3 + Titan M2 Security",
      Camera: "50MP Main + 48MP Ultrawide + 48MP 5x Telephoto",
      Display: "6.7-inch Super Actua LTPO OLED 120Hz 2400nits",
      Features: "Magic Editor, Best Take & Night Sight Video",
      Battery: "5050mAh with 30W Fast Charge",
      Security: "Face Unlock + In-Display Fingerprint + 7 Years OS Updates"
    },
    description: "The most powerful Pixel yet. Powered by Google Tensor G3 with advanced AI photography tools like Magic Eraser, Best Take, and Audio Magic Eraser."
  },
  {
    id: 3,
    name: "OnePlus 12 5G (16GB RAM, 512GB Storage, Silky Black)",
    brand: "OnePlus",
    category: "Smartphones",
    price: 64999,
    originalPrice: 69999,
    rating: 4.8,
    reviewsCount: 5210,
    badge: "Best Seller",
    inStock: true,
    isFlashSale: true,
    emiStarting: 5416,
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80"
    ],
    reviews: [
      {
        id: 301,
        author: "Deepak Verma",
        rating: 5,
        date: "Yesterday",
        comment: "100W charging charges from 1% to 100% in 25 minutes! Hasselblad camera colors are gorgeous.",
        verified: true,
        helpful: 51,
        photos: [
          "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=300&q=80"
        ]
      },
      {
        id: 302,
        author: "Kavita Reddy",
        rating: 4.8,
        date: "4 days ago",
        comment: "Super smooth OxygenOS experience with zero lag during heavy gaming sessions.",
        verified: true,
        helpful: 22,
        photos: []
      }
    ],
    colors: ["#111111", "#10b981"],
    specs: {
      Processor: "Snapdragon 8 Gen 3",
      Camera: "50MP Sony LYT-808 + 64MP 3x Periscope",
      Charging: "100W SUPERVOOC + 50W Wireless AIRVOOC",
      Display: "6.82-inch 2K 120Hz ProXDR AMOLED 4500 nits"
    },
    description: "Smooth Beyond Belief. 4th Gen Hasselblad Camera System for Mobile, 5400mAh dual-cell battery, 100W charging fills battery in 26 mins."
  },

  /* ---------------- Footwear / Shoes Section ---------------- */
  {
    id: 19,
    name: "Nike Air Max Flyknit Ultra Running Shoes for Men",
    brand: "Nike",
    category: "Footwear",
    price: 8995,
    originalPrice: 11995,
    rating: 4.9,
    reviewsCount: 4210,
    badge: "Top Seller",
    inStock: true,
    isFlashSale: true,
    emiStarting: 749,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80"
    ],
    reviews: [
      {
        id: 401,
        author: "Siddharth Das",
        rating: 5,
        date: "3 days ago",
        comment: "Extremely comfortable for daily morning runs. The Air Max heel bubble absorbs heel impact completely.",
        verified: true,
        helpful: 39,
        photos: [
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=300&q=80"
        ]
      },
      {
        id: 402,
        author: "Aman Gupta",
        rating: 5,
        date: "1 week ago",
        comment: "100% original Nike product! Flyknit material breathes well even in hot weather.",
        verified: true,
        helpful: 17,
        photos: []
      }
    ],
    colors: ["#ef4444", "#09090b", "#ffffff"],
    specs: {
      Material: "Breathable Flyknit Fabric Upper",
      Sole: "Full-Length Air Max Cushioning Unit",
      Closure: "Lace-Up Ergonomic Fit",
      Activity: "Road Running, Gym & Casual Wear"
    },
    description: "Maximum responsiveness and impact absorption. Breathable Flyknit upper wraps your foot like a sock with iconic visible Air Max heel unit."
  },

  /* ---------------- Sunglasses Section ---------------- */
  {
    id: 23,
    name: "Ray-Ban Aviator Classic UV400 Polarized Sunglasses",
    brand: "Ray-Ban",
    category: "Sunglasses",
    price: 7490,
    originalPrice: 8990,
    rating: 4.9,
    reviewsCount: 5120,
    badge: "Iconic Style",
    inStock: true,
    isFlashSale: false,
    emiStarting: 624,
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=800&q=80"
    ],
    reviews: [
      {
        id: 501,
        author: "Manish Kapoor",
        rating: 5,
        date: "4 days ago",
        comment: "Classic Ray-Ban perfection! Polarized G-15 glass cuts highway sun glare completely during road trips.",
        verified: true,
        helpful: 45,
        photos: [
          "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=300&q=80"
        ]
      },
      {
        id: 502,
        author: "Neha Sen",
        rating: 5,
        date: "2 weeks ago",
        comment: "Sturdy gold frame and came with original leather case and cleaning cloth.",
        verified: true,
        helpful: 21,
        photos: []
      }
    ],
    colors: ["#eab308", "#000000"],
    specs: {
      Frame: "Monel Metal Gold Plated Frame",
      Lens: "G-15 Crystal Green Polarized Glass",
      Protection: "100% UV400 Protection Against Glare"
    },
    description: "The world's most iconic sunglasses model. Classic teardrop shape originally designed for aviator pilots with crystal clear G-15 polarized lenses."
  },

  /* ---------------- Women's Fashion & Dresses Section ---------------- */
  {
    id: 25,
    name: "Zara Women's Elegant Floral Tiered Summer Maxi Dress",
    brand: "Zara",
    category: "Women's Fashion",
    price: 2499,
    originalPrice: 3999,
    rating: 4.8,
    reviewsCount: 1840,
    badge: "New Season",
    inStock: true,
    isFlashSale: true,
    emiStarting: null,
    image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80"
    ],
    reviews: [
      {
        id: 601,
        author: "Ananya Deshmukh",
        rating: 5,
        date: "2 days ago",
        comment: "Wore this for a beach vacation photoshoot and received so many compliments! Fabric is super soft rayon.",
        verified: true,
        helpful: 62,
        photos: [
          "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=300&q=80"
        ]
      },
      {
        id: 602,
        author: "Pooja Hegde",
        rating: 4.5,
        date: "6 days ago",
        comment: "Lovely flowy fit with smocked back elasticity. True to size!",
        verified: true,
        helpful: 31,
        photos: []
      }
    ],
    colors: ["#ec4899", "#38bdf8"],
    specs: {
      Fabric: "100% Breathable Soft Viscose Rayon",
      Length: "Ankle Length Tiered Flare Maxi",
      Occasion: "Summer Beach, Vacation, Brunch & Party Wear"
    },
    description: "Flowy, flattering tiered maxi dress featuring romantic pastel floral prints. Breathable fabric keeps you cool and elegant all day long."
  },

  /* ---------------- Furniture Section ---------------- */
  {
    id: 32,
    name: "Ergonomic High-Back Executive Mesh Office Chair with Lumbar Support",
    brand: "TechHub Home",
    category: "Furniture",
    price: 9999,
    originalPrice: 14999,
    rating: 4.8,
    reviewsCount: 2150,
    badge: "Top Ergonomic",
    inStock: true,
    isFlashSale: true,
    emiStarting: 833,
    image: "https://images.unsplash.com/photo-1580481072645-022f9a6d1270?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1580481072645-022f9a6d1270?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=800&q=80"
    ],
    reviews: [
      {
        id: 701,
        author: "Tushar Joshi",
        rating: 5,
        date: "1 week ago",
        comment: "Solved my lower back pain after 10 hours of WFH coding every day. Lumbar support and headrest adjustment work perfectly.",
        verified: true,
        helpful: 58,
        photos: [
          "https://images.unsplash.com/photo-1580481072645-022f9a6d1270?auto=format&fit=crop&w=300&q=80"
        ]
      },
      {
        id: 702,
        author: "Meera Menon",
        rating: 5,
        date: "2 weeks ago",
        comment: "High quality aluminum base and smooth rolling wheels. Easy 15-minute assembly.",
        verified: true,
        helpful: 26,
        photos: []
      }
    ],
    colors: ["#000000", "#334155"],
    specs: {
      Support: "Adjustable 2D Lumbar Support + 3D Armrests",
      Headrest: "Height & Angle Adjustable Headrest",
      Mechanism: "Heavy Duty Synchronous Tilt & Multi-Lock"
    },
    description: "Engineered for 12+ hours of posture comfort. Breathable Korean mesh backrest keeps you cool while relieving spinal stress during work."
  },

  /* ---------------- Vegetables & Groceries ---------------- */
  {
    id: 35,
    name: "Organic Farm Fresh Daily Vegetable Combo Basket (5kg Assorted)",
    brand: "Organic Fresh",
    category: "Vegetables & Groceries",
    price: 499,
    originalPrice: 699,
    rating: 4.9,
    reviewsCount: 9420,
    badge: "Farm Fresh",
    inStock: true,
    isFlashSale: true,
    emiStarting: null,
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=800&q=80"
    ],
    reviews: [
      {
        id: 801,
        author: "Sunita Agarwal",
        rating: 5,
        date: "Yesterday",
        comment: "Crisp, super fresh vegetables delivered within 3 hours! Tomatoes and spinach were extremely fresh.",
        verified: true,
        helpful: 74,
        photos: [
          "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=300&q=80"
        ]
      },
      {
        id: 802,
        author: "Rajesh Kulkarni",
        rating: 5,
        date: "3 days ago",
        comment: "Great eco-friendly cotton packaging and genuine organic produce.",
        verified: true,
        helpful: 31,
        photos: []
      }
    ],
    colors: [],
    specs: {
      Contents: "Tomato 1kg, Potato 1kg, Onion 1kg, Capsicum 500g, Carrot 500g, Spinach 500g, Coriander & Chili Pack",
      Quality: "100% Organic Pesticide-Free Handpicked"
    },
    description: "Freshly harvested from local organic farms every morning. Carefully washed, sanitized, and packed in eco-friendly breathable cotton bags."
  }
];
