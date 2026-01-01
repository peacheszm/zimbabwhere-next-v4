import LoginForm from "@/components/auth/LoginForm";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="auth_pages_main">
      <div className="col col_left">
        <img src="/images/focus.jpg" alt="" />
      </div>
      <div className="col col_right">
        <div className="title_area">
          <h2>Login</h2>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
