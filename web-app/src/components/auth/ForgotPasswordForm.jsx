"use client";
import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send reset email");
      }

      setSuccess("Password reset email sent! Please check your inbox.");
      setEmail("");
    } catch (error) {
      setError(
        error.message || "Failed to send reset email. Please try again."
      );
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

          <div className="form_row">
            <label htmlFor="email">Email Address</label>
            <div className="input_wrapper">
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                placeholder="Enter your email address"
              />
            </div>
          </div>

          <div className="form_row btn_group">
            <button type="submit" className="primary" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send Reset Link"}
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
