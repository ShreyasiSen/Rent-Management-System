"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(""); // for success/error messages

  const handleLogin = async () => {
    const res = await signIn("credentials", {
      redirect: false, // important: prevent auto redirect
      username,
      password,
      callbackUrl: "/", // optional redirect after success
    });

    if (res?.error) {
      setMessage("❌ Wrong credentials");
    } else if (res?.ok) {
      setMessage("✅ Logged in successfully!");
      // optional redirect after success
      setTimeout(() => {
        window.location.href = "/";
      }, 600);
    }
  };

  return (
    <div className="flex h-screen font-poppins">
      {/* Right Login Section */}
      <div className="flex w-full items-center justify-center bg-purple-50 relative">
        {/* Decorative Background Cutout */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-200 to-indigo-100 clip-path-triangle"></div>

        {/* Card */}
        <div className="relative z-10 bg-white shadow-2xl rounded-2xl p-10 w-80 sm:w-96 border border-gray-100">
          {/* Title */}
          <h1 className="text-4xl font-playfair font-extrabold mb-2 text-center bg-gradient-to-r from-purple-700 to-indigo-500 bg-clip-text text-transparent">
            JATAYAT
          </h1>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-700 text-center mb-6 tracking-wide">
            Customer Management
          </h2>

          {/* Username */}
          <input
            className="border border-gray-300 p-3 rounded-lg w-full mb-4 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          {/* Password */}
          <input
            className="border border-gray-300 p-3 rounded-lg w-full mb-6 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Button */}
          <button
            onClick={handleLogin}
            className="cursor-pointer bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition text-white px-4 py-3 rounded-lg w-full font-semibold shadow-lg"
          >
            Login
          </button>

          {/* Message */}
          {message && (
            <p
              className={`mt-4 text-center font-medium ${
                message.includes("successfully")
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}

          {/* Footer */}
          <p className="text-center text-sm text-gray-500 mt-6">
            © {new Date().getFullYear()} Subir Sen. All rights reserved.
          </p>
        </div>
      </div>

      {/* Tailwind Custom Clip-Path */}
      <style jsx>{`
        .clip-path-triangle {
          clip-path: polygon(0 0, 100% 0, 100% 100%);
        }
      `}</style>

      {/* Import Fonts */}
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;800&family=Poppins:wght@400;500;600&display=swap");

        .font-poppins {
          font-family: "Poppins", sans-serif;
        }
        .font-playfair {
          font-family: "Playfair Display", serif;
        }
      `}</style>
    </div>
  );
}
