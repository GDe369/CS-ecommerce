import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-hot-toast";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Khởi tạo giỏ hàng từ localStorage
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem("tech3d_cart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("Lỗi đọc giỏ hàng:", error);
      return [];
    }
  });

  // Đồng bộ hóa với localStorage
  useEffect(() => {
    localStorage.setItem("tech3d_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // 1. Thêm vào giỏ hàng
  const addToCart = (product, quantity = 1) => {
    setCartItems((prev) => {
      const isExist = prev.find((item) => item.id === product.id);

      if (isExist) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }
      return [...prev, { ...product, quantity }];
    });
    toast.success(`Đã thêm ${product.name} vào giỏ!`);
  };

  // 2. CẬP NHẬT: Xóa sản phẩm khỏi giỏ (Dùng cho nút Trash2)
  const removeFromCart = (id) => {
    const itemToRemove = cartItems.find((item) => item.id === id);
    setCartItems((prev) => prev.filter((item) => item.id !== id));
    if (itemToRemove) {
      toast.error(`Đã xóa ${itemToRemove.name}`);
    }
  };

  // 3. CẬP NHẬT: Tăng/Giảm số lượng (Dùng cho nút Plus/Minus)
  const updateQuantity = (id, amount) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQty = item.quantity + amount;
          // Không cho phép số lượng < 1
          return { ...item, quantity: newQty > 0 ? newQty : 1 };
        }
        return item;
      }),
    );
  };

  // 4. CẬP NHẬT: Làm sạch giỏ hàng (Dùng sau khi thanh toán)
  const clearCart = () => {
    setCartItems([]);
  };

  // Tính toán tổng số lượng và tổng tiền
  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart, // Thêm vào value
        updateQuantity, // Thêm vào value
        clearCart, // Thêm vào value
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
