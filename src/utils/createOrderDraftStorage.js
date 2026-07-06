const STORAGE_KEY = "abhicares_admin_create_order_draft_v1";

const hasDraftData = (cart, draft) =>
  Array.isArray(cart?.items) && cart.items.length > 0
    ? true
    : Boolean(
        draft?.customerId ||
          draft?.selectedAddress ||
          draft?.selectedCategory ||
          draft?.selectedService ||
          draft?.couponCode,
      );

export const loadCreateOrderDraftState = () => {
  if (typeof window === "undefined") return undefined;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return undefined;

    const parsed = JSON.parse(raw);

    return {
      cart: {
        items: Array.isArray(parsed?.cart?.items) ? parsed.cart.items : [],
      },
      createOrderDraft: parsed?.createOrderDraft || undefined,
    };
  } catch (error) {
    console.warn("Failed to restore create-order draft", error);
    return undefined;
  }
};

export const saveCreateOrderDraftState = (state) => {
  if (typeof window === "undefined") return;

  const payload = {
    cart: {
      items: state?.cart?.items || [],
    },
    createOrderDraft: state?.createOrderDraft || {},
  };

  try {
    if (!hasDraftData(payload.cart, payload.createOrderDraft)) {
      window.localStorage.removeItem(STORAGE_KEY);
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (error) {
    console.warn("Failed to persist create-order draft", error);
  }
};

export const clearCreateOrderDraftState = () => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
};
