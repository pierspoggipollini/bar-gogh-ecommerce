import React, { useEffect, useState } from "react";
import { ForwardToInboxOutlined } from "@mui/icons-material";
import TextArea from "../Input/TextArea";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import apiBaseUrl from "../../config/apiConfig";
import { motion } from "framer-motion";
import ContactInfoData from "../Footer/ContactInfoData";
import InfoLayout from "../Layout/InfoLayout";
import InputHookForm from "../Input/InputHookForm";
import { FormButton } from "../Form/FormButton";

// Define form input fields
const ContactInput = [
  {
    label: "First Name",
    name: "firstName",
    placeholder: "First Name",
    type: "text",
  },
  {
    label: "Last Name",
    name: "lastName",
    placeholder: "Last Name",
    type: "text",
  },
  {
    label: "Email",
    name: "email",
    placeholder: "example@gmail.com",
    type: "text",
  },
];

// Define validation schema using zod
const contactSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .regex(/^[a-zA-Z]+$/, "Invalid first name"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .regex(/^[a-zA-Z]+$/, "Invalid last name"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(1, "Message is required"),
});

const Contacts = () => {
  const {
    register,
    handleSubmit,
    setError,
    reset,
   
    formState: { errors, touchedFields, isSubmitting, isSubmitSuccessful },
  } = useForm({
    resolver: zodResolver(contactSchema),
  });

  const [message, setMessage] = useState("");

  // Manual reset of the submit success state
  useEffect(() => {
    if (isSubmitSuccessful) {
      const timer = setTimeout(() => {
        reset(undefined, { keepIsSubmitSuccessful: false });
      }, 2000); // Set a timeout to reset the state
      return () => clearTimeout(timer);
    }
  }, [isSubmitSuccessful, reset]);

  const onSubmit = async (data) => {
    setMessage("");
    try {
      const response = await axios.post(`${apiBaseUrl}send-message`, data);

      if (response.status === 201) {
        // Message sent successfully
        setMessage(response.data);
      } else {
        setMessage("");
        // Handle unexpected response status
        throw new Error("Unexpected response from server.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setError("root", {
        message:
          error.response?.data?.error ||
          error.message ||
          "Internal server problem.",
      });
    }
  };

  return (
    <>
      <InfoLayout firstTitle="Contact" secondTitle="Us">
        <motion.div
          initial={{
            opacity: 0,
            x: -100,
          }}
          whileInView={{
            opacity: 1,
            x: 0,
            transition: {
              duration: 0.7,
            },
          }}
          viewport={{ once: true }}
          className="h-full w-auto flex flex-col lg:flex-row my-10 mx-3 items-center lg:items-start gap-10 lg:justify-evenly"
        >
          <div className="h-auto max-w-xl p-4 rounded-lg bg-slate-100">
            <div className="flex flex-col gap-5">
              <h1 className="text-xl font-medium">Have a question?</h1>
              <p className="text-sm text-balance">
                Fill this form for any question about the product and services.
                Please do not fill out this form for any other purpose.
              </p>
            </div>
            <form
              id="contacts"
              onSubmit={handleSubmit(onSubmit)}
              className="grid my-6 max-w-md gap-8"
            >
              {ContactInput.map((input) => (
                <div key={input.name}>
                  <InputHookForm
                    name={input.name}
                    label={input.label}
                    placeholder={input.placeholder}
                    type={input.type}
                    register={register}
                    error={errors[input.name]?.message}
                    ariaInvalid={errors[input.name] ? "true" : "false"}
                    ariaDescribedby={`${input.name}-error`}
                  />
                </div>
              ))}
              <div>
                <TextArea
                  register={register}
                  name="message"
                  label="Message"
                  placeholder=""
                  error={errors.message?.message}
                  ariaInvalid={errors.message ? "true" : "false"}
                  ariaDescribedby="message-error"
                />
              </div>
              <FormButton
                isSubmitting={isSubmitting}
                isSubmitSuccessful={isSubmitSuccessful}
                action="Send"
                loadingText="Sending..."
                ariaLabel="Send message"
              />
              
              {isSubmitSuccessful && (
                <div className="text-sm -mt-3 text-green-600">
                  {message} <ForwardToInboxOutlined aria-label="Success icon" />
                </div>
              )}
              {errors.root && (
                <div className="text-red-600 text-sm" role="alert">
                  {errors.root.message}
                </div>
              )}
            </form>
          </div>
          <motion.div
            initial={{
              opacity: 0,
              x: 200,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
              transition: {
                duration: 0.7,
              },
            }}
            viewport={{ once: true }}
            className="min-h-72 overflow-hidden w-auto lg:w-1/2 max-w-sm p-6 rounded-lg bg-slate-300"
          >
            <div className="flex flex-col gap-4">
              <h1 className="font-medium text-lg">Get in Touch</h1>
              <p className="text-sm text-balance">
                We love to hear from you. Our friendly team is always here to
                chat.
              </p>

              <div className="flex pt-3 gap-4 flex-col">
                {ContactInfoData.map((data) => (
                  <div className="flex gap-4 items-center">
                    <span className="w-18 h-18 p-2 rounded-full bg-slate-100">
                      {data.icon}
                    </span>
                    <div className="flex gap-1 flex-col">
                      <span className="text-sm font-medium">
                        {data.category}
                      </span>
                      <span className="text-sm">{data.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </InfoLayout>
    </>
  );
};

export default Contacts;
