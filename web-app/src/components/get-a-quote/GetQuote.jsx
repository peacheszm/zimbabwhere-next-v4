"use client";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import Dropzone from "@/components/ui/Dropzone";

export default function GetQuote({ cats, towns }) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      files: [],
    },
  });

  const idealStartValue = watch("ideal_start");

  const idealStartOptions = [
    { value: "1", label: "On a specific date" },
    { value: "Whenever", label: "Whenever" },
    { value: "Straight Away", label: "Straight Away" },
  ];

  const onSubmit = async (data) => {
    console.log(data);
  };

  return (
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
          <label htmlFor="details">Quote Details</label>
          <textarea
            id="details"
            rows="7"
            placeholder="Please give full descriptions and be as accurate as you can be of
            what you need - Including all dimensions, sizes, quantities, types
            …etc, to make sure the quote responses you get from the companies
            listed are as accurate as possible."
            {...register("details")}
          ></textarea>
        </div>

        <div className="form_row">
          <label htmlFor="files">File Attachments</label>

          <Controller
            name="files"
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
          <label htmlFor="selectedBusinessCategories">I want quotes from</label>
          <Controller
            name="selectedBusinessCategories"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Select
                {...field}
                inputId="selectedBusinessCategories"
                isMulti
                options={cats}
                onChange={(val) => field.onChange(val)}
                placeholder="Choose multiple headings to reach as many companies as possible…"
              />
            )}
          />
        </div>

        <div className="form_row">
          <label htmlFor="town">Town / City</label>
          <Controller
            name="town"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Select
                {...field}
                inputId="town"
                options={towns}
                onChange={(val) => field.onChange(val)}
                placeholder="Select your town/city/area coverage for the service you need..."
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
            I have read and agree to the Terms and Conditions
          </label>
        </div>

        <div className="form_row btn_group">
          <button type="submit" className="primary">
            Submit
          </button>
        </div>
      </div>
    </form>
  );
}
