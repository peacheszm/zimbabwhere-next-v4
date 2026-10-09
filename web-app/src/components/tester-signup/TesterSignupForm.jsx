"use client";
import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";

export default function TesterSignupForm() {
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      confirmEmail: "",
      phone: "",
      isAndroid: false,
      company: "", // honeypot, must stay empty
    },
  });

  const onSubmit = async ({ confirmEmail, isAndroid, ...formData }) => {
    setSubmitError(null);
    try {
      const response = await fetch("/api/tester-signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setSubmitSuccess(true);
    } catch (error) {
      console.error("❌ Tester Sign-up Failed:", error);
      setSubmitError(
        error.message || "Failed to send your sign-up. Please try again.",
      );
    }
  };

  if (submitSuccess) {
    return (
      <div className="add_business_form_container" id="sign-up">
        <div className="form_wrapper">
          <div className="form_row success_box">
            <p>
              🎉 You're on the list! We'll add your email to our Google Play
              tester group and send you a link to download the app. Keep an eye
              on your inbox (and your spam folder).
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="add_business_form_container" id="sign-up">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="form_wrapper">
          {submitError && (
            <div className="form_row error_box">
              <p>❌ {submitError}</p>
            </div>
          )}

          <div className="form_row">
            <label htmlFor="name">Your Name *</label>
            <input
              id="name"
              type="text"
              autoComplete="name"
              className={errors.name ? "error" : ""}
              {...register("name", {
                required: "Your name is required",
              })}
            />
            {errors.name && (
              <span className="error_msg">{errors.name.message}</span>
            )}
          </div>

          <div className="form_row">
            <label htmlFor="email">Google Play Email Address *</label>
            <p className="field_desc">
              The email you use to sign in to the Google Play Store on your
              Android phone. This must be a Google account (usually Gmail),
              otherwise we can't add you.
            </p>
            <input
              id="email"
              type="email"
              autoComplete="email"
              className={errors.email ? "error" : ""}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+\.\S+$/i,
                  message: "Please enter a valid email address",
                },
              })}
            />
            {errors.email && (
              <span className="error_msg">{errors.email.message}</span>
            )}
          </div>

          <div className="form_row">
            <label htmlFor="confirmEmail">Confirm Email Address *</label>
            <p className="field_desc">
              Please type it again. A single typo means we can't send you the
              invite.
            </p>
            <input
              id="confirmEmail"
              type="email"
              autoComplete="off"
              className={errors.confirmEmail ? "error" : ""}
              {...register("confirmEmail", {
                required: "Please confirm your email address",
                validate: (value) =>
                  value.trim().toLowerCase() ===
                    getValues("email").trim().toLowerCase() ||
                  "The email addresses don't match",
              })}
            />
            {errors.confirmEmail && (
              <span className="error_msg">{errors.confirmEmail.message}</span>
            )}
          </div>

          <div className="form_row">
            <label htmlFor="phone">Phone / WhatsApp Number</label>
            <p className="field_desc">
              Optional. Only used if we need to reach you about the testing.
            </p>
            <input id="phone" type="tel" autoComplete="tel" {...register("phone")} />
          </div>

          {/* Honeypot field: hidden from people, bots tend to fill it in */}
          <div className="tester_hp" aria-hidden="true">
            <label htmlFor="company">Company</label>
            <input
              id="company"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              {...register("company")}
            />
          </div>

          <div className="form_row checkbox tester_checkbox">
            <input
              type="checkbox"
              id="isAndroid"
              {...register("isAndroid", {
                required: "Please confirm this before signing up",
              })}
            />
            <label htmlFor="isAndroid">
              I use an Android phone, and the email above is the one I use on
              the Google Play Store
            </label>
            {errors.isAndroid && (
              <span className="error_msg">{errors.isAndroid.message}</span>
            )}
          </div>

          <div className="form_row">
            <p className="field_desc">
              We only use your details to add you to the app testing group. See
              our <Link href="/privacy-policy">Privacy Policy</Link>.
            </p>
          </div>

          <div className="form_row btn_group">
            <button type="submit" className="primary" disabled={isSubmitting}>
              {isSubmitting ? "Signing you up..." : "Sign me up"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
