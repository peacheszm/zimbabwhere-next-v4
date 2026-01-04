"use client";
import { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginForm() {
  const [formData, setFormData] = useState({
    login: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        login: formData.login,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid credentials. Please try again.");
      } else {
        // Check if user is authenticated
        const session = await getSession();
        if (session) {
          router.push("/my-account");
        }
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page_forms">
      <form onSubmit={handleSubmit}>
        <div className="form_wrapper">
          {error && (
            <div className="form_row">
              <div className="errors">{error}</div>
            </div>
          )}

          <div className="form_row">
            <label htmlFor="login">Email / Username</label>
            <div className="input_wrapper">
              <input
                type="text"
                id="login"
                name="login"
                value={formData.login}
                onChange={handleInputChange}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="form_row">
            <label htmlFor="password">Password</label>
            <div className="input_wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                disabled={isLoading}
              />
              {/* <button
                type="button"
                className="password_toggle_link"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "Hide" : "Show"}
              </button> */}
            </div>
          </div>

          <div className="form_row btn_group">
            <button type="submit" className="primary" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </div>

          <div className="form_links">
            <Link href="/auth/forgot-password">Forgot Password?</Link>
          </div>

          <div className="page_actions">
            <span className="breaker">Don't have an account?</span>
            <div className="btn_group primary">
              <Link href="/auth/register">Create an account</Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
