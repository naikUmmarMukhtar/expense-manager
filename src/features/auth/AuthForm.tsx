import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  signOut,
} from "firebase/auth";
import { postToFirebase } from "../../api/firebaseAPI";

import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import { auth } from "../../firebaseConfig";
import AuthOverLay from "./AuthOverlay";

export type AuthFormProps = {
  formData: any;
  handleChange: any;
  handleSubmit: any;
  loading: boolean;
  error: string;
  message: string;
};

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
          setError("Please verify your email before logging in.");
          signOut(auth);
          setLoading(false);
          return;
        }
        setMessage("Login successful.");
      } else {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;
        await updateProfile(user, { displayName: email.split("@")[0] });
        await postToFirebase(`${user.uid}/userDetails`, {
          email: user.email,
          displayName: user.displayName,
          createdAt: new Date().toISOString(),
        });
        await sendEmailVerification(user, {
          url: "https://countinghouse.netlify.app/",
        });
        await signOut(auth);
        setIsLogin(true);
        setMessage("Verification email sent. Please check your inbox.");
      }

      clearFields();
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f6f5f7] font-[Montserrat]">
      <div
        className={`relative w-full max-w-[768px] min-h-[480px] bg-white rounded-[10px] shadow-lg overflow-hidden`}
      >
        <div
          className={`absolute top-0 h-full w-1/2 transition-all duration-500 ${
            !isLogin ? "translate-x-full opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <RegisterForm
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            loading={loading}
            error={error}
            message={message}
          />
        </div>

        <div
          className={`absolute top-0 left-0 h-full w-1/2 transition-all duration-500 ${
            !isLogin ? "translate-x-full opacity-0 z-0" : "opacity-100 z-10"
          }`}
        >
          <LoginForm
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            loading={loading}
            error={error}
            message={message}
          />
        </div>

        <AuthOverLay
          isLogin={isLogin}
          setIsLogin={setIsLogin}
          clearFields={clearFields}
          setError={setError}
          setMessage={setMessage}
        />
      </div>
    </div>
  );
}
