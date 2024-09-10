import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import icon from "../../assets/loading.svg";
import { motion } from "framer-motion";
import apiBaseUrl from "../../config/apiConfig";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export const FooterNewsletter = () => {
  const schema = z.object({
    email: z.string().email("Please enter a valid email address."),
  });

  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors, isSubmitSuccessful, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmitNewsletter = async (data) => {
    const { email } = data;

    try {
      setIsLoading(true);
      const response = await axios.post(`${apiBaseUrl}newsletter`, {
        email,
      });
      clearErrors();
    } catch (error) {
      setError("root", {
        type: "manual",
        message: "Error saving email.",
      });
    }
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      const navigationTimeout = setTimeout(() => {
        reset(undefined, { keepIsSubmitSuccessful: false });
      }, 2500);

      return () => {
        clearTimeout(navigationTimeout);
      };
    }
  }, [isSubmitSuccessful, reset]);

  return (
    <>
    
      <div className=" mt-3 mb-8 flex max-w-md flex-col gap-4">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="font-semibold uppercase">Newsletter</h1>
          <p className="text-sm">
            Subscribe to our newsletter to stay up-to-date on the latest news
            and promotions!
          </p>
        </div>

        <form
        id="form-newsletter"
          onSubmit={handleSubmit(onSubmitNewsletter)}
          className=" flex flex-col gap-5  text-primary-black md:items-center"
        >
          <input
            className={` ${
              errors
                ? "border-b-red-500 text-red-500"
                : "border-b-slate-400 text-primary-black"
            } w-full border-b border-b-slate-600 bg-transparent p-2 text-base outline-none placeholder:text-primary-black`}
            placeholder="Enter e-mail here..."
            type="text"
            id="emailNewsletter"
            autoComplete="email"
            {...register("email")}
          />
          {errors["email"] && (
            <span className="text-sm  text-red-500">
              {errors["email"].message}
            </span>
          )}

          <motion.button
            whileTap={{ scale: 0.95 }}
            type="submit"
            title="Subscribe"
            aria-label="Subscribe"
            className=" flex w-full cursor-pointer items-center font-semibold justify-center gap-2 rounded-md  border-none bg-primary-btn py-2 px-5 uppercase text-primary-black md:w-1/2 lg:hover:bg-primary-hover"
            disabled={isSubmitting}
          >
            {isSubmitting && <img src={icon} />}
            <span>
              {isSubmitting
                ? "Processing..."
                : isSubmitSuccessful
                  ? "Sent"
                  : "Subscribe"}
            </span>
          </motion.button>
          {isSubmitSuccessful && (
            <span className="text-center text-sm uppercase">
              Thank you for subscribing!
            </span>
          )}
          {errors.root && (
            <>
              <span className="text-center text-sm uppercase text-red-500">
                {errors.root.message}
              </span>
            </>
          )}
        </form>
      </div>
    </>
  );
};
