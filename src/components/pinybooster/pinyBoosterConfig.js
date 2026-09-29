/**
 * Product configuration for the Piny Booster funnel (FunnelStep7).
 * Packs, pricing, checkout URLs, and product images.
 */
import { ASSETS } from "@/components/config/assets";

export const PINY_BOOSTER_CONFIG = {
  productImages: [ASSETS.products.kit21days],

  packs: [
    {
      qty: 1,
      originalPrice: 89.9,
      price: 89.9,
      tag: "",
      checkoutUrl: "#checkout-1",
      consumerWeek: {},
    },
    {
      qty: 2,
      originalPrice: 179.8,
      price: 149.9,
      tag: "ECONOMIA",
      checkoutUrl: "#checkout-2",
      consumerWeek: {
        brinde: true,
        brindeImage: ASSETS.products.mask,
        giftText: "",
      },
    },
    {
      qty: 3,
      originalPrice: 269.7,
      price: 219.9,
      tag: "MAIS VENDIDO",
      checkoutUrl: "#checkout-3",
      consumerWeek: {
        brinde: true,
        brindeImage: ASSETS.products.mask,
        giftText: "4ª Máscara PINY grátis de brinde",
      },
    },
  ],
};
