"use client";

import { useState } from "react";
import {
  IconX,
  IconMessageCircle,
  IconPhone,
  IconBrandWhatsapp,
} from "@tabler/icons-react";
import { submitQuoteResponse } from "@/lib/endpoints/quotes";

export default function RespondToQuote({
  title,
  postId,
  phone,
  email,
  onClose,
}) {
  const [showForm, setShowForm] = useState(true);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    details: "",
    terms: true,
  });
  const [errors, setErrors] = useState({});

  function handleChange(e) {
    const { name, type, value, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function validate() {
    const nextErrors = {};
    if (!form.name) nextErrors.name = "Name is required";
    if (!form.phone) nextErrors.phone = "Phone is required";
    if (!form.email) nextErrors.email = "Email is required";
    if (!form.details) nextErrors.details = "Please enter your response";
    if (!form.terms) nextErrors.terms = "You must accept the terms";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    const result = await submitQuoteResponse({
      postId,
      name: form.name,
      phone: form.phone,
      email: form.email,
      details: form.details,
      quoteEmail: email,
    });

    if (result?.success) {
      setShowForm(false);
    } else {
      console.error("Failed to submit response:", result);
      // You could add error state handling here
    }
  }

  return (
    <div className="respond_to_quote_main">
      <div className="quote_inner">
        <div className="quote_container">
          <div className="quote_res_header flex">
            <h3>Responding to Quote</h3>
            <button onClick={onClose} aria-label="Close">
              <IconX size={18} />
            </button>
          </div>

          <div className="quote_res_title">
            <h2 dangerouslySetInnerHTML={{ __html: title || "" }} />
          </div>

          {showForm ? (
            <div className="quote_res_form">
              <form id="respond-to-quote" onSubmit={handleSubmit} noValidate>
                <div className="form_inner">
                  <div className="form_row">
                    <label htmlFor="name">Your Full Name</label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={form.name}
                      onChange={handleChange}
                    />
                    {errors.name ? (
                      <p className="error">{errors.name}</p>
                    ) : null}
                  </div>

                  <div className="form_row">
                    <label htmlFor="phone">Your Phone/WhatsApp Number</label>
                    <input
                      type="text"
                      name="phone"
                      id="phone"
                      value={form.phone}
                      onChange={handleChange}
                    />
                    {errors.phone ? (
                      <p className="error">{errors.phone}</p>
                    ) : null}
                  </div>

                  <div className="form_row">
                    <label htmlFor="email">Your Email</label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={form.email}
                      onChange={handleChange}
                    />
                    {errors.email ? (
                      <p className="error">{errors.email}</p>
                    ) : null}
                  </div>

                  <div className="form_row">
                    <label htmlFor="details">Your Response</label>
                    <textarea
                      name="details"
                      id="details"
                      placeholder="Enter your response here in as much detail as possible"
                      value={form.details}
                      onChange={handleChange}
                    />
                    {errors.details ? (
                      <p className="error">{errors.details}</p>
                    ) : null}
                  </div>

                  <div className="form_row checkbox">
                    <input
                      type="checkbox"
                      name="terms"
                      id="terms"
                      checked={form.terms}
                      onChange={handleChange}
                    />
                    <label htmlFor="terms">
                      I have read and agree to the Terms and Conditions
                    </label>
                    {errors.terms ? (
                      <p className="error">{errors.terms}</p>
                    ) : null}
                  </div>

                  <div className="form_row submit">
                    <button type="submit">Submit</button>
                  </div>
                </div>
              </form>
            </div>
          ) : (
            <div className="quote_res_form">
              <div className="success">
                <h3>
                  <div className="icon">
                    <IconMessageCircle size={18} />
                  </div>
                  Your Response has been submitted.
                </h3>
              </div>
            </div>
          )}

          <div className="quote_res_footer">
            <div className="other_respond_types">
              <h4>Respond to Quote</h4>
              <div className="types">
                <div className="item">
                  <a href={`tel:${phone || ""}`}>
                    <span className="icon">
                      <IconPhone size={16} />
                    </span>
                    Via Call
                  </a>
                </div>
                <div className="item">
                  <a
                    href={`https://wa.me/${String(phone || "").replace(
                      /\D/g,
                      ""
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="icon">
                      <IconBrandWhatsapp size={16} />
                    </span>
                    Via Whatsapp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
