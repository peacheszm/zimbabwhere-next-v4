import RegisterForm from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="auth_pages_main">
      <div className="col col_left">
        <img src="/images/focus.jpg" alt="" />
      </div>
      <div className="col col_right">
        <div className="title_area">
          <h2>Register an Account</h2>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}
