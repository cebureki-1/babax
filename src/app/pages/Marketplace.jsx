import { useEffect, useState } from "react";

const API_URL = "http://localhost:4000/api/products";

export function Marketplace() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("default");

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setFiltered(data);
      });
  }, []);

  useEffect(() => {
    let data = [...products];

    // фильтр по категории
    if (category !== "all") {
      data = data.filter(p => p.category === category);
    }

    // сортировка
    if (sort === "low") {
      data.sort((a, b) => a.price - b.price);
    } else if (sort === "high") {
      data.sort((a, b) => b.price - a.price);
    }

    setFiltered(data);
  }, [category, sort, products]);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">EcoMarket</h1>
          <p className="text-gray-500">
            Датчики для дома и бизнеса
          </p>
        </div>

        {/* FILTERS */}
        <div className="flex flex-wrap gap-4 mb-6">

          {/* CATEGORY */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2 border rounded-xl"
          >
            <option value="all">Все</option>
            <option value="home">Дом</option>
            <option value="office">Офис</option>
            <option value="industrial">Индустрия</option>
          </select>

          {/* SORT */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-4 py-2 border rounded-xl"
          >
            <option value="default">Сортировка</option>
            <option value="low">Цена ↑</option>
            <option value="high">Цена ↓</option>
          </select>

        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

          {filtered.map(product => (
            <div
              key={product.id}
              className="bg-white p-5 rounded-2xl shadow hover:shadow-lg transition"
            >
              {/* IMAGE */}
              <img
                src={product.image_url || "https://via.placeholder.com/300"}
                alt={product.name}
                className="w-full h-40 object-cover rounded-xl mb-4"
              />

              {/* NAME */}
              <h2 className="text-lg font-semibold mb-2">
                {product.name}
              </h2>

              {/* CATEGORY */}
              <p className="text-xs text-gray-500 mb-2 uppercase">
                {product.category}
              </p>

              {/* PRICE */}
              <p className="text-xl font-bold text-blue-600 mb-3">
                {product.price} ₸
              </p>

              {/* SPECS */}
              <div className="text-sm text-gray-600 mb-4 space-y-1">
                {product.specs &&
                  Object.entries(product.specs).map(([key, val]) => (
                    <div key={key}>
                      <span className="font-medium">{key}:</span> {val}
                    </div>
                  ))}
              </div>

              {/* BUTTON */}
              <button className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition">
                В корзину
              </button>
            </div>
          ))}

        </div>

        {/* EMPTY */}
        {filtered.length === 0 && (
          <div className="text-center text-gray-500 mt-20">
            Нет товаров 😢
          </div>
        )}

      </div>
    </div>
  );
}