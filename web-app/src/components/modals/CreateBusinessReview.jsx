import React from "react";
import Modal from "@/components/global/Modal";
import { useModal } from "@/contexts/ModalContext";
import { useForm, Controller } from "react-hook-form";
import { createBusinessReview } from "@/lib/endpoints/business";
import { IconStar, IconStarFilled } from "@tabler/icons-react";

export default function CreateBusinessReview() {
  const { isModalOpen, getModalProps, closeModal } = useModal();
  const isOpen = isModalOpen("CreateBusinessReview");
  const modalProps = getModalProps("CreateBusinessReview");

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      rating: 5,
    },
  });

  const [showSuccess, setShowSuccess] = React.useState(false);

  const onSubmit = async (data) => {
    try {
      const result = await createBusinessReview(modalProps.business_id, {
        author: data.author,
        email: data.email,
        rating: data.rating,
        content: data.content,
      });

      if (result) {
        setShowSuccess(true);
        reset();
      }
    } catch (error) {
      console.error("Failed to submit review:", error);
    }
  };

  return (
    <>
      {isOpen && (
        <Modal
          title={`Write a Review for ${modalProps.business_title}`}
          onClose={() => {
            closeModal("CreateBusinessReview");
            setShowSuccess(false);
          }}
        >
          {!showSuccess ? (
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="form_wrapper">
                <div className="form_row">
                  <label htmlFor="author">Your Name</label>
                  <input
                    id="author"
                    type="text"
                    {...register("author", { required: "Name is required" })}
                  />
                  {errors.author && (
                    <span className="error">{errors.author.message}</span>
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
                  <label htmlFor="rating">Your Rating</label>
                  <Controller
                    name="rating"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <div className="star_rating_input">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => field.onChange(star)}
                            className="star_btn"
                          >
                            {star <= field.value ? (
                              <IconStarFilled size={24} color="#FFD700" />
                            ) : (
                              <IconStar size={24} />
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  />
                </div>

                <div className="form_row">
                  <label htmlFor="content">Your Review</label>
                  <textarea
                    id="content"
                    {...register("content", {
                      required: "Review content is required",
                    })}
                  ></textarea>
                  {errors.content && (
                    <span className="error">{errors.content.message}</span>
                  )}
                </div>

                <div className="form_row btn_group">
                  <button
                    type="submit"
                    className="primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Review"}
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <div className="success_message">
              <h3>Thank you!</h3>
              <p>Your review has been submitted successfully.</p>
              <div className="btn_group mt-4">
                <button
                  onClick={() => {
                    closeModal("CreateBusinessReview");
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
