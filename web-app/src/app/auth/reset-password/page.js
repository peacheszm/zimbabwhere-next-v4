import { Suspense } from "react";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <div className="auth_pages_main">
      <div className="container">
        <h2>Reset Password</h2>
        <p>
          Enter your email, reset code, and new password to reset your account.
        </p>
        <Suspense fallback={<div>Loading...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
