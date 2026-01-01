"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
// Removed large eye icons in favor of a simple text toggle

export default function ResetPasswordForm() {
  const [formData, setFormData] = useState({
    email: "",
    code: "",
    new_password: "",
    confirm_password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Pre-fill email and code from URL params if available
    const email = searchParams.get("email");
    const code = searchParams.get("code");

    if (email || code) {
      // Fix email by replacing spaces with + characters (URL decoding issue)
      const fixedEmail = email ? email.replace(/\s/g, "+") : "";

      setFormData((prev) => ({
        ...prev,
        email: fixedEmail || prev.email,
        code: code || prev.code,
      }));

      // Remove email and code from URL after populating form data
      if (email || code) {
        const url = new URL(window.location);
        if (email) url.searchParams.delete("email");
        if (code) url.searchParams.delete("code");
        router.replace(url.pathname + url.search, { scroll: false });
      }
    } else {
      // If no email or code in URL, show error and redirect
      // setError("Invalid reset link. Please request a new password reset.");
      // setTimeout(() => {
      //   router.push("/auth/forgot-password");
      // }, 3000);
    }
  }, [searchParams, router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const validateForm = () => {
    if (formData.new_password !== formData.confirm_password) {
      setError("Passwords do not match");
      return false;
    }
    if (formData.new_password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }
    if (!formData.email || !formData.email.includes("@")) {
      setError("Invalid email address or reset link");
      return false;
    }
    if (!formData.code) {
      setError("Invalid reset code or reset link");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          code: formData.code,
          new_password: formData.new_password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Password reset failed");
      }

      setSuccess("Password reset successful! Redirecting to login...");

      // Clear form
      setFormData({
        email: "",
        code: "",
        new_password: "",
        confirm_password: "",
      });

      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    } catch (error) {
      setError(error.message || "Password reset failed. Please try again.");
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

          {success && (
            <div className="form_row">
              <div className="success">{success}</div>
            </div>
          )}

          {/* Email and code fields are hidden - auto-populated from URL params */}
          <input type="hidden" name="email" value={formData.email} />
          <input type="hidden" name="code" value={formData.code} />

          <div className="form_row">
            <label htmlFor="new_password">New Password *</label>
            <div className="input_wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="new_password"
                name="new_password"
                value={formData.new_password}
                onChange={handleInputChange}
                required
                disabled={isLoading}
                placeholder="Enter new password"
              />
              <button
                type="button"
                className="password_toggle_link"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className="form_row">
            <label htmlFor="confirm_password">Confirm New Password *</label>
            <div className="input_wrapper">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirm_password"
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleInputChange}
                required
                disabled={isLoading}
                placeholder="Confirm new password"
              />
              <button
                type="button"
                className="password_toggle_link"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className="form_row btn_group">
            <button type="submit" className="primary" disabled={isLoading}>
              {isLoading ? "Resetting..." : "Reset Password"}
            </button>
          </div>

          <div className="page_actions">
            <span className="breaker">Remember your password?</span>
            <div className="btn_group">
              <Link href="/auth/login">Back to Login</Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
