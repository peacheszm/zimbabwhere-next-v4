"use client";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import Dropzone from "@/components/ui/Dropzone";
import { createQuote } from "@/lib/endpoints/quotes";

import { useModal } from "@/contexts/ModalContext";

import ThankYouQuoteModal from "@/components/modals/ThankYouQuote";

export default function GetQuote({ cats, towns }) {
  const { openModal, closeModal } = useModal();

  const handleOpenModal = () => {
    openModal("ThankYouQuoteModal");
  };
  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      quote_files: [],
    },
  });

  const idealStartValue = watch("ideal_start");

  const idealStartOptions = [
    { value: "1", label: "On a specific date" },
    { value: "Whenever", label: "Whenever" },
    { value: "Straight Away", label: "Straight Away" },
  ];

  const onSubmit = async (data) => {
    const formData = new FormData();

    // Basic fields
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("phone", data.phone);
    formData.append("email", data.email);
    formData.append("name", data.name);
    formData.append("terms", data.terms);

    // Object fields - stringify for backend
    if (data.town_city) {
      formData.append("town_city", JSON.stringify(data.town_city));
    }

    if (data.quote_from_category) {
      formData.append(
        "quote_from_category",
        JSON.stringify(data.quote_from_category)
      );
    }

    if (data.ideal_start) {
      formData.append("ideal_start", JSON.stringify(data.ideal_start));
    }

    if (data.start_date) {
      formData.append("start_date", data.start_date.toISOString());
    }

    formData.append("quote_expire", data.quote_expire.toISOString());

    // Files handling
    if (data.quote_files && data.quote_files.length > 0) {
      Array.from(data.quote_files).forEach((file) => {
        formData.append("quote_files[]", file);
      });
    }

    try {
      const result = await createQuote(formData);
      if (result.success) {
        handleOpenModal();
      }
    } catch (error) {
      console.error("Submission failed:", error);
    }
  };

  const resetForm = () => {
    reset();
    closeModal("ThankYouQuoteModal");
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form_wrapper">
          <div className="form_row">
            <label htmlFor="title">Quote Title</label>
            <input
              id="title"
              type="text"
              placeholder="Tell us what you want"
              {...register("title")}
            />
          </div>

          <div className="form_row">
            <label htmlFor="description">Quote Details</label>
            <textarea
              id="description"
              rows="7"
              placeholder="Please give full descriptions and be as accurate as you can be of
            what you need - Including all dimensions, sizes, quantities, types
            …etc, to make sure the quote responses you get from the companies
            listed are as accurate as possible."
              {...register("description")}
            ></textarea>
          </div>

          <div className="form_row">
            <label htmlFor="quote_files">File Attachments</label>

            <Controller
              name="quote_files"
              control={control}
              defaultValue={[]}
              render={({ field }) => (
                <Dropzone
                  files={field.value}
                  onFilesChange={(files) => field.onChange(files)}
                  maxFiles={10}
                  title="Drop files / Images here, to help show what you need."
                />
              )}
            />
          </div>

          <div className="form_row">
            <label htmlFor="quote_from_category">I want quotes from</label>
            <Controller
              name="quote_from_category"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  {...field}
                  inputId="quote_from_category"
                  isMulti
                  options={cats}
                  onChange={(val) => field.onChange(val)}
                  placeholder="Choose multiple headings to reach as many companies as possible…"
                  classNamePrefix="react-select"
                />
              )}
            />
          </div>

          <div className="form_row">
            <label htmlFor="town_city">Town / City</label>
            <Controller
              name="town_city"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  {...field}
                  inputId="town_city"
                  options={towns}
                  onChange={(val) => field.onChange(val)}
                  placeholder="Select your town/city/area coverage for the service you need..."
                  classNamePrefix="react-select"
                />
              )}
            />
          </div>

          <div className="form_row">
            <label htmlFor="ideal_start">Ideal Start</label>
            <Controller
              name="ideal_start"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  {...field}
                  inputId="ideal_start"
                  options={idealStartOptions}
                  onChange={(val) => field.onChange(val)}
                  placeholder="Select a date."
                  classNamePrefix="react-select"
                />
              )}
            />
          </div>
          <div className="form_row">
            <label htmlFor="ideal_start">Quote expiry date</label>
            <p>When do you wnt to hide this quote</p>
            <Controller
              name="quote_expire"
              control={control}
              rules={{ required: false }}
              render={({ field }) => (
                <DatePicker
                  id="quote_expire"
                  selected={field.value}
                  onChange={(date) => field.onChange(date)}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Select a date"
                />
              )}
            />
          </div>
          {idealStartValue?.value === "1" && (
            <div className="form_row">
              <label htmlFor="start_date">Select a date</label>
              <Controller
                name="start_date"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <DatePicker
                    id="start_date"
                    selected={field.value}
                    onChange={(date) => field.onChange(date)}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Select a date"
                  />
                )}
              />
            </div>
          )}

          <div className="form_row">
            <label htmlFor="phone">How you wish to be contacted</label>
            <input
              id="phone"
              type="tel"
              placeholder="Whatsapp / Phone Call"
              {...register("phone")}
            />
            <input
              id="email"
              type="email"
              placeholder="Email"
              {...register("email")}
            />
          </div>

          <div className="form_row">
            <label htmlFor="name">Your Contact Name</label>
            <input
              id="name"
              type="text"
              placeholder="John Doe"
              {...register("name")}
            />
          </div>

          <div className="form_row checkbox">
            <input type="checkbox" {...register("terms")} id="terms" />
            <label htmlFor="terms">
              I have read and agree to the{" "}
              <Link href="/terms-and-conditions">Terms and Conditions</Link>
            </label>
          </div>

          <div className="form_row btn_group">
            <button type="submit" className="primary">
              Submit
            </button>
          </div>
        </div>
      </form>

      <ThankYouQuoteModal clearForm={resetForm} />
    </>
  );
}
