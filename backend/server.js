// backend/server.js

// --- 1. KERAKLI KUTUBXONALARNI CHAQIRISH ---
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const cron = require('node-cron');
require('dotenv').config();

// --- 2. ASOSIY SOZLAMALAR ---
const app = express();
const PORT = process.env.PORT || 3000;
const JSON_FILE_PATH = path.join(__dirname, 'data', 'products.json');
const FAVORITES_FILE_PATH = path.join(__dirname, 'data', 'favorites.json');
const ADMIN_BASE = "https://api-admin.billz.ai";
const SECRET_TOKEN = process.env.BILLZ_SECRET_TOKEN;


// --- 3. KESH (XOTIRA) ---
let cachedProducts = null;

// =================================================================
// 4. BILLZ API'DAN MA'LUMOT OLISH VA SAQLASH BO'LIMI
// =================================================================

async function loginAdmin() {
    console.log("Billz API'ga kirilmoqda...");
    const response = await axios.post(`${ADMIN_BASE}/v1/auth/login`, { secret_token: SECRET_TOKEN });
    const token = response.data?.data?.access_token;
    if (!token) throw new Error("API'ga kirishda xatolik: token olinmadi.");
    console.log("✅ Kirish muvaffaqiyatli.");
    return token;
}

async function fetchAllProductsFromAPI(token) {
    let allProducts = [];
    let page = 1;
    const maxPages = 2000; // Har ehtimolga qarshi cheklov
    while (page <= maxPages) {
        console.log(`- API'dan sahifa ${page} olinmoqda...`);
        const response = await axios.get(`${ADMIN_BASE}/v2/products`, {
            params: { limit: 200, page },
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const items = response.data?.products || [];
        if (items.length === 0) break;
        allProducts.push(...items);
        console.log(`Sahifa ${page} — ${items.length} ta mahsulot olindi, jami: ${allProducts.length}`);
        page++;
    }
    return allProducts;
}

// =================================================================
// 5. MA'LUMOTLARNI QAYTA ISHLASH BO'LIMI (YANGILANDI!)
// =================================================================

function normalize(str) {
    return str ? str.trim().toLowerCase() : '';
}

// Sanani to'g'ri formatga o'tkazuvchi funksiya (dd.mm.yyyy -> Date object)
function parseDate(dateStr) {
    if (!dateStr || typeof dateStr !== 'string') return null;
    const match = dateStr.match(/(\d{2})\.(\d{2})\.(\d{4})/);
    if (!match) return null;
    const [, day, month, year] = match;
    const date = new Date(`${year}-${month}-${day}`);
    // Agar sana noto'g'ri bo'lsa (masalan 32.13.2024), Invalid Date qaytaradi
    return isNaN(date.getTime()) ? null : date;
}

// ALMASHTIRING (faqat simplifyProduct funksiyasini)

function simplifyProduct(product) {
    const customFields = product.custom_fields || [];
    const getCustomField = (name) => {
        const field = customFields.find(f => normalize(f.custom_field_name) === normalize(name));
        return field?.custom_field_value || null;
    };

    const priceInfo = product.shop_prices?.[0];
    const totalStock = (product.shop_measurement_values || []).reduce((sum, s) => sum + (s.active_measurement_value || 0), 0);
    const dateField = getCustomField("Дата");

    let retailPrice = priceInfo?.retail_price || 0;
    let promoPrice = null;

    // Aksiya narxini tekshirish
    if (priceInfo && priceInfo.promos && priceInfo.promos.length > 0) {
        // Agar aksiya bo'lsa va promo_price mavjud bo'lsa, uni olamiz
        if (priceInfo.promo_price) {
            promoPrice = priceInfo.promo_price;
        }
    }

    return {
        id: product.id,
        sku: product.sku || `no-sku-${product.id}`,
        name: product.name,
        brand: product.brand_name || null, // Brend nomini qo'shamiz
        img: product.main_image_url_full || null,
        subCategory: getCustomField("Подкатегория")?.trim() || "Boshqalar",
        color: getCustomField("Цвет")?.trim() || "Noma'lum",
        price: retailPrice, // Bu asosiy (eski) narx
        promoPrice: promoPrice, // Bu aksiya narxi (bo'lmasa null)
        stock: totalStock,
        date: parseDate(dateField),
    };
}



// ALMASHTIRING (faqat processProducts funksiyasini)

function processProducts(rawProducts) {
    console.log("\n--- MA'LUMOTLARNI QAYTA ISHLASH BOSHLANDI ---");
    console.log(`1. Boshlang'ich mahsulotlar soni: ${rawProducts.length}`);

    const simplifiedProducts = rawProducts.map(simplifyProduct);
    const filteredVariants = simplifiedProducts.filter(variant => variant.stock > 3);
    console.log(`2. Qoldig'i > 3 bo'yicha filtrlangan VARIANTLAR soni: ${filteredVariants.length}`);

    const groupedBySku = filteredVariants.reduce((acc, p) => {
        const key = normalize(p.sku);
        if (!key || key.startsWith('no-sku')) return acc;

        if (!acc[key]) {
            // Brend nomini tekshirib, formatlab, 'name' maydoniga yozamiz
            const displayName = p.brand
                ? `⚜️ ${p.brand.toUpperCase()} ⚜️`
                : p.name.split('.')[0]; // Agar brend bo'lmasa, eski nomini olamiz

            acc[key] = {
                sku: p.sku,
                name: displayName, // Natijaviy nom shu yerda o'rnatiladi
                subCategory: p.subCategory,
                price: p.price,
                promoPrice: p.promoPrice,
                date: p.date,
                variants: [],
            };
        }
        acc[key].variants.push({ id: p.id, color: p.color, img: p.img, stock: p.stock });
        return acc;
    }, {});
    console.log(`3. Guruhlashdan so'ng ARTIKULLAR soni: ${Object.keys(groupedBySku).length}`);

    let finalProducts = Object.values(groupedBySku);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    finalProducts = finalProducts.map(group => {
        let status = null;
        if (group.date) {
            const diffTime = today - group.date;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if (diffDays >= 0 && diffDays < 20) {
                status = 'yangi';
            }
        }
        return { ...group, status };
    });

    finalProducts.sort((a, b) => {
        if (a.status === 'yangi' && b.status !== 'yangi') return -1;
        if (a.status !== 'yangi' && b.status === 'yangi') return 1;
        if (a.date && b.date) return b.date - a.date;
        return 0;
    });

    console.log(`4. "Yangi" status qo'shildi va saralandi. Yakuniy ARTIKUL soni: ${finalProducts.length}`);
    console.log("--- QAYTA ISHLASH TUGADI ---\n");

    cachedProducts = finalProducts;
    return finalProducts;
}



async function loadFavorites() {
    try {
        const content = await fs.readFile(FAVORITES_FILE_PATH, 'utf-8');
        return JSON.parse(content);
    } catch (error) {
        return [];
    }
}

async function saveFavorites(favorites) {
    try {
        await fs.mkdir(path.dirname(FAVORITES_FILE_PATH), { recursive: true });
        await fs.writeFile(FAVORITES_FILE_PATH, JSON.stringify(favorites, null, 2));
    } catch (error) {
        console.error("Sevimlilarni saqlashda xatolik:", error);
    }
}

// --- API Endpoints ---
app.use(cors());
app.use(express.json());

app.get('/api/products', (req, res) => {
    if (cachedProducts) {
        return res.json(cachedProducts);
    }
    res.status(500).json({ error: "Ma'lumotlar hali keshlanmagan. Iltimos, birozdan so'ng urinib ko'ring." });
});


app.get('/api/favorites', async (req, res) => {
    const favorites = await loadFavorites();
    res.json(favorites);
});

app.post('/api/favorites/toggle', async (req, res) => {
    const { sku } = req.body;
    if (!sku) return res.status(400).json({ error: "SKU ko'rsatilmagan" });
    let favorites = await loadFavorites();
    const index = favorites.indexOf(sku);
    let isFavorite = false;
    if (index > -1) {
        favorites.splice(index, 1);
    } else {
        favorites.push(sku);
        isFavorite = true;
    }
    await saveFavorites(favorites);
    res.json({ favorites, isFavorite });
});

if (process.env.NODE_ENV === 'production') {
    // Frontend'ning qurilgan (build) papkasini statik fayl manbai sifatida belgilaymiz
    app.use(express.static(path.join(__dirname, '..', 'frontend', 'build')));

    // API so'rovlaridan boshqa har qanday so'rovni (masalan, /about, /products/123)
    // React'ning index.html fayliga yo'naltiramiz. Bu client-side routing uchun kerak.
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '..', 'frontend', 'build', 'index.html'));
    });
}
// --- Avtomatik Yangilash (Cron Job) ---
async function runFetchAndUpdate() {
    console.log(`\n[${new Date().toLocaleString()}] Avtomatik yangilanish jarayoni boshlandi...`);
    try {
        const token = await loginAdmin();
        const rawProducts = await fetchAllProductsFromAPI(token);
        await fs.mkdir(path.dirname(JSON_FILE_PATH), { recursive: true });
        await fs.writeFile(JSON_FILE_PATH, JSON.stringify(rawProducts, null, 2));
        console.log(`✅ ${rawProducts.length} ta xom ma'lumot saqlandi.`);
        processProducts(rawProducts);
    } catch (err) {
        console.error("❌ Avtomatik yangilanishda xatolik:", err.message);
    }
}

// Faylning eng pastki qismiga o'ting

async function main() {

    await runFetchAndUpdate();

    if (process.argv[2] === 'fetch') {
        console.log("Fetch buyrug'i yakunlandi. Dasturdan chiqilmoqda.");
        process.exit();
    }


    cron.schedule('*/15 5-18 * * *', runFetchAndUpdate, {
        scheduled: true,
        timezone: "Asia/Tashkent"
    });
    console.log("✅ Avtomatik yangilanish jadvali (har 15 daqiqada, 5:00-19:00) yoqildi.");

    app.listen(PORT, () => {
        console.log(`\n🚀 Backend server http://localhost:${PORT} manzilida ishga tushdi.`);
    });
}

main().catch(err => {
    console.error("Dastur ishga tushishida kritik xatolik:", err);
    process.exit(1);
});

