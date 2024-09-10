import React, { useState } from "react";
import { motion } from "framer-motion";
import GoogleIcon from "../../assets/google-icon.svg";
import { signInWithGoogle } from "../../firebaseMethod";
import { activeAuth } from "../../store/user-auth";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";

const FormGoogle = ({}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);
  const [errorGoogle, setErrorGoogle] = useState(null);

  const loginGoogle = async (e) => {
    e.preventDefault();
    setIsLoadingGoogle(true); // Set isLoadingGoogle to true to indicate loading state

    try {
      // Authenticate with Google and obtain user credentials
      const userCredential = await signInWithGoogle();

      if (!userCredential) {
        throw new Error("Authentication failed"); // Handle authentication failure
      }

      // Optional: Add a short delay before fetching user details
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Notify the application of successful user authentication
      dispatch(activeAuth(true));

      // Navigate to the dashboard after successful authentication
      navigate("/dashboard");
    } catch (error) {
      console.log(error)
      setErrorGoogle("Error trying to authenticate to Google"); // Handle errors
    } finally {
      setIsLoadingGoogle(false); // Set isLoadingGoogle back to false after operation completes
    }
  };

  return (
    <div className="w-full flex justify-center">
      <motion.button
        whileTap={{ scale: 0.95 }}
        aria-label="login"
        role="login"
        disabled={isLoadingGoogle}
        type="button"
        onClick={(e) => loginGoogle(e)}
        className=" relative flex cursor-pointer w-full max-w-80 items-center justify-center rounded-md  border-2 border-solid border-slate-300 bg-slate-100 h-12 hover:bg-slate-200 "
      >
        <img
          src={GoogleIcon}
          alt="Google"
          className="h-5 w-5 absolute left-4 "
        />
        <span className="text-sm font-semibold xs:hidden ">Google</span>
        <span className="hidden text-sm font-semibold xs:block ">
          Continue With Google
        </span>
      </motion.button>
      {errorGoogle && (
        <p className="text-red-700 text-sm mt-2">{errorGoogle}.</p>
      )}
    </div>
  );
};

export default FormGoogle;
