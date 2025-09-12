// frontend/src/App.js

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react'; // useRef ni qo'shing
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import toast, { Toaster } from 'react-hot-toast';

// frontend/src/App.js

// frontend/src/App.js

// frontend/src/App.js
const API_URL = '/api';

// const API_URL = process.env.REACT_APP_API_URL || 'https://sizning-backend-nomingiz.up.railway.app/api';
const INITIAL_LOAD_COUNT = 16;
const LOAD_MORE_COUNT = 8;

// --- Komponentlar ---


// ALMASHTIRING (butun Header komponentini)

const Header = ({ favoritesCount, onViewFavorites, showingFavorites, searchTerm, onSearchChange, specialFilter, onSpecialFilterChange }) => (
    <header>
        {/* YUQORI QATOR: LOGO VA TUGMALAR */}
        <nav>
            <a href="/" className="logo" onClick={(e) => { e.preventDefault(); window.location.reload(); }}>
                <span>I</span>ndress
            </a>

            {/* Kompyuter uchun tugmalar */}
            <div className="special-filters-desktop">
                <button
                    className={`special-filter-btn ${specialFilter === 'discounted' ? 'active' : ''}`}
                    onClick={() => onSpecialFilterChange('discounted')}
                >
                    Chegirmadagilar
                </button>
                <button
                    className={`special-filter-btn ${specialFilter === 'new' ? 'active' : ''}`}
                    onClick={() => onSpecialFilterChange('new')}
                >
                    Yangi tovarlar
                </button>
            </div>

            <div className="icon-links">
                <a href="https://t.me/indress_uz" target="_blank" rel="noopener noreferrer" className="header-icon-link" title="Telegram">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13M22 2L15 22L11 13L2 9L22 2Z"></path></svg>
                </a>
                <a href="https://maps.google.com/maps?q=41.244261,69.168558&ll=41.244261,69.168558&z=16" target="_blank" rel="noopener noreferrer" className="header-icon-link" title="Manzil">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                </a>
                <button className={`favorites-btn ${showingFavorites ? 'active' : ''}`} onClick={onViewFavorites}>
                    <span className="heart-icon">♥</span>
                    <span className="favorites-text">Sevimlilar</span>
                    {favoritesCount > 0 && <span className="favorites-count">{favoritesCount}</span>}
                </button>
            </div>
        </nav>

        {/* PASTKI QATOR: FAQAT MOBIL UCHUN QIDIRUV VA FILTRLAR */}
        <div className="mobile-controls-container">
            <div className="search-container-mobile">
                <div className="search-wrapper">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="search-icon"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    <input type="text" placeholder="Qidirish..." value={searchTerm} onChange={onSearchChange} />
                </div>
            </div>
            <div className="special-filters-mobile">
                <select
                    value={specialFilter}
                    onChange={(e) => onSpecialFilterChange(e.target.value)}
                    className="special-filter-select"
                >
                    <option value="none">Filtrlar</option>
                    <option value="discounted">Chegirmadagilar</option>
                    <option value="new">Yangi tovarlar</option>
                </select>
            </div>
        </div>
    </header>
);
const Hero = () => (
    <section className="hero">
        <div className="hero-content">
            <h1>O‘z biznesingizni rivojlantiring!</h1>
            <p>Eng so‘nggi kolleksiyalar, hamyonbop narx va sifat kafolati — kiyim-kechak optom savdosi uchun eng yaxshi manzil.</p>
            <a href="#products" className="cta-button">Kolleksiyani ko'rish</a>
        </div>
    </section>
);
// ALMASHTIRING
const Footer = () => (
    <footer className="site-footer">
        <div className="footer-content">
            <div className="footer-logo">
                <span>I</span>ndress
            </div>
            <div className="footer-socials">
                <a
                    href="https://t.me/indress_uz"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Telegram Kanalimiz"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13M22 2L15 22L11 13L2 9L22 2Z"></path></svg>
                </a>
                <a
                    href="https://maps.google.com/maps?q=41.244261,69.168558&ll=41.244261,69.168558&z=16"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Bizning manzil"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                </a>


                {/* <a href="https://instagram.com/your_account" target="_blank" rel="noopener noreferrer" title="Instagram">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </a> */}

            </div>
            <div className="footer-bottom">
                &copy; {new Date().getFullYear()} Indress. Barcha huquqlar himoyalangan. ✨ Dasturchi muallif — 947779891
            </div>
        </div>
    </footer>
);



