import React, { createContext, useState, useContext } from 'react';

// 1. Crear el contexto
const CartContext = createContext();

// 2. Hook personalizado para usarlo fácil
export const useCart = () => {
  return useContext(CartContext);
};

// 3. El Proveedor (Provider) que envuelve la app
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Función para AÑADIR al carrito
  const addToCart = (product, quantity) => {
    // Revisa si el producto ya existe
    const existingItem = cartItems.find((i) => i.product.product_id === product.product_id);

    if (existingItem) {
      // Si existe, actualiza la cantidad
      setCartItems(
        cartItems.map((i) =>
          i.product.product_id === product.product_id
            ? { ...i, quantity: i.quantity + quantity }
            : i
        )
      );
    } else {
      // Si es nuevo, lo añade al array
      setCartItems([...cartItems, { product, quantity }]);
    }
    // (Opcional) Notificar al usuario
    console.log(`${quantity} ${product.name} añadido(s) al carrito!`);
  };

  // Función para ACTUALIZAR cantidad (desde la página del carrito)
  const updateQuantity = (productId, newQuantity) => {
    // Si la cantidad es 0 o menos, lo elimina
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      setCartItems(
        cartItems.map((i) =>
          i.product.product_id === productId ? { ...i, quantity: newQuantity } : i
        )
      );
    }
  };

  // Función para ELIMINAR del carrito
  const removeFromCart = (productId) => {
    setCartItems(cartItems.filter((i) => i.product.product_id !== productId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // 4. Exponer los items y las funciones
  const value = {
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};