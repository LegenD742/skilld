import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch(`${import.meta.env.ORIGIN}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      login(data.user, data.token);
      navigate("/");
    } else {
      alert(data.message);
    }
  };

  return (
    <div
      className={`relative min-h-screen flex transition-colors duration-500 ${
        isDark
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
          : "bg-gradient-to-br from-blue-100 via-white to-blue-200"
      }`}
    >
      {/* 🌗 TOP-RIGHT DARK MODE TOGGLE */}
      <button
        onClick={() => setIsDark(!isDark)}
        className="absolute top-6 right-6 text-2xl 
                   hover:scale-110 transition-transform duration-300"
        title="Toggle dark mode"
      >
        {isDark ? "☀️" : "🌙"}
      </button>

      {/* LEFT BRANDING */}
      <motion.div
        initial={{ opacity: 0, x: -80 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="hidden md:flex w-1/2 items-center justify-center px-12"
      >
        <div>
          <h1 className="text-6xl font-extrabold bg-gradient-to-r 
            from-blue-600 via-purple-500 to-blue-400 
            bg-clip-text text-transparent">
            SkillX
          </h1>

          <p className={`mt-4 text-xl ${isDark ? "text-gray-300" : "text-gray-700"}`}>
            The Skill Trading Platform
          </p>

          <p className={`mt-6 max-w-md ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            Log in to collaborate, earn points, and trade skills
            in a transparent, trust-driven ecosystem.
          </p>
        </div>
      </motion.div>

      {/* DIVIDER */}
      <div className="hidden md:block w-[1px] bg-white/30 backdrop-blur-lg" />

      {/* RIGHT LOGIN CARD */}
      <motion.div
        initial={{ opacity: 0, x: 80 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="flex w-full md:w-1/2 items-center justify-center px-6"
      >
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`backdrop-blur-lg border shadow-xl rounded-2xl 
            p-8 w-full max-w-md transition-colors duration-500 ${
              isDark
                ? "bg-gray-800/70 border-white/10"
                : "bg-white/60 border-white/30"
            }`}
        >
          <h2 className={`text-3xl font-bold mb-6 text-center ${
            isDark ? "text-white" : "text-blue-700"
          }`}>
            Welcome Back
          </h2>

          <input
            className={`w-full mb-4 px-4 py-2 rounded-lg border 
              focus:outline-none focus:ring-2 focus:ring-blue-400
              transition-all ${
                isDark
                  ? "bg-gray-900 text-white border-gray-700"
                  : "bg-white/80 border-blue-200"
              }`}
            placeholder="Email Address"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            className={`w-full mb-6 px-4 py-2 rounded-lg border 
              focus:outline-none focus:ring-2 focus:ring-blue-400
              transition-all ${
                isDark
                  ? "bg-gray-900 text-white border-gray-700"
                  : "bg-white/80 border-blue-200"
              }`}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            disabled={loading}
            className={`w-full py-2 rounded-lg font-semibold text-white
              bg-gradient-to-r from-blue-600 to-blue-500
              hover:from-blue-700 hover:to-blue-600
              transition-all shadow-lg ${
                loading ? "opacity-60 cursor-not-allowed" : ""
              }`}
          >
            {loading ? "Logging in..." : "Login"}
          </motion.button>

          <p className={`text-center text-sm mt-6 ${
            isDark ? "text-gray-400" : "text-gray-600"
          }`}>
            Don’t have an account?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-blue-500 font-semibold cursor-pointer hover:underline"
            >
              Register
            </span>
          </p>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default Login;
