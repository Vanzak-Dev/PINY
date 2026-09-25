import { useCallback, useEffect, useState } from "react";
import AdminPage from "./pages/AdminPage";
import AnnouncementBar from "./components/global/AnnouncementBar";
import Header from "./components/global/Header";
import CartDrawer from "./components/cart/CartDrawer";
import Footer from "./sections/global/Footer";
import Home from "./pages/Home";
import ProductPage from "./pages/ProductPage";
import SearchResultsPage from "./pages/SearchResultsPage";
import { CartProvider, useCart } from "./hooks/useCart";
import SkinAnalysisTest from "./pages/skin-analysis/SkinAnalysisTest";
import SkinAnalysisHome from "./pages/skin-analysis/SkinAnalysisHome";

export default function App() {
  const [pathname, setPathname] = useState(window.location.pathname);

  useEffect(() => {
    const updatePathname = () => setPathname(window.location.pathname);
    const routeObserver = window.setInterval(updatePathname, 100);
    window.addEventListener("popstate", updatePathname);
    return () => {
      window.clearInterval(routeObserver);
      window.removeEventListener("popstate", updatePathname);
    };
  }, []);

  useEffect(() => {
    let ticking = false;
    const updateScroll = () => {
      const isHome = window.location.pathname === "/" || window.location.pathname === "";
      document.documentElement.style.setProperty(
        "--scroll",
        isHome ? Math.min(window.scrollY / (window.innerHeight * 0.4), 1) : "1",
      );
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateScroll);
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    updateScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const isHome = pathname === "/" || pathname === "";
    document.documentElement.style.setProperty(
      "--scroll",
      isHome ? Math.min(window.scrollY / (window.innerHeight * 0.4), 1) : "1",
    );
  }, [pathname]);

  if (pathname.startsWith("/skin-analysis-test")) return <SkinAnalysisTest />;
  if (pathname === "/skin-analysis") return <SkinAnalysisHome />;
  if (pathname.startsWith("/admin")) return <AdminPage />;

  const page = pathname.startsWith("/produtos/")
    ? <ProductPage productIdentifier={decodeURIComponent(pathname.split("/produtos/")[1])} />
    : pathname.startsWith("/pesquisa")
    ? <SearchResultsPage query={new URLSearchParams(window.location.search).get("q") || ""} />
    : <Home />;

  return (
    <CartProvider>
      <AppContent page={page} />
    </CartProvider>
  );
}

function AppContent({ page }) {
  const cart = useCart();
  const [isCheckingOut, setCheckingOut] = useState(false);

  const handleCheckout = useCallback(async () => {
    if (cart.items.length === 0 || isCheckingOut) return;
    setCheckingOut(true);
    try {
      const items = cart.items.map(({ product, quantity }) => ({
        sku: product.sku,
        quantity,
        name: product.name,
        price: product.price,
      }));
      const res = await fetch("/api/yampi/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const data = await res.json();
      if (data.success && data.checkout_url) {
        window.location.href = data.checkout_url;
      } else {
        alert(data.error || "Erro ao criar checkout na Yampi.");
      }
    } catch {
      alert("Erro de conexão ao finalizar compra.");
    } finally {
      setCheckingOut(false);
    }
  }, [cart.items, isCheckingOut]);

  return (
    <>
      <AnnouncementBar />
      <Header />
      {page}
      <CartDrawer
        isOpen={cart.isOpen}
        onClose={cart.close}
        items={cart.items}
        onRemoveItem={cart.removeItem}
        onUpdateQuantity={cart.updateQuantity}
        onAdd={cart.addItem}
        couponCode={cart.couponCode}
        onCouponCodeChange={cart.setCouponCode}
        onApplyCoupon={cart.applyCoupon}
        subtotal={cart.subtotal}
        discount={cart.discount}
        total={cart.total}
        remainingForGift={cart.remainingForGift}
        giftProgress={cart.giftProgress}
        onCheckout={handleCheckout}
        isCheckingOut={isCheckingOut}
      />
      <Footer />
    </>
  );
}
