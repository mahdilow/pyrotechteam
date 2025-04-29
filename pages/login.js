import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useTheme } from "next-themes";
import Header from "../components/Header";
import Button from "../components/Button";
import Cursor from "../components/Cursor";

// Data
import data from "../data/portfolio.json";

const Login = () => {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  // This is where you would store your password
  // In a real application, this should be properly hashed and stored securely
  const correctPassword = "admin123"; // Change this to your desired password

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === correctPassword) {
      // Store authentication in session storage
      sessionStorage.setItem("isAuthenticated", "true");
      router.push("/edit");
    } else {
      setError("رمز عبور اشتباه است. لطفا دوباره تلاش کنید.");
    }
  };

  return (
    <div className={`container mx-auto ${data.showCursor && "cursor-none"}`} style={{ direction: "rtl" }}>
      <Header isBlog></Header>
      {data.showCursor && <Cursor />}
      <div className="mt-10">
        <div 
          className={`p-8 rounded-lg shadow-lg max-w-md mx-auto ${
            theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-800"
          }`}
        >
          <h1 className="text-3xl font-bold mb-6 text-center">ورود به پنل مدیریت</h1>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label 
                className="block text-lg mb-2 opacity-80" 
                htmlFor="password"
              >
                رمز عبور
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full p-3 rounded-md border-2 ${
                  theme === "dark" 
                    ? "bg-gray-700 border-gray-600 text-white" 
                    : "bg-white border-gray-300 text-gray-800"
                }`}
                placeholder="رمز عبور را وارد کنید"
              />
            </div>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <Button 
              type="primary" 
              onClick={handleLogin}
              classes="w-full justify-center py-3 text-center text-lg"
            >
              ورود
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
