import React, { useEffect, useState } from "react";
import { FormInput } from "./FormInput";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FormButton } from "./FormButton";
import { FormLayout } from "./FormLayout";
import axios from "axios";
import apiBaseUrl from "../../config/apiConfig";
import { zodResolver } from "@hookform/resolvers/zod";

const ForgotPassword = () => {
  const [confirm, setConfirm] = useState(""); // State to manage confirmation message

  const navigate = useNavigate(); // React Router hook for navigation

  // Schema for form validation using Zod
  const schema = z.object({
    email: z.string().email("Invalid email address"),
  });

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    clearErrors,
    setError,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm({ resolver: zodResolver(schema) });

  // Function to send password reset email using Axios
  const sendPasswordResetEmail = async (email) => {
    try {
      const response = await axios.post(`${apiBaseUrl}sendPasswordResetEmail`, {
        email,
      });
      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  // Function to handle form submission for resetting password
  const resetPassword = async (data) => {
    const { email } = data;
    try {
      await sendPasswordResetEmail(email);
      setConfirm("Password reset email sent!");
      clearErrors(); // Clear any previous errors upon successful submission
    } catch (error) {
      // Handle specific error cases
      if (error.response && error.response.status === 400) {
        setError("email", {
          type: "custom",
          message: "The email address is not valid.",
        });
      } else {
        setError("root", {
          type: "custom",
          message:
            error.message || "An error occurred. Please try again later.",
        });
      }
      return;
    }
  };

  // Effect to navigate to login page after successful form submission
  useEffect(() => {
    if (isSubmitSuccessful) {
      const navigationTimeout = setTimeout(() => {
        reset(undefined, { keepIsSubmitSuccessful: false });
        navigate("/login"); // Navigate to login page after 2.5 seconds
      }, 2500);

      return () => {
        clearTimeout(navigationTimeout); // Clear timeout on component unmount
      };
    }
  }, [isSubmitSuccessful, reset, navigate]);

  return (
    <>
      <FormLayout
        headline="Forgot Your Password?"
        subheadline="We'll help you get back into your account."
        signText="Remember your password?"
        textLink="Back to Login"
        linkDirect="login"
        img="bg-forgotPassword"
        alt="herbal"
        actionTitle="Enter your email"
      >
        {errors.root && (
          <div
            className="text-bold mb-6 text-center text-sm text-red-700"
            role="alert"
          >
            {errors.root.message}
          </div>
        )}
        <form
          id="forgot-password"
          onSubmit={handleSubmit(resetPassword)}
          className="flex flex-col w-full max-w-80 gap-6"
        >
          <FormInput
            label="Email"
            htmlFor="email"
            type="text"
            placeholder="example@gmail.com"
            register={register}
            name="email"
            error={errors.email?.message}
            ariaInvalid={errors.email ? "true" : "false"}
            ariaDescribedby={`email-error`}
          />

          <FormButton
            isSubmitSuccessful={isSubmitSuccessful}
            isSubmitting={isSubmitting}
            action="Reset Password"
            loadingText="Wait..."
            ariaLabel="Reset Password"
          />

          {/* Confirmation message displayed after successful password reset */}
          {confirm && (
            <p className="text-semibold -mt-2 mb-4 w-full text-center text-sm text-primary-black">
              {confirm}
            </p>
          )}
        </form>
      </FormLayout>
    </>
  );
};

export default ForgotPassword;
