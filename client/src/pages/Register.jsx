import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Register = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    const res = await fetch(`${import.meta.env.ORIGIN}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();

    if (res.ok) {
      alert("Registered successfully! Please login.");
      navigate("/login");
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-100 via-white to-blue-200">

      {/* LEFT BRANDING SECTION */}
      <motion.div
        initial={{ opacity: 0, x: -80 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="hidden md:flex w-1/2 items-center justify-center px-12"
      >
        <div className="text-left">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-6xl font-extrabold bg-gradient-to-r 
                       from-blue-600 via-purple-500 to-blue-400 
                       bg-clip-text text-transparent"
          >
            SkillX
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-4 text-xl text-gray-700"
          >
            The Skill Trading Platform
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-6 text-gray-600 max-w-md"
          >
            Exchange skills, earn points, collaborate on real projects,
            and grow together in a decentralized skill economy.
          </motion.p>
        </div>
      </motion.div>

      {/* TRANSPARENT DIVIDER */}
      <div className="hidden md:block w-[1px] bg-white/40 backdrop-blur-lg" />

      {/* RIGHT REGISTER SECTION */}
      <motion.div
        initial={{ opacity: 0, x: 80 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex w-full md:w-1/2 items-center justify-center px-6"
      >
        <motion.form
          onSubmit={handleRegister}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="backdrop-blur-lg bg-white/60 border border-white/30 
                     shadow-xl rounded-2xl p-8 w-full max-w-md"
        >
          <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">
            Create Account
          </h2>

          <input
            className="w-full mb-4 px-4 py-2 rounded-lg border border-blue-200
                       focus:outline-none focus:ring-2 focus:ring-blue-400
                       transition-all bg-white/80"
            placeholder="Full Name"
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            className="w-full mb-4 px-4 py-2 rounded-lg border border-blue-200
                       focus:outline-none focus:ring-2 focus:ring-blue-400
                       transition-all bg-white/80"
            placeholder="Email Address"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            className="w-full mb-6 px-4 py-2 rounded-lg border border-blue-200
                       focus:outline-none focus:ring-2 focus:ring-blue-400
                       transition-all bg-white/80"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="w-full py-2 rounded-lg font-semibold text-white
                       bg-gradient-to-r from-blue-600 to-blue-500
                       hover:from-blue-700 hover:to-blue-600
                       transition-all shadow-lg"
          >
            Register
          </motion.button>

          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-blue-600 font-semibold cursor-pointer hover:underline"
            >
              Login
            </span>
          </p>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default Register;