const ProductCard = ({ productGroup, isFavorite, onToggleFavorite, onOrder, onViewDetails }) => {
    const { name, price, variants, sku, status, promoPrice } = productGroup;
    const [currentIndex, setCurrentIndex] = useState(0);

    if (!variants || variants.length === 0) return null;

    const currentVariant = variants[currentIndex];

    let discountPercent = 0;
    if (promoPrice && price > promoPrice) {
        discountPercent = Math.round(((price - promoPrice) / price) * 100);
    }

    const handleFavoriteClick = (e) => { e.stopPropagation(); onToggleFavorite(sku); };
    const handleOrderClick = (e) => { e.stopPropagation(); onOrder(productGroup, currentVariant); };
    const handleNextVariant = (e) => { e.stopPropagation(); setCurrentIndex(p => (p + 1) % variants.length); };
    const handlePrevVariant = (e) => { e.stopPropagation(); setCurrentIndex(p => (p - 1 + variants.length) % variants.length); };
    const handleColorDotClick = (e, index) => { e.stopPropagation(); setCurrentIndex(index); };

    return (
        <div className="product-card" onClick={() => onViewDetails(productGroup, currentVariant)}>
            <div className="product-image">
                {/* Chap burchak uchun yangi konteyner */}
                <div className="top-left-badges">
                    {status === 'yangi' && <div className="new-product-badge">Yangi</div>}
                    {discountPercent > 0 && <div className="discount-badge">-{discountPercent}%</div>}
                </div>

                {/* Sevimlilar tugmasi eski joyiga qaytdi */}
                <button className={`favorite-btn ${isFavorite ? 'active' : ''}`} onClick={handleFavoriteClick}>♥</button>

                <LazyLoadImage
                    alt={name}
                    src={currentVariant.img}
                    effect="blur"
                    width="100%"
                    height="100%"
                    style={{ objectFit: 'cover' }}
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/300x400.png?text=Rasm+yo\'q'; }}
                />

                {variants.length > 1 && (
                    <div className="variant-switcher">
                        <button onClick={handlePrevVariant}>‹</button>
                        <button onClick={handleNextVariant}>›</button>
                    </div>
                )}
            </div>
            <div className="product-info">

                  <h4>{name}</h4>
                <div className="product-sku">Kod: {sku}</div>

                <div className="product-price">
                    {discountPercent > 0 ? (
                        <>
                            <span className="original-price">{price.toLocaleString('uz-UZ')} so'm</span>
                            <span className="promo-price">{promoPrice.toLocaleString('uz-UZ')} so'm</span>
                        </>
                    ) : (
                        <span>{price > 0 ? `${price.toLocaleString('uz-UZ')} so'm` : "Narxi belgilanmagan"}</span>
                    )}
                </div>

                <div className="variant-colors">
                    {variants.map((v, i) => (
                        <span key={v.id} className={`color-dot ${i === currentIndex ? 'active' : ''}`} title={v.color} onClick={(e) => handleColorDotClick(e, i)}></span>
                    ))}
                </div>
                <button className="order-btn" onClick={handleOrderClick}>🛒 Buyurtma berish</button>
            </div>
        </div>
    );
};
// BU KODNI ESKI OrderModal O'RNIGA QO'YING
const ContactModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const contacts = [
        { username: 'BAHROM405', name: 'Bahrom' },
        { username: 'INDRESS_UZB', name: 'Jahongir' },
        { username: 'bakhrom_ilkhomovich', name: 'Fayzullo' }
    ];

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content contact-modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>✕</button>
                <h2>Buyurtma uchun bog'laning</h2>
                <p>Savollaringiz bo‘lsa, quyidagi menejerlardan biriga yozishingiz mumkin. Avval rasmni skreen qilib oling.</p>
                <div className="contact-links-list">
                    {contacts.map(contact => (
                        <a
                            key={contact.username}
                            href={`https://t.me/${contact.username}`}
                            className="contact-link"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13M22 2L15 22L11 13L2 9L22 2Z"></path></svg>
                            <span>{contact.name}</span>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
};

const ProductDetailModal = ({ isOpen, onClose, product, selectedVariant: initialVariant, onOrder }) => {
    const [currentVariant, setCurrentVariant] = useState(initialVariant);

    useEffect(() => {
        setCurrentVariant(initialVariant);
    }, [initialVariant]);

    if (!isOpen || !product || !currentVariant) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content product-detail-modal" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>✕</button>
                <div className="detail-layout">
                    <div className="detail-image-gallery">
                        <img src={currentVariant.img} alt={`${product.name} - ${currentVariant.color}`} />
                    </div>
                    <div className="detail-info">
                        <h2>{product.name}</h2>
                        <span className="detail-sku">Artikul: {product.sku}</span>
                        <div className="detail-price">{product.price > 0 ? `${product.price.toLocaleString('uz-UZ')} so'm` : "Narxi belgilanmagan"}</div>
                        <p className="detail-description">Bu mahsulot yuqori sifatli matodan tayyorlangan bo'lib, har qanday ob-havoda sizga qulaylik bag'ishlaydi.</p>

                        <div className="detail-variants">
                            <h4>Ranglar:</h4>
                            <div className="variant-colors">
                                {product.variants.map((v) => (
                                    <span key={v.id}
                                        className={`color-dot ${v.id === currentVariant.id ? 'active' : ''}`}
                                        title={v.color}
                                        onClick={() => setCurrentVariant(v)}
                                    ></span>
                                ))}
                            </div>
                            <p>Tanlangan rang: <strong>{currentVariant.color}</strong></p>
                            <p>Omborda: <strong>{currentVariant.stock} dona</strong></p>
                        </div>

                        <button className="order-btn detail-order-btn" onClick={() => { onClose(); onOrder(product, currentVariant); }}>
                            🛒 Buyurtma berish
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Asosiy Ilova ---

function App() {

    const [specialFilter, setSpecialFilter] = useState('none'); // 'none', 'new', 'discounted'
    const [products, setProducts] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('all');
    const [showingFavorites, setShowingFavorites] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isContactModalOpen, setContactModalOpen] = useState(false);
    const [detailModal, setDetailModal] = useState({ isOpen: false, product: null, variant: null });
    const [visibleCount, setVisibleCount] = useState(INITIAL_LOAD_COUNT);

// ALMASHTIRING (eski useEffect'ni shu yangisi bilan)

    const filterContainerRef = useRef(null);

  useEffect(() => {
      const el = filterContainerRef.current;
      if (!el) return;

      // Animatsiyani to'xtatish/davom ettirish uchun
      const handleMouseEnter = () => el.classList.add('is-hovered');
      const handleMouseLeave = () => el.classList.remove('is-hovered');

      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);

      // Cheksiz skroll mantig'i
      let isScrolling;
      const handleScroll = () => {
          // Skroll tugashini kutish uchun
          window.clearTimeout(isScrolling);
          isScrolling = setTimeout(() => {
              const scrollWidth = el.scrollWidth; // Lentaning to'liq uzunligi
              const scrollLeft = el.scrollLeft;   // Hozirgi skroll pozitsiyasi
              const clientWidth = el.clientWidth; // Ko'rinib turgan qismining kengligi
              const itemWidth = scrollWidth / 2;  // Bitta to'plamning uzunligi

              // Agar o'ngga surib, oxirgi 1 pikselga yetsa
              if (scrollLeft + clientWidth >= scrollWidth - 1) {
                  // Sekin o'tish effektini vaqtincha o'chiramiz
                  el.style.scrollBehavior = 'auto';
                  // Boshiga o'tkazib qo'yamiz
                  el.scrollLeft = itemWidth - clientWidth;
                  // Effektni qayta yoqamiz
                  el.style.scrollBehavior = 'smooth';
              }
              // Agar chapga surib, birinchi to'plamning boshiga yetsa
              else if (scrollLeft <= 0) {
                  el.style.scrollBehavior = 'auto';
                  el.scrollLeft = itemWidth;
                  el.style.scrollBehavior = 'smooth';
              }
          }, 150); // Skroll tugagandan 150ms keyin ishlaydi
      };

      el.addEventListener('scroll', handleScroll);


      el.scrollLeft = el.scrollWidth / 2;

      // Tozalash funksiyasi
      return () => {
          el.removeEventListener('mouseenter', handleMouseEnter);
          el.removeEventListener('mouseleave', handleMouseLeave);
          el.removeEventListener('scroll', handleScroll);
      };
  }, [showingFavorites, products]);
    // Ma'lumotlarni yuklash
    useEffect(() => {
        const loadData = async () => {
            try {
                const [productsRes, favoritesRes] = await Promise.all([
                    fetch(`${API_URL}/products`),
                    fetch(`${API_URL}/favorites`)
                ]);
                if (!productsRes.ok) throw new Error("Serverdan ma'lumot olishda xatolik.");
                const productsData = await productsRes.json();
                const favoritesData = favoritesRes.ok ? await favoritesRes.json() : [];
                setProducts(productsData);
                setFavorites(favoritesData);
            } catch (err) {
                setError(err.message);
                toast.error(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);


    const handleSpecialFilterChange = (type) => {
        // Agar bosilgan filtr yana bosilsa, uni o'chiramiz
        setSpecialFilter(prev => prev === type ? 'none' : type);
        // Boshqa filtrlarni tozalaymiz
        setFilter('all');
        setShowingFavorites(false);
    };
    // "Lazy Scroll" uchun
    const handleScroll = useCallback(() => {
        if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 500) {
            setVisibleCount(prevCount => prevCount + LOAD_MORE_COUNT);
        }
    }, []);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    // Sevimlilar bilan ishlash
    const handleToggleFavorite = async (sku) => {
        try {
            const response = await fetch(`${API_URL}/favorites/toggle`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sku })
            });
            if (response.ok) {
                const { favorites: newFavorites, isFavorite } = await response.json();
                setFavorites(newFavorites);
                toast.success(isFavorite ? 'Sevimlilarga qoʻshildi' : 'Sevimlilardan olib tashlandi', { duration: 1500 });
            }
        } catch (error) {
            toast.error("Xatolik yuz berdi.");
        }
    };

    const handleViewFavorites = () => {
    setShowingFavorites(!showingFavorites);
    setFilter('all');
    setSearchTerm('');
    setSpecialFilter('none'); // QO'SHILDI
};

    const handleOrder = () => setContactModalOpen(true);
    const handleViewDetails = (product, variant) => setDetailModal({ isOpen: true, product, variant });

    // Filtrlash va qidiruv logikasi
    // ALMASHTIRING
    const categories = useMemo(() => {
        const hiddenCategories = ['Boshqalar', 'Хлопок/Лайкра'];
        const allCats = ['all', ...new Set(products.map(p => p.subCategory))];
        return allCats.filter(cat => !hiddenCategories.includes(cat));
    }, [products]);

      const displayedProducts = useMemo(() => {
          let tempProducts = products;

          // 1. Maxsus filtrni qo'llaymiz
          if (specialFilter === 'new') {
              tempProducts = tempProducts.filter(p => p.status === 'yangi');
          } else if (specialFilter === 'discounted') {
              tempProducts = tempProducts.filter(p => p.promoPrice && p.promoPrice > 0);
          }

          // 2. Sevimlilar filtrini qo'llaymiz
          if (showingFavorites) {
              tempProducts = tempProducts.filter(p => favorites.includes(p.sku));
          }

          // 3. Kategoriya filtrini qo'llaymiz
          if (filter !== 'all') {
              tempProducts = tempProducts.filter(p => p.subCategory === filter);
          }

          // 4. Qidiruv filtrini qo'llaymiz
          if (searchTerm) {
              const search = searchTerm.toLowerCase();
              tempProducts = tempProducts.filter(p => p.name.toLowerCase().includes(search) || p.sku.toLowerCase().includes(search));
          }

          return tempProducts;
      }, [products, favorites, filter, showingFavorites, searchTerm, specialFilter]);

    return (
        <div className="App">
            <Toaster position="bottom-center" toastOptions={{
                style: { background: '#334155', color: '#f8fafc' },
            }} />

              <Header
                  favoritesCount={favorites.length}
                  onViewFavorites={handleViewFavorites}
                  showingFavorites={showingFavorites}
                  searchTerm={searchTerm}
                  onSearchChange={(e) => setSearchTerm(e.target.value)}
                  specialFilter={specialFilter}
                  onSpecialFilterChange={handleSpecialFilterChange}
              />
            {!showingFavorites && <Hero />}
            <main>
                <section id="products" className="section">
                    <h2>{showingFavorites ? 'Sevimli Mahsulotlar' : 'Bizning Mahsulotlar'}</h2>
                    {showingFavorites && (
                        <button onClick={handleViewFavorites} className="back-to-products-btn">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="19" y1="12" x2="5" y2="12"></line>
                                <polyline points="12 19 5 12 12 5"></polyline>
                            </svg>
                            Barcha mahsulotlarga qaytish
                        </button>
                    )}

                      {!showingFavorites && (
                          <div className="filter-buttons-container" ref={filterContainerRef}> {/* Yaratilgan yangi konteyner */}
                              <div className="filter-buttons">
                                  {/* Tugmalarning birinchi to'plami */}
                                  {categories.map(cat => (
                                      <button
                                          key={cat}
                                          className={`filter-btn ${filter === cat ? 'active' : ''}`}
                                          onClick={() => setFilter(cat)}
                                      >
                                          {cat === 'all' ? 'Umummiy' : cat}
                                      </button>
                                  ))}
                                  {/* Animatsiya uzluksiz bo'lishi uchun ikkinchi to'plam */}
                                  {categories.map(cat => (
                                      <button
                                          key={`${cat}-duplicate`}
                                          className={`filter-btn ${filter === cat ? 'active' : ''}`}
                                          onClick={() => {
                                              setFilter(cat);
                                              setSpecialFilter('none');
                                          }}
                                      >
                                          {cat === 'all' ? 'Umummiy' : cat}
                                      </button>
                                  ))}
                              </div>
                          </div>
                      )}
                    {isLoading && <div className="loading-container"><div className="loading-spinner"></div><p>Yuklanmoqda...</p></div>}
                    {error && <div className="error-container"><h3>Xatolik: {error}</h3></div>}
                    {!isLoading && !error && (
                        displayedProducts.length > 0 ? (
                            <div className="products-grid">
                                {displayedProducts.slice(0, visibleCount).map(group => (
                                    <ProductCard
                                        key={group.sku}
                                        productGroup={group}
                                        isFavorite={favorites.includes(group.sku)}
                                        onToggleFavorite={handleToggleFavorite}
                                        onOrder={handleOrder}
                                        onViewDetails={handleViewDetails}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="empty-state">
                                <div className="empty-icon">{showingFavorites ? '♥' : '📦'}</div>
                                <h3>{showingFavorites ? "Sevimli mahsulotlar yo'q" : "Hech narsa topilmadi"}</h3>
                                <p>{showingFavorites ? "Yurakcha tugmasini bosing" : "Qidiruv yoki filtrlarni o'zgartirib ko'ring"}</p>
                            </div>
                        )
                    )}
                </section>
            </main>
            <Footer />
            <ContactModal
                isOpen={isContactModalOpen}
                onClose={() => setContactModalOpen(false)}
            />
            <ProductDetailModal
                isOpen={detailModal.isOpen}
                onClose={() => setDetailModal({ isOpen: false, product: null, variant: null })}
                product={detailModal.product}
                selectedVariant={detailModal.variant}
                onOrder={handleOrder}
            />
        </div>
    );
}

export default App;
