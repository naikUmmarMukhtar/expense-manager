// src/features/auth/EmailConfirmationNotice.tsx
export default function EmailConfirmationNotice() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Check your email
        </h2>
        <p className="text-gray-600 mb-4">
          We've sent a confirmation link to your email address. Please click the
          link to verify your email before proceeding.
        </p>
        <p className="text-sm text-gray-500">
          Didn’t receive the email? Check your spam folder or try signing up
          again.
        </p>
      </div>
    </div>
  );
}
