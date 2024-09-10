import React, { useState } from "react";
import { DashHeader } from "../DashHeader";
import { AccountBoxOutlined, PersonOutline, Search } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { FormButton } from "../../Form/FormButton";
import { useConditionalUserData } from "../../../ReactQuery/useUserData";
import Input from "../../Input/Input";
import axiosInstance from "../../../config/axiosInstance";

const textData = [
  { label: "Name *", name: "firstName", type: "text", placeholder: "Name" },
  {
    label: "Surname *",
    name: "lastName",
    type: "text",
    placeholder: "Surname",
  },
  {
    label: "Email Address *",
    name: "email",
    type: "text",
    placeholder: "example@gmail.com",
  },
  /* {
    label: "Birthday",
    name: "birthday",
    type: "date",
    placeholder: "Birthday",
  }, */
];

export const MyDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.userAuth.user);
  const isAuthenticated = useSelector(
    (state) => state.userAuth.isAuthenticated,
  );

  const {
    isLoading,
    error,
    data: userData,
    refetch,
  } = useConditionalUserData(isAuthenticated);

  const { firstName, lastName, email } = user;

  const [formValue, setFormValue] = useState({
    firstName: firstName,
    lastName: lastName,
    email: email,
    /*  birthday: new Date().toISOString().substring(0, 10), */
  });

  const [isUpdating, setIsUpdating] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const [errorUpdating, setErrorUpdating] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormValue((prevValue) => {
      return { ...prevValue, [name]: value };
    });
  };

  const updateProfile = async (e) => {
    e.preventDefault();

    setIsUpdating(true);

    const updatedData = {
      ...formValue, // Copy all fields from formValue
      fullName: `${formValue.firstName} ${formValue.lastName}`, // Add fullName field
    };

    try {
      const response = await axiosInstance.put(
        `dashboard/updateProfile`,
        updatedData,
      );
      if (response.data.success) {
        refetch(); // Refresh the user's info in case anything
        setIsSaved(true);
        setTimeout(() => {
          setIsSaved(false);
        }, 2000);
      }
    } catch (error) {
      switch (error.code) {
        case "auth/requires-recent-login":
          setErrorUpdating("Reauthentication required. Please sign in again.");
          setTimeout(() => {
            navigate("/login");
          }, 1000);
          break;
        default:
          // Handle other types of errors
          console.error("Error during API call:", error);
          setErrorUpdating(
            "An error occurred while updating the profile. Please try again later.",
          );
      }
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      <DashHeader
        /*  backPage="/dashboard" */
        backIcon={<PersonOutline sx={{ fontSize: "1.8rem" }} />}
        title="My Details"
        icon={<AccountBoxOutlined fontSize="large" />}
      />
      <div className=" p-4 h-auto flex flex-col bg-slate-100 rounded-lg gap-2 md:mx-0 max-w-full">
        <p className="text-sm text-balance">
          If necessary, please update your information below to keep your
          account up to date. (* Indicates a required field).
        </p>

        <form
          id="updateProfile"
          onSubmit={updateProfile}
          className=" h-auto relative  pt-5 pb-2 flex max-w-xs xs:w-72 flex-col gap-7"
        >
          {textData.map((data) => {
            return (
              <Input
                key={data.label} // Assicurati di fornire una prop key unica per ogni elemento nella mappatura
                type={data.type}
                name={data.name}
                placeholder={data.placeholder}
                label={data.label}
                value={formValue[data.name]}
                onInputChange={handleChange}
                initialValidity={true}
              />
            );
          })}

          <FormButton
            isSubmitSuccessful={isSaved}
            isSubmitting={isUpdating}
            action="Save"
            loadingText="Saving..."
            ariaLabel="Save details"
          />
        </form>
        {errorUpdating && (
          <span className=" text-sm uppercase text-red-700">
            {errorUpdating}
          </span>
        )}
      </div>
    </>
  );
};
