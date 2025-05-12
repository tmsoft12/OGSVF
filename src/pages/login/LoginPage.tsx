import React, { useState } from "react";
import { useNavigate } from "react-router-dom";  // Yönlendirme için ekleme

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const navigate = useNavigate(); // navigate hook'u

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess(true);
        setError(null);
        console.log("Token:", result.token); // JWT token geldi diyelim
        // localStorage.setItem("token", result.token); // istersen burada saklayabilirsin
        // Giriş başarılı ise admin sayfasına yönlendir
        navigate("/admin"); // Yönlendirme
      } else {
        setSuccess(false);
        setError(result.message || "Giriş başarısız");
      }
    } catch (err) {
      setError("Sunucuya bağlanılamadı.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <form
        onSubmit={handleLogin}
        className="bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-white text-center">Giriş Yap</h2>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {success && <p className="text-green-500 text-sm mb-4">Giriş başarılı!</p>}

        <div className="mb-4">
          <label className="block text-gray-300 text-sm mb-2" htmlFor="username">
            Kullanıcı Adı
          </label>
          <input
            id="username"
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="kullaniciadi"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-300 text-sm mb-2" htmlFor="password">
            Şifre
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded"
        >
          Giriş Yap
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
