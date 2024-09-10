import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FormInput } from "./FormInput";
import * as userAuthActions from "../../store/user-auth";
import axios from "axios";
import { useDispatch } from "react-redux";
import { FormButton } from "./FormButton";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { auth, db } from "../../firebaseMethod";
import { updateProfile } from "firebase/auth";
import { collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { FormLayout } from "./FormLayout";
import apiBaseUrl from "../../config/apiConfig";
import { callCsrfToken } from "./CallCsrfToken";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormPolicy from "./FormPolicy";

// Input field data
const inputData = [
  {
    label: "First Name",
    name: "firstName",
    htmlFor: "firstName",
    type: "text",
    placeholder: "First Name",
  },
  {
    label: "Last Name",
    name: "lastName",
    htmlFor: "LastName",
    type: "text",
    placeholder: "Last Name",
  },
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
  {
    label: "Confirm Password",
    name: "confirmPassword",
    htmlFor: "confirmPassword",
    type: "password",
    placeholder: "Confirm Password",
  },
];

// Component for sign-up form
const FormSignUp = () => {
  // Zod schema for form validation
  const signUpSchema = z
    .object({
      firstName: z
        .string()
        .min(1, "First name is required")
        .regex(/^[a-zA-Z\s]+$/, "Invalid first name"),
      lastName: z
        .string()
        .min(1, "Last name is required")
        .regex(/^[a-zA-Z\s]+$/, "Invalid last name"),
      email: z.string().email("Invalid email address"),
      password: z
        .string()
        .min(8, "Password must be at least 8 characters long")
        .max(20, "Password must be at most 20 characters long")
        .regex(/[A-Z]/, "Password must have at least one uppercase letter")
        .regex(/[a-z]/, "Password must have at least one lowercase letter")
        .regex(/\d/, "Password must have at least one digit")
        .regex(/^[^\s]+$/, "Password must not contain spaces")
        .refine((value) => !["Passw0rd", "Password123"].includes(value), {
          message: "This password is blacklisted",
        }),
      confirmPassword: z
        .string()
        .min(8, "Confirm Password must be at least 8 characters long")
        .max(20, "Confirm Password must be at most 20 characters long"),
      policyAccepted: z.boolean().refine((value) => value === true, {
        message: "You must accept the privacy policy",
      }),
    })
    .superRefine((data, ctx) => {
      if (data.password !== data.confirmPassword) {
        ctx.addIssue({
          code: "custom",
          message: "Passwords don't match",
          path: ["confirmPassword"],
        });
      }
    });

  // React Hook Form setup with Zod resolver
  const {
    register,
    handleSubmit,
    setError,
    reset,
    watch,
    clearErrors,
    formState: { errors, touchedFields, isSubmitting, isSubmitSuccessful },
  } = useForm({
    resolver: zodResolver(signUpSchema),
  });

  // Dispatch and navigate hooks
  const dispatch = useDispatch();
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

  // Form submission handler
  const OnSubmitUser = async (data) => {
    try {
      const { firstName, lastName, email, password, confirmPassword } = data;

      clearErrors(); // Clear all errors from React Hook Form state

      // Create user with email and password using Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      // Send email verification to the user
      await sendEmailVerification(auth.currentUser);

      // Construct display name from first name and last name
      const displayName = `${firstName} ${lastName}`;

      // Update user profile with additional data
      await updateProfile(auth.currentUser, {
        displayName: displayName,
      });

      // Obtain ID token for the authenticated user
      const idToken = await userCredential.user.getIdToken();

      // Request CSRF token from the server
      //const requestCsrfToken = await callCsrfToken();
      //const csrfToken = requestCsrfToken.csrfToken;

      // Save user information in Firestore
      const userRef = await setDoc(
        doc(collection(db, "users"), userCredential.user.uid),
        {
          fullName: displayName,
          firstName: firstName,
          lastName: lastName,
          email: userCredential.user.email,
          uid: userCredential.user.uid,
          timestamp: serverTimestamp(),
        },
      );

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
    } catch (error) {
      console.group(error);
      // Handle different types of errors
      if (error.status === 401) {
        setError("root", {
          type: "custom",
          message: "Unauthorized. Please log in.",
        });
      } else if (error.status === 500) {
        setError("root", {
          type: "custom",
          message: "Internal server error. Please try again later.",
        });
      } else {
        switch (error.code) {
          case "auth/invalid-email":
            setError("email", {
              type: "custom",
              message: "Email address is not valid.",
            });
            break;
          case "auth/missing-email":
            setError("email", {
              type: "custom",
              message: "Please insert a valid email.",
            });
            break;
          case "auth/email-already-exists":
            setError("email", {
              type: "custom",
              message: "Email address already exists.",
            });
            break;
          case "auth/email-already-in-use":
            setError("email", {
              type: "custom",
              message: "Email address already in use.",
            });
            break;
          case "auth/weak-password":
            setError("password", {
              type: "custom",
              message: "Password is too weak.",
            });
            break;
          case "auth/invalid-password":
            setError("password", {
              type: "custom",
              message: "Invalid password.",
            });
            break;
          case "auth/wrong-password":
            setError("password", {
              type: "custom",
              message: "Incorrect password.",
            });
            break;
          default:
            setError("root", {
              type: "custom",
              message: error.message,
            });
        }
      }
      return; // Exit function after handling errors
    }
  };
  /*  const PasswordRequirements = (
      <p className="text-xs flex -mt-1 flex-col text-gray-600">
        Your password must meet the following criteria:
        <ul className="list-disc grid gap-2 pl-6 mt-2">
          <li>Length: Must be between 8 and 20 characters long.</li>
          <li>
            Characters: Must include at least one uppercase letter, one
            lowercase letter, and one digit.
          </li>
          <li>Spaces: Must not contain any spaces.</li>
          <li>
            Blacklist: Cannot be a common password like "Passw0rd" or
            "Password123".
          </li>
        </ul>
      </p>
    ); */

  return (
    <>
      <FormLayout
        headline="Sign up for a world of flavors and health benefits."
        subheadline="Immerse yourself in the soothing taste of our herbal teas."
        signText="Do you have already an account?"
        textLink="Sign In"
        linkDirect="login"
        img="bg-signup"
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
          id="signUp"
          onSubmit={handleSubmit(OnSubmitUser)}
          className="flex flex-col w-full max-w-80 gap-6"
        >
          {inputData.map((input) => {
            return (
              <React.Fragment key={input.name}>
                <FormInput
                  type={input.type}
                  name={input.name}
                  placeholder={input.placeholder}
                  label={input.label}
                  htmlFor={input.name}
                  register={register}
                  error={errors[input.name]?.message}
                  ariaInvalid={errors[input.name] ? "true" : "false"}
                  ariaDescribedby={`${input.name}-error`}
                />
              </React.Fragment>
            );
          })}

          <FormPolicy
            register={register}
            name="policyAccepted"
            error={errors["policyAccepted"]?.message}
          />

          <FormButton
            action="Sign up"
            isSubmitting={isSubmitting}
            isSubmitSuccessful={isSubmitSuccessful}
            loadingText="Loading..."
            ariaLabel="Sign Up"
          />
        </form>
      </FormLayout>
    </>
  );
};

export default FormSignUp;
