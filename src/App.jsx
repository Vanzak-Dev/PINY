import { useEffect, useState } from "react";
import AdminPage from "./pages/AdminPage";
import AnnouncementBar from "./components/global/AnnouncementBar";
import Header from "./components/global/Header";
import CartDrawer from "./components/cart/CartDrawer";
import Footer from "./sections/global/Footer";
import Home from "./pages/Home";
import ProductPage from "./pages/ProductPage";
import { CartProvider, useCart } from "./hooks/useCart";

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

  if (pathname.startsWith("/admin")) return <AdminPage />;

  const page = pathname.startsWith("/produtos/")
    ? <ProductPage productIdentifier={decodeURIComponent(pathname.split("/produtos/")[1])} />
    : <Home />;

  return (
    <CartProvider>
      <AppContent pathname={pathname} page={page} />
    </CartProvider>
  );
}

function AppContent({ page }) {
  const cart = useCart();

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
        discount={cart.discount}
        total={cart.total}
        remainingForGift={cart.remainingForGift}
        giftProgress={cart.giftProgress}
      />
      <Footer />
    </>
  );
}
