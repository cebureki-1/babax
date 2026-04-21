import { useState, useEffect, useRef } from "react";
import { X, Mail, Lock, User } from "lucide-react";

const API_BASE_URL = "http://localhost:4000";

async function postJson(path, body) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(data?.error ? String(data.error) : `Request failed (${res.status})`);
  }
  return data;
}

export function LoginModal({ isOpen, onClose, onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "", name: "" });
  const firstInputRef = useRef(null);

  useEffect(() => {
    if (isOpen && firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, [isOpen, isRegister, isForgotPassword]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };


const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    if (isForgotPassword) {
      // Можно добавить отдельный эндпоинт восстановления пароля, пока alert
      alert(`Ссылка для восстановления пароля отправлена на ${formData.email}`);
      setIsForgotPassword(false);
      setFormData({ email: "", password: "", name: "" });
    } else if (isRegister) {
      const data = await postJson("/api/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      if (data?.token) localStorage.setItem("token", data.token);
      onLogin(data.user.name, data.user.email);
      onClose();
      setIsRegister(false);
      setFormData({ email: "", password: "", name: "" });
      alert("Регистрация успешна!");
    } else {
      const data = await postJson("/api/auth/login", {
        email: formData.email,
        password: formData.password
      });
      if (data?.token) localStorage.setItem("token", data.token);
      onLogin(data.user.name, data.user.email);
      onClose();
      setFormData({ email: "", password: "", name: "" });
      window.location.reload();
    }
  } catch (err) {
    alert("Ошибка: " + err.message);
  }
};

  const resetForm = () => {
    setIsRegister(false);
    setIsForgotPassword(false);
    setFormData({ email: "", password: "", name: "" });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-900">
            {isForgotPassword ? "Восстановление пароля" : isRegister ? "Регистрация" : "Вход"}
          </h2>
          <button
            onClick={() => {
              onClose();
              resetForm();
            }}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {isRegister && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Имя</label>
              <div className="relative">
                <User className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                <input
                  ref={firstInputRef}
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Введите ваше имя"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <div className="relative">
              <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
              <input
                ref={!isRegister ? firstInputRef : null}
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Введите email"
              />
            </div>
          </div>

          {!isForgotPassword && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Пароль</label>
              <div className="relative">
                <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Введите пароль"
                />
              </div>
            </div>
          )}

          {!isRegister && !isForgotPassword && (
            <div className="text-right">
              <button
                type="button"
                onClick={() => setIsForgotPassword(true)}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Забыли пароль?
              </button>
            </div>
          )}

          <button
            type="submit"
            className="w-full mt-4 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
          >
            {isForgotPassword ? "Отправить ссылку" : isRegister ? "Зарегистрироваться" : "Войти"}
          </button>

          {!isForgotPassword && (
            <div className="mt-4 text-center text-sm text-gray-600">
              {isRegister ? "Уже есть аккаунт?" : "Нет аккаунта?"}{" "}
              <button
                type="button"
                onClick={() => setIsRegister(!isRegister)}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                {isRegister ? "Войти" : "Зарегистрироваться"}
              </button>
            </div>
          )}

          {isForgotPassword && (
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => setIsForgotPassword(false)}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                ← Вернуться к входу
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}