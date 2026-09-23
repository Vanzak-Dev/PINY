import { useEffect, useState } from "react";
import AdminPage from "./pages/AdminPage";
import AnnouncementBar from "./components/global/AnnouncementBar";
import Footer from "./sections/global/Footer";
import Home from "./pages/Home";
import ProductPage from "./pages/ProductPage";
import CartDrawer from "./components/cart/CartDrawer";
import { CartProvider, useCart } from "./hooks/useCart";

function CartDrawerContainer() {
  const cart = useCart();

  return (
    <CartDrawer
      isOpen={cart.isOpen}
      onClose={cart.close}
      onAdd={cart.addItem}
      items={cart.items}
      onRemoveItem={cart.removeItem}
      onUpdateQuantity={cart.updateQuantity}
      couponCode={cart.couponCode}
      onCouponCodeChange={cart.setCouponCode}
      onApplyCoupon={cart.applyCoupon}
      subtotal={cart.subtotal}
      discount={cart.discount}
      total={cart.total}
      remainingForGift={cart.remainingForGift}
      giftProgress={cart.giftProgress}
    />
  );
}

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

  if (pathname.startsWith("/admin")) return <AdminPage />;

  const page = pathname.startsWith("/produtos/")
    ? <ProductPage productIdentifier={decodeURIComponent(pathname.split("/produtos/")[1])} />
    : <Home />;

  return (
    <CartProvider>
      <AnnouncementBar />
      {page}
      <Footer />
      <CartDrawerContainer />
    </CartProvider>
  );
}
