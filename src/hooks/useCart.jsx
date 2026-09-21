import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { parsePrice } from '../lib/formatPrice';

const CartContext = createContext(null);

const GIFT_THRESHOLD = 150;
const COUPONS = { PINY10: 0.1 };

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const addItem = useCallback((product, quantity = 1) => {
    const selectedQty = product?.selectedQuantity;
    const qty = selectedQty ? Number(selectedQty.quantity) || 1 : quantity;
    const unitPrice = selectedQty
      ? parsePrice(selectedQty.price) / qty
      : parsePrice(product.price);
    const cleanProduct = selectedQty
      ? (() => { const { selectedQuantity, ...rest } = product; return rest; })()
      : product;

    setItems((current) => {
      const existing = current.find((entry) => entry.product.id === cleanProduct.id);
      if (existing) {
        return current.map((entry) => (entry.product.id === cleanProduct.id
          ? { ...entry, quantity: entry.quantity + qty }
          : entry));
      }
      return [...current, { product: cleanProduct, quantity: qty, unitPrice }];
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((productId) => {
    setItems((current) => current.filter((entry) => entry.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId, delta) => {
    setItems((current) => current
      .map((entry) => (entry.product.id === productId
        ? { ...entry, quantity: entry.quantity + delta }
        : entry))
      .filter((entry) => entry.quantity > 0));
  }, []);

  const applyCoupon = useCallback(() => {
    const normalized = couponCode.trim().toUpperCase();
    setAppliedCoupon(COUPONS[normalized] ? { code: normalized, rate: COUPONS[normalized] } : null);
  }, [couponCode]);

  const subtotal = useMemo(
    () => items.reduce((sum, { product, quantity, unitPrice }) =>
      sum + (unitPrice ?? parsePrice(product.price)) * quantity, 0),
    [items],
  );
  const discount = appliedCoupon ? subtotal * appliedCoupon.rate : 0;
  const total = Math.max(subtotal - discount, 0);
  const remainingForGift = Math.max(GIFT_THRESHOLD - subtotal, 0);
  const giftProgress = Math.min(subtotal / GIFT_THRESHOLD, 1);

  const value = useMemo(() => ({
    items,
    isOpen,
    open,
    close,
    addItem,
    removeItem,
    updateQuantity,
    couponCode,
    setCouponCode,
    appliedCoupon,
    applyCoupon,
    subtotal,
    discount,
    total,
    remainingForGift,
    giftProgress,
    giftThreshold: GIFT_THRESHOLD,
  }), [items, isOpen, open, close, addItem, removeItem, updateQuantity, couponCode, appliedCoupon, applyCoupon, subtotal, discount, total, remainingForGift, giftProgress]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart deve ser usado dentro de um CartProvider');
  return context;
}
