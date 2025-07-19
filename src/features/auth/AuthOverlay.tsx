import type { AuthOverLayProps } from "../../types";

export default function AuthOverLay({
  isLogin,
  setIsLogin,
  clearFields,
  setError,
  setMessage,
}: AuthOverLayProps) {
  return (
    <div
      className={`absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-transform duration-500 z-50 ${
        !isLogin ? "-translate-x-full" : ""
      }`}
    >
      <div
        className={`bg-gradient-to-r from-[#FF4B2B] to-[#FF416C] text-white absolute left-[-100%] w-[200%] h-full transition-transform duration-500 ${
          !isLogin ? "translate-x-1/2" : "translate-x-0"
        }`}
      >
        <div className="absolute top-0 left-0 w-1/2 h-full flex flex-col items-center justify-center px-10 text-center">
          <h1 className="text-3xl font-bold">Already a Member?</h1>
          <p className="text-sm mt-2 mb-4">
            Log in to your Counting House account
          </p>
          <button
            onClick={() => {
              setIsLogin(true);
              setError("");
              setMessage("");
              clearFields();
            }}
            className="bg-transparent border border-white text-white font-bold text-xs uppercase py-3 px-10 rounded-full"
          >
            Log In
          </button>
        </div>
        <div className="absolute top-0 right-0 w-1/2 h-full flex flex-col items-center justify-center px-10 text-center">
          <h1 className="text-3xl font-bold">Get Started</h1>
          <p className="text-sm mt-2 mb-4">
            Join Counting House and take control of your money.
          </p>
          <button
            onClick={() => {
              setIsLogin(false);
              setError("");
              setMessage("");
              clearFields();
            }}
            className="bg-transparent border border-white text-white font-bold text-xs uppercase py-3 px-10 rounded-full"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}
