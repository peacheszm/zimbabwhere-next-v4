"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import ErrorMessage from "../global/Error";
// Removed large eye icons in favor of a simple text toggle

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
    email: "",
    password: "",
    confirm_password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
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

  const validateForm = () => {
    if (formData.password !== formData.confirm_password) {
      setError("Passwords do not match");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }
    if (!formData.email.includes("@")) {
      setError("Please enter a valid email address");
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
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone_number: formData.phone_number,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      setSuccess("Registration successful! Please log in.");

      // Clear form
      setFormData({
        first_name: "",
        last_name: "",
        phone_number: "",
        email: "",
        password: "",
        confirm_password: "",
      });

      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    } catch (error) {
      setError(error.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page_forms">
      <form onSubmit={handleSubmit}>
        <div className="form_wrapper">
          {error && <ErrorMessage body={error} />}

          {success && (
            <div className="form_row">
              <div className="success">{success}</div>
            </div>
          )}

          <div className="form_row">
            <label htmlFor="first_name">First Name *</label>
            <div className="input_wrapper">
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="form_row">
            <label htmlFor="last_name">Last Name *</label>
            <div className="input_wrapper">
              <input
                type="text"
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="form_row">
            <label htmlFor="phone_number">Phone Number</label>
            <div className="input_wrapper">
              <input
                type="tel"
                id="phone_number"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleInputChange}
                placeholder="+263 (###) ###-###"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="form_row">
            <label htmlFor="email">Email *</label>
            <div className="input_wrapper">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="form_row">
            <label htmlFor="password">Password *</label>
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

          <div className="form_row">
            <label htmlFor="confirm_password">Confirm Password *</label>
            <div className="input_wrapper">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirm_password"
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleInputChange}
                required
                disabled={isLoading}
              />
              {/* <button
                type="button"
                className="password_toggle_link"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button> */}
            </div>
          </div>

          <div className="form_row btn_group">
            <button type="submit" className="primary" disabled={isLoading}>
              {isLoading ? "Creating Account..." : "Register"}
            </button>
          </div>

          <div className="page_actions">
            <span className="breaker">Already have an account?</span>
            <div className="btn_group primary">
              <Link href="/auth/login">Login</Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
