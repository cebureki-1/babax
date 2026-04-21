import { useEffect, useState } from "react";

export function Cart() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(data);
  }, []);

  function updateQty(id, qty) {
    const updated = cart.map(item =>
      item.id === id
        ? { ...item, quantity: Math.max(1, qty) }
        : item
    );

    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  }

  function removeItem(id) {
    const updated = cart.filter(item => item.id !== id);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  }

  const total = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  if (cart.length === 0) {
    return (
      <div className="p-10 text-center text-gray-500">
        Корзина пуста 🛒
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-2xl font-bold mb-6">Корзина</h1>

        <div className="bg-white rounded-2xl shadow p-6 space-y-4">

          {cart.map(item => (
            <div
              key={item.id}
              className="flex justify-between items-center border-b pb-4"
            >
              {/* INFO */}
              <div>
                <h2 className="font-semibold">{item.name}</h2>
                <p className="text-sm text-gray-500">
                  {item.price} ₸
                </p>
              </div>

              {/* CONTROLS */}
              <div className="flex items-center gap-3">

                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) =>
                    updateQty(item.id, Number(e.target.value))
                  }
                  className="w-16 px-2 py-1 border rounded-lg"
                />

                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-500 text-sm"
                >
                  Удалить
                </button>

              </div>

              {/* TOTAL */}
              <div className="font-semibold">
                {item.price * item.quantity} ₸
              </div>
            </div>
          ))}

          {/* TOTAL BLOCK */}
          <div className="flex justify-between items-center pt-4">
            <span className="text-lg font-semibold">Итого:</span>
            <span className="text-2xl font-bold text-blue-600">
              {total} ₸
            </span>
          </div>

          {/* CHECKOUT BUTTON */}
          <button className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition">
            Оформить заказ
          </button>

        </div>
      </div>
    </div>
  );
}