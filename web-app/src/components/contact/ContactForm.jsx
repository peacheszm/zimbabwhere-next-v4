"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function ContactForm() {
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (formData) => {
    setSubmitError(null);
    setSubmitSuccess(false);
    try {
      const response = await fetch("/api/contact", {
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
      reset();
    } catch (error) {
      console.error("❌ Contact Form Failed:", error);
      setSubmitError(
        error.message || "Failed to send your message. Please try again.",
      );
    }
  };

  return (
    <div className="add_business_form_container">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form_wrapper">
          {submitSuccess && (
            <div className="form_row success_box">
              <p>
                🎉 Your message has been sent successfully! We will get back
                to you as soon as possible.
              </p>
            </div>
          )}

          {submitError && (
            <div className="form_row error_box">
              <p>❌ {submitError}</p>
            </div>
          )}

          <div className="form_row">
            <label htmlFor="name">Full Name *</label>
            <input
              id="name"
              type="text"
              className={errors.name ? "error" : ""}
              placeholder="John Doe"
              {...register("name", {
                required: "Full name is required",
              })}
            />
            {errors.name && (
              <span className="error_msg">{errors.name.message}</span>
            )}
          </div>

          <div className="form_row">
            <label htmlFor="email">Email Address *</label>
            <input
              id="email"
              type="email"
              className={errors.email ? "error" : ""}
              placeholder="you@example.com"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Please enter a valid email address",
                },
              })}
            />
            {errors.email && (
              <span className="error_msg">{errors.email.message}</span>
            )}
          </div>

          <div className="form_row">
            <label htmlFor="phone">Phone Number</label>
            <p className="field_desc">Optional contact number.</p>
            <input
              id="phone"
              type="tel"
              placeholder="Whatsapp / Phone Call"
              {...register("phone")}
            />
          </div>

          <div className="form_row">
            <label htmlFor="subject">Subject</label>
            <input
              id="subject"
              type="text"
              placeholder="What is this regarding?"
              {...register("subject")}
            />
          </div>

          <div className="form_row">
            <label htmlFor="message">Message *</label>
            <textarea
              id="message"
              rows="7"
              className={errors.message ? "error" : ""}
              placeholder="Write your message here..."
              {...register("message", {
                required: "Message is required",
              })}
            ></textarea>
            {errors.message && (
              <span className="error_msg">{errors.message.message}</span>
            )}
          </div>

          <div className="form_row btn_group">
            <button type="submit" className="primary" disabled={isSubmitting}>
              {isSubmitting ? "Sending message..." : "Send Message"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
