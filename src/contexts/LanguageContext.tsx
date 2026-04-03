import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'en' | 'hi' | 'te';

export const LANGUAGE_LABELS: Record<Language, string> = {
  en: 'English',
  hi: 'हिंदी',
  te: 'తెలుగు',
};

const translations = {
  // Auth
  'auth.title': { en: 'AI Powered Retail', hi: 'AI संचालित रिटेल', te: 'AI ఆధారిత రిటైల్' },
  'auth.subtitle': { en: "For India's Smart Shopkeepers", hi: 'भारत के स्मार्ट दुकानदारों के लिए', te: 'భారతదేశ స్మార్ట్ దుకాణదారుల కోసం' },
  'auth.login': { en: 'Login', hi: 'लॉगिन', te: 'లాగిన్' },
  'auth.signup': { en: 'Sign Up', hi: 'साइन अप', te: 'సైన్ అప్' },
  'auth.fullName': { en: 'Full Name', hi: 'पूरा नाम', te: 'పూర్తి పేరు' },
  'auth.email': { en: 'Email', hi: 'ईमेल', te: 'ఇమెయిల్' },
  'auth.password': { en: 'Password', hi: 'पासवर्ड', te: 'పాస్‌వర్డ్' },
  'auth.iAmA': { en: 'I am a:', hi: 'मैं हूँ:', te: 'నేను:' },
  'auth.shopkeeper': { en: 'Shopkeeper', hi: 'दुकानदार', te: 'దుకాణదారు' },
  'auth.customer': { en: 'Customer', hi: 'ग्राहक', te: 'కస్టమర్' },
  'auth.createAccount': { en: 'Create Account', hi: 'खाता बनाएं', te: 'ఖాతా సృష్టించండి' },
  'auth.quickDemo': { en: 'Quick Demo Access', hi: 'त्वरित डेमो', te: 'త్వరిత డెమో' },
  'auth.tryShopkeeper': { en: '🏪 Try Shopkeeper', hi: '🏪 दुकानदार बनें', te: '🏪 దుకాణదారుగా ప్రయత్నించండి' },
  'auth.tryCustomer': { en: '🛍️ Try Customer', hi: '🛍️ ग्राहक बनें', te: '🛍️ కస్టమర్‌గా ప్రయత్నించండి' },
  'auth.welcomeBack': { en: 'Welcome back! 🎉', hi: 'वापसी पर स्वागत! 🎉', te: 'తిరిగి స్వాగతం! 🎉' },
  'auth.accountCreated': { en: 'Account created! 🚀', hi: 'खाता बनाया! 🚀', te: 'ఖాతా సృష్టించబడింది! 🚀' },
  'auth.invalidCreds': { en: 'Invalid credentials', hi: 'अमान्य क्रेडेंशियल', te: 'చెల్లని ఆధారాలు' },
  'auth.emailExists': { en: 'Email already exists', hi: 'ईमेल पहले से मौजूद है', te: 'ఇమెయిల్ ఇప్పటికే ఉంది' },
  'auth.or': { en: 'OR', hi: 'या', te: 'లేదా' },

  // Nav / Sidebar
  'nav.dashboard': { en: 'Dashboard', hi: 'डैशबोर्ड', te: 'డాష్‌బోర్డ్' },
  'nav.inventory': { en: 'Inventory', hi: 'इन्वेंटरी', te: 'ఇన్వెంటరీ' },
  'nav.billing': { en: 'Billing', hi: 'बिलिंग', te: 'బిల్లింగ్' },
  'nav.transactions': { en: 'Transactions', hi: 'लेनदेन', te: 'లావాదేవీలు' },
  'nav.alerts': { en: 'Alerts', hi: 'अलर्ट', te: 'హెచ్చరికలు' },
  'nav.home': { en: 'Home', hi: 'होम', te: 'హోమ్' },
  'nav.search': { en: 'Search', hi: 'खोजें', te: 'శోధన' },
  'nav.cart': { en: 'Cart', hi: 'कार्ट', te: 'కార్ట్' },
  'nav.profile': { en: 'Profile', hi: 'प्रोफाइल', te: 'ప్రొఫైల్' },
  'nav.shopkeeperPanel': { en: 'Shopkeeper Panel', hi: 'दुकानदार पैनल', te: 'దుకాణదారు ప్యానెల్' },
  'nav.welcome': { en: 'Welcome', hi: 'स्वागत', te: 'స్వాగతం' },
  'nav.online': { en: 'Online', hi: 'ऑनलाइन', te: 'ఆన్‌లైన్' },
  'nav.offlineMode': { en: 'Offline Mode', hi: 'ऑफलाइन मोड', te: 'ఆఫ్‌లైన్ మోడ్' },
  'nav.offline': { en: 'Offline', hi: 'ऑफलाइन', te: 'ఆఫ్‌లైన్' },
  'nav.logout': { en: 'Logout', hi: 'लॉगआउट', te: 'లాగ్అవుట్' },

  // Dashboard
  'dash.totalRevenue': { en: 'Total Revenue', hi: 'कुल राजस्व', te: 'మొత్తం ఆదాయం' },
  'dash.products': { en: 'Products', hi: 'उत्पाद', te: 'ఉత్పత్తులు' },
  'dash.totalSales': { en: 'Total Sales', hi: 'कुल बिक्री', te: 'మొత్తం అమ్మకాలు' },
  'dash.lowStock': { en: 'Low Stock', hi: 'कम स्टॉक', te: 'తక్కువ స్టాక్' },
  'dash.salesTrend': { en: '📈 Sales Trend (Weekly)', hi: '📈 बिक्री ट्रेंड (साप्ताहिक)', te: '📈 అమ్మకాల ట్రెండ్ (వారపు)' },
  'dash.topProducts': { en: '🏆 Top Products', hi: '🏆 शीर्ष उत्पाद', te: '🏆 టాప్ ఉత్పత్తులు' },
  'dash.aiInsights': { en: '🧠 AI Insights', hi: '🧠 AI अंतर्दृष्टि', te: '🧠 AI అంతర్దృష్టులు' },
  'dash.allGood': { en: 'All good! No insights right now.', hi: 'सब ठीक! अभी कोई अंतर्दृष्टि नहीं।', te: 'అంతా బాగానే ఉంది! ప్రస్తుతం ఇన్‌సైట్స్ లేవు.' },

  // Inventory
  'inv.searchProducts': { en: 'Search products...', hi: 'उत्पाद खोजें...', te: 'ఉత్పత్తులు శోధించండి...' },
  'inv.addProduct': { en: 'Add Product', hi: 'उत्पाद जोड़ें', te: 'ఉత్పత్తి జోడించండి' },
  'inv.editProduct': { en: 'Edit Product', hi: 'उत्पाद संपादित करें', te: 'ఉత్పత్తి సవరించండి' },
  'inv.productName': { en: 'Product Name', hi: 'उत्पाद का नाम', te: 'ఉత్పత్తి పేరు' },
  'inv.price': { en: 'Price (₹)', hi: 'कीमत (₹)', te: 'ధర (₹)' },
  'inv.quantity': { en: 'Quantity', hi: 'मात्रा', te: 'పరిమాణం' },
  'inv.category': { en: 'Category', hi: 'श्रेणी', te: 'వర్గం' },
  'inv.expiryDate': { en: 'Expiry Date', hi: 'समाप्ति तिथि', te: 'గడువు తేదీ' },
  'inv.barcode': { en: 'Barcode (optional)', hi: 'बारकोड (वैकल्पिक)', te: 'బార్‌కోడ్ (ఐచ్ఛికం)' },
  'inv.updateProduct': { en: 'Update Product', hi: 'उत्पाद अपडेट करें', te: 'ఉత్పత్తి నవీకరించండి' },
  'inv.productAdded': { en: 'Product added! 🎉', hi: 'उत्पाद जोड़ा! 🎉', te: 'ఉత్పత్తి జోడించబడింది! 🎉' },
  'inv.productUpdated': { en: 'Product updated! ✅', hi: 'उत्पाद अपडेट! ✅', te: 'ఉత్పత్తి నవీకరించబడింది! ✅' },
  'inv.productDeleted': { en: 'Product deleted', hi: 'उत्पाद हटाया', te: 'ఉత్పత్తి తొలగించబడింది' },
  'inv.inStock': { en: 'in stock', hi: 'स्टॉक में', te: 'స్టాక్‌లో' },
  'inv.sold': { en: 'sold', hi: 'बिका', te: 'అమ్ముడు' },
  'inv.voiceInput': { en: '🎤 Voice input simulation – say the item name!', hi: '🎤 वॉयस इनपुट – आइटम का नाम बोलें!', te: '🎤 వాయిస్ ఇన్‌పుట్ – ఐటెమ్ పేరు చెప్పండి!' },
  'inv.barcodeScanner': { en: '📷 Barcode scanner simulation activated!', hi: '📷 बारकोड स्कैनर सिमुलेशन!', te: '📷 బార్‌కోడ్ స్కానర్ సిమ్యులేషన్!' },
  'inv.name': { en: 'Name', hi: 'नाम', te: 'పేరు' },
  'inv.qty': { en: 'Qty', hi: 'मात्रा', te: 'పరిమాణం' },

  // Billing
  'bill.searchProduct': { en: 'Search product to add...', hi: 'जोड़ने के लिए उत्पाद खोजें...', te: 'జోడించడానికి ఉత్పత్తి శోధించండి...' },
  'bill.currentBill': { en: 'Current Bill', hi: 'वर्तमान बिल', te: 'ప్రస్తుత బిల్లు' },
  'bill.customerName': { en: 'Customer Name', hi: 'ग्राहक का नाम', te: 'కస్టమర్ పేరు' },
  'bill.addItems': { en: 'Add items to create bill', hi: 'बिल बनाने के लिए आइटम जोड़ें', te: 'బిల్లు సృష్టించడానికి ఐటెమ్‌లు జోడించండి' },
  'bill.subtotal': { en: 'Subtotal', hi: 'उपयोग', te: 'ఉప మొత్తం' },
  'bill.gst': { en: 'GST (5%)', hi: 'जीएसटी (5%)', te: 'GST (5%)' },
  'bill.total': { en: 'Total', hi: 'कुल', te: 'మొత్తం' },
  'bill.generateBill': { en: 'Generate Bill 🧾', hi: 'बिल बनाएं 🧾', te: 'బిల్లు తయారు చేయండి 🧾' },
  'bill.taxInvoice': { en: 'Tax Invoice', hi: 'कर चालान', te: 'పన్ను ఇన్వాయిస్' },
  'bill.thankYou': { en: 'Thank you! 🙏', hi: 'धन्यवाद! 🙏', te: 'ధన్యవాదాలు! 🙏' },
  'bill.print': { en: 'Print', hi: 'प्रिंट', te: 'ప్రింట్' },
  'bill.whatsapp': { en: 'WhatsApp', hi: 'व्हाट्सएप', te: 'వాట్సాప్' },
  'bill.newBill': { en: 'New Bill', hi: 'नया बिल', te: 'కొత్త బిల్లు' },
  'bill.generated': { en: 'Bill generated! 🧾', hi: 'बिल बनाया! 🧾', te: 'బిల్లు తయారు! 🧾' },
  'bill.addNameItems': { en: 'Add customer name and items', hi: 'ग्राहक का नाम और आइटम जोड़ें', te: 'కస్టమర్ పేరు, ఐటెమ్‌లు జోడించండి' },
  'bill.whatsappSim': { en: '📱 WhatsApp sharing simulation!', hi: '📱 व्हाट्सएप शेयरिंग!', te: '📱 వాట్సాప్ షేరింగ్!' },
  'bill.left': { en: 'left', hi: 'बचे', te: 'మిగిలినవి' },
  'bill.each': { en: 'each', hi: 'प्रत्येक', te: 'ప్రతి' },

  // Transactions
  'txn.searchByCustomer': { en: 'Search by customer or date...', hi: 'ग्राहक या तिथि से खोजें...', te: 'కస్టమర్ లేదా తేదీ ద్వారా శోధించండి...' },
  'txn.noTransactions': { en: 'No transactions found', hi: 'कोई लेनदेन नहीं मिला', te: 'లావాదేవీలు కనుగొనబడలేదు' },
  'txn.tax': { en: 'Tax', hi: 'कर', te: 'పన్ను' },

  // Alerts
  'alert.title': { en: 'Notifications & Alerts', hi: 'सूचनाएं और अलर्ट', te: 'నోటిఫికేషన్లు & హెచ్చరికలు' },
  'alert.allClear': { en: 'All Clear!', hi: 'सब ठीक है!', te: 'అంతా బాగానే ఉంది!' },
  'alert.noAlerts': { en: 'No alerts right now.', hi: 'अभी कोई अलर्ट नहीं।', te: 'ప్రస్తుతం హెచ్చరికలు లేవు.' },
  'alert.critical': { en: '🚨 Critical Alerts', hi: '🚨 गंभीर अलर्ट', te: '🚨 క్రిటికల్ హెచ్చరికలు' },
  'alert.warnings': { en: '⚠️ Warnings', hi: '⚠️ चेतावनियां', te: '⚠️ హెచ్చరికలు' },
  'alert.insights': { en: 'ℹ️ Insights', hi: 'ℹ️ अंतर्दृष्टि', te: 'ℹ️ అంతర్దృష్టులు' },

  // Customer
  'cust.namaste': { en: 'Namaste! 🙏', hi: 'नमस्ते! 🙏', te: 'నమస్తే! 🙏' },
  'cust.findEverything': { en: 'Find everything you need', hi: 'अपनी ज़रूरत की हर चीज़ पाएं', te: 'మీకు అవసరమైన ప్రతిదీ కనుగొనండి' },
  'cust.searchProducts': { en: '🔍 Search products...', hi: '🔍 उत्पाद खोजें...', te: '🔍 ఉత్పత్తులు శోధించండి...' },
  'cust.categories': { en: 'Categories', hi: 'श्रेणियां', te: 'వర్గాలు' },
  'cust.popularItems': { en: 'Popular Items', hi: 'लोकप्रिय आइटम', te: 'ప్రముఖ ఐటెమ్‌లు' },
  'cust.youMayLike': { en: 'You May Also Like', hi: 'आपको यह भी पसंद आ सकता है', te: 'మీకు ఇవి కూడా నచ్చవచ్చు' },
  'cust.add': { en: 'Add', hi: 'जोड़ें', te: 'జోడించు' },
  'cust.outOfStock': { en: 'Out of stock', hi: 'स्टॉक में नहीं', te: 'స్టాక్ అయిపోయింది' },
  'cust.onlyLeft': { en: 'Only {n} left!', hi: 'केवल {n} बचे!', te: 'కేవలం {n} మిగిలినవి!' },
  'cust.inStock': { en: 'In Stock', hi: 'स्टॉक में', te: 'స్టాక్‌లో ఉంది' },
  'cust.addedToCart': { en: 'added to cart', hi: 'कार्ट में जोड़ा', te: 'కార్ట్‌కు జోడించబడింది' },
  'cust.searchTitle': { en: 'Search Products', hi: 'उत्पाद खोजें', te: 'ఉత్పత్తులు శోధించండి' },
  'cust.noProducts': { en: 'No products found', hi: 'कोई उत्पाद नहीं मिला', te: 'ఉత్పత్తులు కనుగొనబడలేదు' },

  // Cart
  'cart.myCart': { en: 'My Cart', hi: 'मेरा कार्ट', te: 'నా కార్ట్' },
  'cart.empty': { en: 'Cart is empty', hi: 'कार्ट खाली है', te: 'కార్ట్ ఖాళీగా ఉంది' },
  'cart.addItemsToStart': { en: 'Add items to get started!', hi: 'शुरू करने के लिए आइटम जोड़ें!', te: 'ప్రారంభించడానికి ఐటెమ్‌లు జోడించండి!' },
  'cart.frequentlyBought': { en: '🤝 Frequently Bought Together', hi: '🤝 अक्सर साथ खरीदे जाते हैं', te: '🤝 తరచుగా కలిసి కొనుగోలు చేయబడతాయి' },
  'cart.checkout': { en: 'Checkout', hi: 'चेकआउट', te: 'చెకౌట్' },
  'cart.orderConfirmed': { en: 'Order Confirmed!', hi: 'ऑर्डर कन्फ़र्म!', te: 'ఆర్డర్ నిర్ధారించబడింది!' },
  'cart.orderId': { en: 'Order ID', hi: 'ऑर्डर आईडी', te: 'ఆర్డర్ ID' },
  'cart.showQR': { en: 'Show this QR to the shopkeeper', hi: 'यह QR दुकानदार को दिखाएं', te: 'ఈ QR దుకాణదారుకు చూపించండి' },
  'cart.done': { en: 'Done', hi: 'हो गया', te: 'పూర్తయింది' },
  'cart.orderPlaced': { en: 'Order placed! 🎉', hi: 'ऑर्डर दिया गया! 🎉', te: 'ఆర్డర్ ఇవ్వబడింది! 🎉' },

  // Profile
  'prof.orders': { en: 'Orders', hi: 'ऑर्डर', te: 'ఆర్డర్లు' },
  'prof.totalSpent': { en: 'Total Spent', hi: 'कुल खर्च', te: 'మొత్తం ఖర్చు' },
  'prof.orderHistory': { en: 'Order History', hi: 'ऑर्डर इतिहास', te: 'ఆర్డర్ చరిత్ర' },
  'prof.noOrders': { en: 'No orders yet', hi: 'अभी कोई ऑर्डर नहीं', te: 'ఇంకా ఆర్డర్లు లేవు' },
  'prof.language': { en: 'Language', hi: 'भाषा', te: 'భాష' },

  // Common
  'common.all': { en: 'All', hi: 'सभी', te: 'అన్నీ' },

  // Categories
  'cat.Grains': { en: 'Grains', hi: 'अनाज', te: 'ధాన్యాలు' },
  'cat.Pulses': { en: 'Pulses', hi: 'दालें', te: 'పప్పులు' },
  'cat.Dairy': { en: 'Dairy', hi: 'डेयरी', te: 'డెయిరీ' },
  'cat.Snacks': { en: 'Snacks', hi: 'स्नैक्स', te: 'స్నాక్స్' },
  'cat.Essentials': { en: 'Essentials', hi: 'आवश्यक', te: 'అవసరాలు' },
  'cat.Household': { en: 'Household', hi: 'घरेलू', te: 'గృహ సామాగ్రి' },
  'cat.Condiments': { en: 'Condiments', hi: 'मसाले', te: 'సుగంధ ద్రవ్యాలు' },
  'cat.Beverages': { en: 'Beverages', hi: 'पेय पदार्थ', te: 'పానీయాలు' },
  'cat.Fruits': { en: 'Fruits', hi: 'फल', te: 'పండ్లు' },
  'cat.Vegetables': { en: 'Vegetables', hi: 'सब्जियां', te: 'కూరగాయలు' },
} as const;

type TranslationKey = keyof typeof translations;

interface LanguageContextType {
  lang: Language;
  setLang: (l: Language) => void;
  t: (key: TranslationKey, replacements?: Record<string, string | number>) => string;
  tCat: (category: string) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Language>(() => {
    return (localStorage.getItem('six_lang') as Language) || 'en';
  });

  useEffect(() => {
    localStorage.setItem('six_lang', lang);
  }, [lang]);

  const t = (key: TranslationKey, replacements?: Record<string, string | number>): string => {
    const entry = translations[key];
    if (!entry) return key;
    let text: string = entry[lang] || entry['en'];
    if (replacements) {
      Object.entries(replacements).forEach(([k, v]) => {
        text = text.replace(`{${k}}`, String(v));
      });
    }
    return text;
  };

  const tCat = (category: string): string => {
    const key = `cat.${category}` as TranslationKey;
    const entry = translations[key];
    return entry ? (entry[lang] || entry['en']) : category;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, tCat }}>
      {children}
    </LanguageContext.Provider>
  );
};
