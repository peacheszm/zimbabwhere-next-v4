import React from "react";
import Modal from "@/components/global/Modal";
import { useModal } from "@/contexts/ModalContext";
import { useForm, Controller } from "react-hook-form";
import { submitQuoteResponse } from "@/lib/endpoints/quotes";

export default function RespondToQuote() {
  const { isModalOpen, getModalProps, closeModal } = useModal();
  const isRespondToQuote = isModalOpen("RespondToQuote");

  const RespondToQuoteProps = getModalProps("RespondToQuote"); // contains farm info

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({});

  const [showSuccess, setShowSuccess] = React.useState(false);

  const onSubmit = async (data) => {
    const result = await submitQuoteResponse({
      postId: RespondToQuoteProps.postId,
      name: data.name,
      phone: data.phone,
      email: data.email,
      details: data.details,
      quoteEmail: RespondToQuoteProps.email,
    });

    if (result?.success) {
      setShowSuccess(true);
      reset();
    } else {
      console.error("Failed to submit response:", result);
    }
  };

  return (
    <>
      {isRespondToQuote && (
        <Modal
          title={`Responding to Quote - ${RespondToQuoteProps.title}`}
          onClose={() => {
            closeModal("RespondToQuote");
            setShowSuccess(false);
          }}
        >
          {!showSuccess ? (
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="form_wrapper">
                <div className="form_row">
                  <label htmlFor="name">Your Full Name</label>
                  <input
                    id="name"
                    type="text"
                    {...register("name", { required: "Name is required" })}
                  />
                  {errors.name && (
                    <span className="error">{errors.name.message}</span>
                  )}
                </div>

                <div className="form_row">
                  <label htmlFor="phone">Your Phone/WhatsApp Number</label>
                  <input
                    id="phone"
                    type="text"
                    {...register("phone", { required: "Phone is required" })}
                  />
                  {errors.phone && (
                    <span className="error">{errors.phone.message}</span>
                  )}
                </div>

                <div className="form_row">
                  <label htmlFor="email">Your Email</label>
                  <input
                    id="email"
                    type="email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                  />
                  {errors.email && (
                    <span className="error">{errors.email.message}</span>
                  )}
                </div>
                <div className="form_row">
                  <label htmlFor="details">Your Response</label>
                  <textarea
                    name="details"
                    id="details"
                    {...register("details", {
                      required: "Details are required",
                    })}
                  ></textarea>
                  {errors.details && (
                    <span className="error">{errors.details.message}</span>
                  )}
                </div>

                <div className="form_row btn_group">
                  <button
                    type="submit"
                    className="primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <div className="success_message">
              <h3>Thank you!</h3>
              <p>Your response has been submitted successfully.</p>
              <div className="btn_group mt-4">
                <button
                  onClick={() => {
                    closeModal("RespondToQuote");
                    setShowSuccess(false);
                  }}
                  className="primary"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </Modal>
      )}
    </>
  );
}
