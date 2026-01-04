import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import Image from "next/image";

export default function ForgotPasswordPage() {
  return (
    <div className="auth_pages_main">
      <div className="container">
        <div className="title_area">
          <h2>Forgot Password</h2>
          <p>
            Enter your email address and we'll send you a link to reset your
            password.
          </p>
        </div>
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
