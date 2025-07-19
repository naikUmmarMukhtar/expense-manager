import type { LoginSignUpFormProps } from "../../types";

export default function RegisterForm({
  formData,
  handleChange,
  handleSubmit,
  loading,
  error,
  message,
}: LoginSignUpFormProps) {
  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white flex flex-col items-center justify-center h-full px-12 text-center space-y-3"
    >
      <h1 className="text-2xl font-bold mb-2">Create Account</h1>
      <p className="text-sm text-gray-500 mb-4">Sign up to get started</p>

      <input
        type="email"
        name="email"
        placeholder="Email address"
        className="w-full px-4 py-3 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Create password"
        className="w-full px-4 py-3 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
        value={formData.password}
        onChange={handleChange}
        required
      />
      <input
        type="password"
        name="confirmPassword"
        placeholder="Confirm password"
        className="w-full px-4 py-3 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
        value={formData.confirmPassword}
        onChange={handleChange}
        required
      />

      {error && <div className="text-red-600 text-sm">⚠️ {error}</div>}
      {message && <div className="text-green-600 text-sm">✅ {message}</div>}

      <button
        disabled={loading}
        className="bg-pink-500 text-white rounded-full px-8 py-3 text-sm font-bold uppercase mt-2"
      >
        {loading ? "Creating..." : "Sign Up"}
      </button>
    </form>
  );
}
