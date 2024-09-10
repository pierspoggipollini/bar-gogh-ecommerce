import React, { useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseMethod";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import * as userAuthActions from "../../store/user-auth";
import { FormInput } from "./FormInput";
import { useDispatch } from "react-redux";
import { FormButton } from "./FormButton";
import "./FormCheckInput.css";
import { FormLayout } from "./FormLayout";
import apiBaseUrl from "../../config/apiConfig";
import { callCsrfToken } from "./CallCsrfToken";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormGoogle from "./FormGoogle";

const inputData = [
  {
    label: "Email",
    name: "email",
    htmlFor: "email",
    type: "email",
    placeholder: "example@gmail.com",
  },
  {
    label: "Password",
    name: "password",
    htmlFor: "password",
    type: "password",
    placeholder: "Password",
  },
];

const FormLogin = () => {
  const dispatch = useDispatch();

  // Definisci lo schema della password per il login
  const passwordSchema = z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(20, "Password must be at most 20 characters long")
    .regex(/[A-Z]/, "Password must have at least one uppercase letter")
    .regex(/[a-z]/, "Password must have at least one lowercase letter")
    .regex(/\d/, "Password must have at least one digit")
    .regex(/^[^\s]+$/, "Password must not contain spaces");

  // Usa il schema della password all'interno del tuo oggetto zod per il login
  const loginSchema = z.object({
    email: z.string().email("Please enter a valid email address."),
    password: passwordSchema,
  });

  const {
    register,
    reset,
    handleSubmit,
    clearErrors,
    setError,
    formState: { errors, isSubmitSuccessful, isSubmitting },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const navigate = useNavigate();

  // Effect to navigate after successful submission
  useEffect(() => {
    if (isSubmitSuccessful) {
      const navigationTimeout = setTimeout(() => {
        reset(undefined, { keepIsSubmitSuccessful: false });
        navigate("/dashboard");
      }, 2500);

      return () => {
        clearTimeout(navigationTimeout);
      };
    }
  }, [isSubmitSuccessful, reset, navigate]);

  const login = async (data) => {
    try {
      const { email, password } = data;

      // Authenticate user with email and password
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );

      // Obtain the ID token for the authenticated user
      const idToken = await userCredential.user.getIdToken(/* forceRefresh */);

      // Request CSRF token from the server
      //const requestCsrfToken = await callCsrfToken();
      //const csrfToken = requestCsrfToken.csrfToken;
      // Configura Axios per la chiamata al server
      /*  const axiosConfig = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`, // Includi il token nell'intestazione
        },
      }; */

      // Send ID token and CSRF token to the backend for session login
      const response = await axios.post(`${apiBaseUrl}sessionLogin`, {
        idToken,
      });

      if (response.status !== 200) {
        throw new Error("Failed to login to the server");
      }

      const { sessionToken } = response.data;

      // Salva il sessionToken nel localStorage
      localStorage.setItem("session_JWT_Token", sessionToken);

      // Dispatch action to indicate successful authentication
      dispatch(userAuthActions.activeAuth(true));

      // No need to sign out immediately after successful login
      // auth.signOut();

      clearErrors();
    } catch (error) {
      console.log(error); // Log the error for debugging purposes

      // Handle specific Firebase authentication errors
      switch (error.code) {
        case "auth/invalid-email":
          setError("email", {
            type: "custom",
            message: "The email address is not valid.",
          });
          break;
        case "auth/missing-email":
          setError("email", {
            type: "custom",
            message: "Please insert a valid email.",
          });
          break;
        case "auth/user-not-found":
          setError("email", {
            type: "custom",
            message: "User not found.",
          });
          break;
        case "auth/wrong-password":
          setError("password", {
            type: "custom",
            message:
              "The password is invalid or the user does not have a password.",
          });
          break;
          case "auth/invalid-credential":
            setError("root", {
              type: "custom",
              message:
                "Invalid credential.",
            });
            break;
        case "auth/internal-error":
          setError("root", {
            type: "custom",
            message: "Please check the email or password.",
          });
          break;
        case "auth/too-many-requests":
          setError("root", {
            type: "custom",
            message:
              "Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later.",
          });
          break;
        default:
          setError("root", {
            type: "custom",
            message: error.message,
          });
      }
      return; // Exit function after handling errors
    }
  };

 

  return (
    <FormLayout
      headline="Welcome back! Log in to continue."
      subheadline="Enjoy personalized tea recommendations and more."
      signText="Don't have an account?"
      textLink="Sign Up"
      linkDirect="signup"
      img="bg-login"
      alt="herbal"
      actionTitle="Enter your credentials"
    >
      {errors.root && (
        <div
          className="text-bold mb-6 text-center text-sm text-red-700 "
          role="alert"
        >
          {errors.root.message}
        </div>
      )}
      <form
        id="login"
        className="flex flex-col w-full max-w-80 gap-6"
        onSubmit={handleSubmit(login)}
      >
        {inputData.map((input) => (
          <React.Fragment key={input.name}>
            <FormInput
              label={input.label}
              htmlFor={input.htmlFor}
              type={input.type}
              name={input.name}
              placeholder={input.placeholder}
              register={register}
              error={errors[input.name]?.message}
              ariaInvalid={errors[input.name] ? "true" : "false"}
              ariaDescribedby={`${input.name}-error`}
            />
          </React.Fragment>
        ))}

        <Link
          to="/forgotpassword"
          className=" text-left text-xs underline decoration-1"
        >
          Forgot password?
        </Link>

        <FormButton
          action="Login"
          isSubmitting={isSubmitting}
          isSubmitSuccessful={isSubmitSuccessful}
          loadingText="Loading..."
          ariaLabel="Log In"
        />
      </form>

      <div
        className="   flex w-full max-w-80  border-none py-6  text-xs 
         before:m-0 before:h-2 before:flex-1 before:flex-shrink-0 before:border-b-2 before:border-solid before:border-slate-100 before:content-[''] 
         after:m-0 after:h-2 after:flex-1 after:flex-shrink-0 after:border-b-2 after:border-solid after:border-slate-100 after:content-[''] "
      >
        <span className="m-0 flex-[0.5] flex-shrink-0 text-center uppercase">
          or
        </span>
      </div>
      <div className="flex w-full  justify-center">
        <FormGoogle />
      </div>
    </FormLayout>
  );
};

export default FormLogin;
