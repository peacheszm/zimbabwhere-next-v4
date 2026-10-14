"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { useSearchParams } from "next/navigation";

import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import Dropzone from "@/components/ui/Dropzone";
import { createQuote } from "@/lib/endpoints/quotes";

import { useModal } from "@/contexts/ModalContext";

import ThankYouQuoteModal from "@/components/modals/ThankYouQuote";
import { decodeHtml } from "@/lib/utils/decodeHtml";

// A lone checkbox gives back a string (or false) instead of a list
const toIdList = (value) =>
  (Array.isArray(value) ? value : [value]).filter(
    (item) => typeof item === "string" && item !== "",
  );

export default function GetQuote({ cats, towns, business }) {
  const searchParams = useSearchParams();
  const bid = searchParams.get("bid");

  const { openModal, closeModal } = useModal();
  const [isManualSubmitting, setIsManualSubmitting] = useState(false);
  const [categoryInputValue, setCategoryInputValue] = useState("");
  const [submitError, setSubmitError] = useState(null);

  const decodedCats = useMemo(
    () =>
      cats.map((cat) => ({
        ...cat,
        label: decodeHtml(cat.label),
      })),
    [cats],
  );

  const decodedTowns = useMemo(
    () =>
      towns.map((town) => ({
        ...town,
        label: decodeHtml(town.label),
      })),
    [towns],
  );

  const handleOpenModal = () => {
    openModal("ThankYouQuoteModal");
  };

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      quote_files: [],
      quote_from_company: business?.id || "",
      sendToOthers: false,
      selectedBusinessCategories: [],
    },
  });

  const idealStartValue = watch("ideal_start");
  const sendToOthers = watch("sendToOthers");
  const chosenBusinessCategories = toIdList(watch("selectedBusinessCategories"));
  const chosenCategories = watch("quote_from_category") || [];

  const businessName = decodeHtml(business?.title?.rendered || "this business");
  const businessHeadings = business?._embedded?.["wp:term"]?.[0] || [];

  // Spell out who the quote goes to, so nobody sends it to more (or fewer)
  // businesses than they meant to
  const recipientSummary = (() => {
    if (business) {
      if (!sendToOthers) {
        return {
          tone: "single",
          text: `Your quote will be sent to ${businessName} only.`,
        };
      }
      const headingNames = businessHeadings
        .filter((item) => chosenBusinessCategories.includes(String(item.id)))
        .map((item) => decodeHtml(item.name));
      if (headingNames.length === 0) {
        return {
          tone: "warn",
          text: `Choose at least one heading to also reach other businesses, or untick the option above to send your quote to ${businessName} only.`,
        };
      }
      return {
        tone: "broad",
        text: `Your quote will be sent to ${businessName} and to other businesses listed under: ${headingNames.join(", ")}.`,
      };
    }

    if (chosenCategories.length === 0) {
      return {
        tone: "warn",
        text: "Choose at least one heading above. Your quote is sent to the businesses listed under the headings you choose.",
      };
    }
    return {
      tone: "broad",
      text: `Your quote will be sent to businesses listed under: ${chosenCategories
        .map((cat) => decodeHtml(cat.label))
        .join(", ")}.`,
    };
  })();

  const idealStartOptions = [
    { value: "1", label: "On a specific date" },
    { value: "Whenever", label: "Whenever" },
    { value: "Straight Away", label: "Straight Away" },
  ];

  const onInvalid = () => {
    setSubmitError(
      "Some details are missing or incorrect. Please check the fields marked in red.",
    );
  };

  const onSubmit = async (data) => {
    if (isManualSubmitting) return;
    setIsManualSubmitting(true);
    setSubmitError(null);

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
        JSON.stringify(data.quote_from_category),
      );
    } else if (
      // Other businesses only get the quote when that option is ticked
      data.sendToOthers &&
      toIdList(data.selectedBusinessCategories).length > 0
    ) {
      formData.append(
        "quote_from_category",
        JSON.stringify(toIdList(data.selectedBusinessCategories)),
      );
    }

    if (data.quote_from_company) {
      formData.append("quote_from_company", data.quote_from_company);
    }

    if (data.ideal_start) {
      formData.append("ideal_start", JSON.stringify(data.ideal_start));
    }

    if (data.start_date) {
      formData.append("start_date", data.start_date.toISOString());
    }

    if (data.quote_expire) {
      formData.append("quote_expire", data.quote_expire.toISOString());
    }

    // Files handling
    if (data.quote_files && data.quote_files.length > 0) {
      Array.from(data.quote_files).forEach((file) => {
        formData.append("quote_files[]", file);
      });
    }

    try {
      const result = await createQuote(formData);
      if (result?.success) {
        reset();
        handleOpenModal();
      } else {
        setSubmitError(
          "We couldn't send your quote. Please check your details and try again.",
        );
      }
    } catch (error) {
      console.error("Submission failed:", error);
      setSubmitError(
        "We couldn't send your quote. Please check your connection and try again.",
      );
    } finally {
      setIsManualSubmitting(false);
    }
  };

  const resetForm = () => {
    reset();
    setSubmitError(null);
    closeModal("ThankYouQuoteModal");
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit, onInvalid)}>
        {business && (
          <div className="form_wrapper">
            <input type="hidden" {...register("quote_from_company")} />
            <div className="form_row quote_recipients">
              <label>Who will receive this quote?</label>
              <div className="recipient_main">
                <strong>{businessName}</strong> will always receive your quote.
              </div>

              <div className="form_row checkbox recipient_toggle">
                <input
                  id="sendToOthers"
                  type="checkbox"
                  {...register("sendToOthers")}
                />
                <label htmlFor="sendToOthers">
                  Also send my quote to other businesses
                </label>
              </div>

              {sendToOthers && (
                <>
                  <p className="field_desc">
                    Choose the headings to send it to. Every business listed
                    under a ticked heading will receive your quote.
                  </p>
                  <div className="b_categorys">
                    {businessHeadings.map((item) => (
                      <div key={item.id} className="form_row checkbox">
                        <input
                          id={`cat${item.id}`}
                          type="checkbox"
                          value={item.id}
                          {...register("selectedBusinessCategories", {
                            validate: (value) =>
                              !getValues("sendToOthers") ||
                              toIdList(value).length > 0 ||
                              "Choose at least one heading",
                          })}
                        />
                        <label htmlFor={`cat${item.id}`}>
                          {decodeHtml(item.name)}
                        </label>
                      </div>
                    ))}
                  </div>
                  {errors.selectedBusinessCategories && (
                    <span className="error_msg">
                      {errors.selectedBusinessCategories.message}
                    </span>
                  )}
                </>
              )}

              <div className={`recipient_summary ${recipientSummary.tone}`}>
                {recipientSummary.text}
              </div>
            </div>
          </div>
        )}
        <div className="form_wrapper">
          <div className="form_row">
            <label htmlFor="title">Quote Title *</label>
            <input
              id="title"
              type="text"
              className={errors.title ? "error" : ""}
              placeholder="Tell us what you want"
              {...register("title", { required: "Please tell us what you want" })}
            />
            {errors.title && (
              <span className="error_msg">{errors.title.message}</span>
            )}
          </div>

          <div className="form_row">
            <label htmlFor="description">Quote Details *</label>
            <textarea
              id="description"
              rows="7"
              className={errors.description ? "error" : ""}
              placeholder="Please give full descriptions and be as accurate as you can be of
            what you need - Including all dimensions, sizes, quantities, types
            …etc, to make sure the quote responses you get from the companies
            listed are as accurate as possible."
              {...register("description", {
                required: "Please describe what you need",
              })}
            ></textarea>
            {errors.description && (
              <span className="error_msg">{errors.description.message}</span>
            )}
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

          {!business && (
            <div className="form_row">
              <label htmlFor="quote_from_category">I want quotes from *</label>
              <Controller
                name="quote_from_category"
                control={control}
                rules={{ required: "Choose at least one heading" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    inputId="quote_from_category"
                    isMulti
                    closeMenuOnSelect={false}
                    inputValue={categoryInputValue}
                    onInputChange={(val, { action }) => {
                      if (action !== "set-value") {
                        setCategoryInputValue(val);
                      }
                    }}
                    options={decodedCats}
                    onChange={(val) => field.onChange(val)}
                    placeholder="Choose multiple headings to reach as many companies as possible…"
                    classNamePrefix="react-select"
                    menuPlacement="top"
                  />
                )}
              />
              {errors.quote_from_category && (
                <span className="error_msg">
                  {errors.quote_from_category.message}
                </span>
              )}
            </div>
          )}

          <div className="form_row">
            <label htmlFor="town_city">Town / City *</label>
            <Controller
              name="town_city"
              control={control}
              rules={{ required: "Please select your town / city" }}
              render={({ field }) => (
                <Select
                  {...field}
                  inputId="town_city"
                  options={decodedTowns}
                  onChange={(val) => field.onChange(val)}
                  placeholder="Select your town/city/area coverage for the service you need..."
                  classNamePrefix="react-select"
                  menuPlacement="top"
                />
              )}
            />
            {errors.town_city && (
              <span className="error_msg">{errors.town_city.message}</span>
            )}
          </div>

          <div className="form_row">
            <label htmlFor="ideal_start">Ideal Start *</label>
            <Controller
              name="ideal_start"
              control={control}
              rules={{ required: "Please choose when you'd like to start" }}
              render={({ field }) => (
                <Select
                  {...field}
                  inputId="ideal_start"
                  options={idealStartOptions}
                  onChange={(val) => field.onChange(val)}
                  placeholder="Select a date."
                  classNamePrefix="react-select"
                  menuPlacement="top"
                />
              )}
            />
            {errors.ideal_start && (
              <span className="error_msg">{errors.ideal_start.message}</span>
            )}
          </div>
          <div className="form_row">
            <label htmlFor="quote_expire">Quote expiry date</label>
            <p className="field_desc">
              Optional. When do you want to hide this quote?
            </p>
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
                rules={{ required: "Please select a start date" }}
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
              {errors.start_date && (
                <span className="error_msg">{errors.start_date.message}</span>
              )}
            </div>
          )}

          <div className="form_row">
            <label htmlFor="phone">How you wish to be contacted *</label>
            <p className="field_desc">
              Businesses use these details to respond to your quote. Enter a
              phone / WhatsApp number, an email, or both.
            </p>
            <input
              id="phone"
              type="tel"
              className={errors.phone ? "error" : ""}
              placeholder="Whatsapp / Phone Call"
              {...register("phone", {
                validate: (value) =>
                  value?.trim() ||
                  getValues("email")?.trim() ||
                  "Please enter a phone / WhatsApp number or an email address",
              })}
            />
            <input
              id="email"
              type="email"
              className={errors.email ? "error" : ""}
              placeholder="Email"
              {...register("email", {
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: "Please enter a valid email address",
                },
              })}
            />
            {(errors.phone || errors.email) && (
              <span className="error_msg">
                {errors.phone?.message || errors.email?.message}
              </span>
            )}
          </div>

          <div className="form_row">
            <label htmlFor="name">Your Contact Name *</label>
            <input
              id="name"
              type="text"
              className={errors.name ? "error" : ""}
              placeholder="John Doe"
              {...register("name", { required: "Please enter your name" })}
            />
            {errors.name && (
              <span className="error_msg">{errors.name.message}</span>
            )}
          </div>

          <div className="form_row checkbox">
            <input
              type="checkbox"
              {...register("terms", {
                required: "Please agree to the Terms and Conditions",
              })}
              id="terms"
            />
            <label htmlFor="terms">
              I have read and agree to the{" "}
              <Link href="/terms-and-conditions">Terms and Conditions</Link>
            </label>
            {errors.terms && (
              <span className="error_msg">{errors.terms.message}</span>
            )}
          </div>

          <div className="form_row">
            <div className={`recipient_summary ${recipientSummary.tone}`}>
              {recipientSummary.text}
            </div>
          </div>

          {submitError && (
            <div className="form_row error_box">
              <p>{submitError}</p>
            </div>
          )}

          <div className="form_row btn_group">
            <button
              type="submit"
              className="primary"
              disabled={isSubmitting || isManualSubmitting}
            >
              {isSubmitting || isManualSubmitting
                ? "Busy sending..."
                : "Submit"}
            </button>
          </div>
        </div>
      </form>

      <ThankYouQuoteModal clearForm={resetForm} />
    </>
  );
}
