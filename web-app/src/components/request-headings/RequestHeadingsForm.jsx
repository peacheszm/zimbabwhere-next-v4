"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function RequestHeadingsForm() {
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
      surname: "",
      email: "",
      phone: "",
      headingName: "",
    },
  });

  const onSubmit = async (formData) => {
    setSubmitError(null);
    setSubmitSuccess(false);
    try {
      const response = await fetch("/api/request-headings", {
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
      console.error("❌ Heading Request Failed:", error);
      setSubmitError(error.message || "Failed to request heading. Please try again.");
    }
  };

  return (
    <div className="add_business_form_container">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form_wrapper">
          {submitSuccess && (
            <div className="form_row success_box">
              <p>🎉 Your request has been sent successfully! We will look into adding your heading as soon as possible.</p>
            </div>
          )}

          {submitError && (
            <div className="form_row error_box">
              <p>❌ {submitError}</p>
            </div>
          )}

          <div className="form_row">
            <label htmlFor="headingName">Requested Heading Name *</label>
            <p className="field_desc">The name of the business category/heading you want to suggest.</p>
            <input
              id="headingName"
              type="text"
              className={errors.headingName ? "error" : ""}
              placeholder="e.g. Solar Installation & Services"
              {...register("headingName", {
                required: "Heading name is required",
              })}
            />
            {errors.headingName && (
              <span className="error_msg">{errors.headingName.message}</span>
            )}
          </div>

          <div className="form_row">
            <label htmlFor="name">First Name *</label>
            <input
              id="name"
              type="text"
              className={errors.name ? "error" : ""}
              {...register("name", {
                required: "First name is required",
              })}
            />
            {errors.name && (
              <span className="error_msg">{errors.name.message}</span>
            )}
          </div>

          <div className="form_row">
            <label htmlFor="surname">Surname *</label>
            <input
              id="surname"
              type="text"
              className={errors.surname ? "error" : ""}
              {...register("surname", {
                required: "Surname is required",
              })}
            />
            {errors.surname && (
              <span className="error_msg">{errors.surname.message}</span>
            )}
          </div>

          <div className="form_row">
            <label htmlFor="email">Email Address *</label>
            <p className="field_desc">We will update you at this email address once the heading is added.</p>
            <input
              id="email"
              type="email"
              className={errors.email ? "error" : ""}
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
              {...register("phone")}
            />
          </div>

          <div className="form_row btn_group">
            <button type="submit" className="primary" disabled={isSubmitting}>
              {isSubmitting ? "Submitting Request..." : "Submit Request"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
