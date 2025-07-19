import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  signOut,
} from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { postToFirebase } from "../../api/firebaseAPI";

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const clearFields = () => {
    setFormData({ email: "", password: "", confirmPassword: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    const { email, password, confirmPassword } = formData;

    try {
      if (!isLogin && password !== confirmPassword) {
        setError("Passwords do not match.");
        setLoading(false);
        return;
      }

      if (isLogin) {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

        if (!userCredential.user.emailVerified) {
          setError("Please verify your email before continuing.");
          signOut(auth);
          setLoading(false);
          return;
        }

        setMessage("Login successful!");
        clearFields();
      } else {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        const user = userCredential.user;

        await updateProfile(user, {
          displayName: email.split("@")[0],
        });

        const uid = auth.currentUser?.uid;
        if (!uid) throw new Error("User not authenticated");
        await postToFirebase(`${uid}/userDetails`, {
          email: user.email,
          displayName: user.displayName,
          createdAt: new Date().toISOString(),
        });

        await sendEmailVerification(user, {
          url: "https://countinghouse.netlify.app/",
        });

        await signOut(auth);
        setIsLogin(true);
        setMessage(
          "Verification email sent. Please check your inbox before logging in."
        );
        clearFields();
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          {isLogin
            ? "Login to Counting House"
            : "Create a Counting House Account"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            value={formData.password}
            onChange={handleChange}
            required
          />

          {!isLogin && (
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          )}

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-2 rounded-md border border-red-200">
              {error}
            </div>
          )}

          {message && (
            <div className="text-sm text-green-800 bg-green-50 p-2 rounded-md border border-green-200">
              {message}
            </div>
          )}

          <button
            disabled={loading}
            className={`w-full py-2 font-medium rounded-md ${
              loading
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-amber-600 text-white hover:bg-amber-700"
            }`}
          >
            {loading ? "Please wait..." : isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
              setMessage("");
              clearFields();
            }}
            className="text-amber-600 hover:underline font-medium"
          >
            {isLogin ? "Sign up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}
