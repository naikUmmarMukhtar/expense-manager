import type { LoginSignUpFormProps } from "../../types";

export default function LoginForm({
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
      <h1 className="text-2xl font-bold mb-2">Welcome Back</h1>
      <p className="text-sm text-gray-500 mb-4">Log in to your dashboard</p>

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
        placeholder="Password"
        className="w-full px-4 py-3 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
        value={formData.password}
        onChange={handleChange}
        required
      />

      {error && <div className="text-red-700 text-sm">{error}</div>}
      {message && <div className="text-green-700 text-sm">{message}</div>}

      <button
        disabled={loading}
        className="bg-pink-500 text-white rounded-full px-8 py-3 text-sm font-bold uppercase mt-2"
      >
        {loading ? "Logging in..." : "Log In"}
      </button>
    </form>
  );
}
