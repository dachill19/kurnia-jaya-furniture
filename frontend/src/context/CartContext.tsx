import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from "react";

// Interface CartItem
export interface CartItem {
    id: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (item: Omit<CartItem, "quantity">) => void;
    removeFromCart: (itemId: string) => void;
    updateQuantity: (itemId: string, quantity: number) => void;
    clearCart: () => void;
    totalItems: number;
    totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [cart, setCart] = useState<CartItem[]>([]);
    const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;

    // Fetch cart data from backend when component mounts
    useEffect(() => {
        const fetchCart = async () => {
            if (!token) return; // Skip if not logged in

            try {
                const res = await fetch("http://localhost:5000/api/cart", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (res.ok) {
                    const data = await res.json();
                    setCart(data.cartItems || []);
                } else {
                    console.warn("Gagal fetch cart:", res.status);
                }
            } catch (err) {
                console.error("Error saat fetch cart:", err);
            }
        };

        fetchCart();
    }, [token]);

    const fetchUpdatedCart = async () => {
        if (!token) return;

        const res = await fetch("http://localhost:5000/api/cart", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (res.ok) {
            const data = await res.json();
            setCart(data.cartItems || []);
        }
    };

    const addToCart = async (item: Omit<CartItem, "quantity">) => {
        if (!token) return;

        await fetch("http://localhost:5000/api/cart", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ ...item, quantity: 1 }),
        });

        await fetchUpdatedCart();
    };

    const removeFromCart = async (itemId: string) => {
        if (!token) return;

        await fetch(`http://localhost:5000/api/cart/${itemId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        await fetchUpdatedCart();
    };

    const updateQuantity = async (itemId: string, quantity: number) => {
        if (!token) return;

        if (quantity <= 0) {
            await removeFromCart(itemId);
            return;
        }

        await fetch(`http://localhost:5000/api/cart/${itemId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ quantity }),
        });

        await fetchUpdatedCart();
    };

    const clearCart = async () => {
        if (!token) return;

        await fetch(`http://localhost:5000/api/cart/clear`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        setCart([]);
    };

    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    const totalPrice = cart.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                totalItems,
                totalPrice,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = (): CartContextType => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};
