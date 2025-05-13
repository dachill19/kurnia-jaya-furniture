import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from "react";
import axios from "axios";

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
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    totalItems: number;
    totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [token, setToken] = useState<string | null>(null);

    // Dapatkan token hanya sekali saat mount
    useEffect(() => {
        const savedToken =
            typeof window !== "undefined"
                ? localStorage.getItem("token") ||
                  sessionStorage.getItem("token")
                : null;
        setToken(savedToken);
    }, []);

    const axiosInstance = axios.create({
        baseURL: "http://localhost:5000/api",
    });

    // Mapping data dari backend ke bentuk CartItem
    const mapCartItems = (items: any[]): CartItem[] => {
        return items.map((item: any) => ({
            id: item.product.id,
            name: item.product.name,
            price: item.product.discountPrice ?? item.product.price,
            image:
                item.product.images.find((img: any) => img.isMain)?.imageUrl ??
                item.product.images[0]?.imageUrl ??
                "",
            quantity: item.quantity,
        }));
    };

    const fetchCart = async (token: string) => {
        try {
            const res = await axiosInstance.get("/cart", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setCart(mapCartItems(res.data || []));
        } catch (err) {
            console.error("Error saat fetch cart:", err);
        }
    };

    useEffect(() => {
        if (token) {
            fetchCart(token);
        }
    }, [token]);

    const fetchUpdatedCart = async () => {
        if (!token) return;

        try {
            const res = await axiosInstance.get("/cart", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setCart(mapCartItems(res.data || []));
        } catch (err) {
            console.error("Gagal memperbarui cart:", err);
        }
    };

    const addToCart = async (item: Omit<CartItem, "quantity">) => {
        if (!token) return;

        try {
            await axiosInstance.post(
                "/cart",
                { productId: item.id, quantity: 1 },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            await fetchUpdatedCart();
        } catch (err) {
            console.error("Gagal menambahkan item:", err);
        }
    };

    const removeFromCart = async (productId: string) => {
        if (!token) return;

        try {
            await axiosInstance.delete(`/cart/product/${productId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            await fetchUpdatedCart();
        } catch (err) {
            console.error("Gagal menghapus item:", err);
        }
    };

    const updateQuantity = async (productId: string, quantity: number) => {
        if (!token) return;

        try {
            if (quantity <= 0) {
                await removeFromCart(productId);
                return;
            }

            await axiosInstance.put(
                `/cart/product/${productId}`,
                { quantity },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            await fetchUpdatedCart();
        } catch (err) {
            console.error("Gagal mengupdate jumlah:", err);
        }
    };

    const clearCart = async () => {
        if (!token) return;

        try {
            await axiosInstance.delete("/cart/clear", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setCart([]);
        } catch (err) {
            console.error("Gagal menghapus semua cart:", err);
        }
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
