import { useEffect, useState } from "react";
import { useParams } from "react-router";

const API_URL = "http://localhost:4000/api/products";

export function ProductDetail() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/${id}`)
      .then(res => res.json())
      .then(data => setProduct(data))
      .finally(() => setLoading(false));
  }, [id]);

  function addToCart() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existing = cart.find(item => item.id === product.id);

    if (existing) {
      existing.quantity += qty;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: qty
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Добавлено в корзину ✅");
  }

  if (loading) {
    return <div className="p-8">Загрузка...</div>;
  }

  if (!product) {
    return <div className="p-8">Товар не найден</div>;
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-2xl shadow">

        <div className="grid md:grid-cols-2 gap-8">

          {/* IMAGE */}
          <img
            src={product.image_url || "https://via.placeholder.com/500"}
            alt={product.name}
            className="w-full h-[350px] object-cover rounded-xl"
          />

          {/* INFO */}
          <div>

            <h1 className="text-2xl font-bold mb-2">
              {product.name}
            </h1>

            <p className="text-sm text-gray-500 mb-4 uppercase">
              {product.category}
            </p>

            <p className="text-3xl font-bold text-blue-600 mb-4">
              {product.price} ₸
            </p>

            <p className="text-gray-600 mb-6">
              {product.description || "Описание отсутствует"}
            </p>

            {/* SPECS */}
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Характеристики:</h3>

              <div className="space-y-1 text-sm text-gray-700">
                {product.specs &&
                  Object.entries(product.specs).map(([key, val]) => (
                    <div key={key}>
                      <span className="font-medium">{key}:</span> {val}
                    </div>
                  ))}
              </div>
            </div>

            {/* QTY */}
            <div className="flex items-center gap-4 mb-6">
              <span>Количество:</span>

              <input
                type="number"
                min="1"
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                className="w-20 px-3 py-2 border rounded-xl"
              />
            </div>

            {/* BUTTON */}
            <button
              onClick={addToCart}
              className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition"
            >
              Добавить в корзину
            </button>

          </div>
        </div>

      </div>
    </div>
  );
}