import React, { useEffect, useState } from "react";
import * as cardValidator from "card-validator";
import { useSelector } from "react-redux";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  runTransaction,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { db } from "../../../firebaseMethod";
import { DashHeader } from "../../Dashboard/DashHeader";
import Input from "../../Input/Input";
import { ExpiryDate } from "../../Dashboard/Payment/ExpiryDate";
import { CheckboxInput } from "../../Input/CheckboxInput/CheckboxInput";
import { SaveButton } from "../../Dashboard/SaveButton";
import { cardImages } from "../../Dashboard/Payment/CardImages";
import { AddCard } from "@mui/icons-material";

const cardData = [
  {
    title: "Card Number*",
    type: "text",
    placeholder: "0000 0000 0000 0000",
    name: "cardNumber",
    maxLength: 24,
  },
  {
    title: "Card Holder Full Name*",
    type: "text",
    placeholder: "Full Name",
    name: "cardholderName",
  },

  {
    title: "Code*",
    type: "text",
    placeholder: "Code",
    name: "code",
    maxLength: 4,
  },
];

export const CheckoutCardForm = () => {
  const uid = useSelector((state) => state.userAuth.user.uid); // Selects the user ID from the Redux state

  const savedPayment = useSelector((state) => state.savedPayment); // Selects saved payment information from the Redux state

  const [dynamicData, setDynamicData] = useState([...cardData]); // Manages dynamic data for form fields

  const [formData, setFormData] = useState({
    // Manages form data for credit card details
    cardNumber: "",
    cardholderName: "",
    expirationMonth: "",
    expirationYear: "",
    code: "",
    defaultPayment: true, // Default payment option is set to true
  });

  const [dataError, setDataError] = useState({
    // Manages form validation errors
    cardNumber: { valid: true, message: "" },
    cardholderName: { valid: true, message: "" },
    expirationMonth: { valid: true, message: "" },
    expirationYear: { valid: true, message: "" },
    expirationDate: { valid: true, message: "" },
    code: { valid: true, message: "" },
    general: { valid: true, message: "" },
  });

  let isFormValid = true; // Flag to track overall form validity

  useEffect(() => {
    // Checks if all validation errors are valid
    isFormValid = Object.values(dataError).every((errorObj) => errorObj.valid);
  }, [dataError]);

  const [cardType, setCardType] = useState(""); // Manages the type of credit card based on input

  const handleChange = (e) => {
    // Handles changes in form input fields
    const { name, type, value, checked } = e.target;

    setFormData((prevData) => {
      // Updates form data based on input type
      return { ...prevData, [name]: type === "checkbox" ? checked : value };
    });

    // Resets validation to true and clears error message
    setDataError((prevError) => ({
      ...prevError,
      [name]: {
        valid: true,
        message: "",
      },
    }));

    if (name === "code") {
      const numericValue = value.replace(/[^0-9]/g, ""); // Removes non-numeric characters
      setFormData((prevData) => {
        return { ...prevData, code: numericValue };
      });
    }

    if (name === "cardNumber") {
      const numericValue = value.replace(/[\s\D]/g, ""); // Removes spaces and non-digit characters

      // Formats the card number by adding a space every 4 digits
      let formatted = "";
      for (let i = 0; i < numericValue.length; i++) {
        if (i > 0 && i % 4 === 0) {
          formatted += " ";
        }
        formatted += numericValue[i];
      }

      const cardCode = cardValidator.number(numericValue); // Validates the card number

      setCardType(cardCode.card ? cardCode.card.type : ""); // Sets the card type based on validation

      // Updates dynamic data fields based on card type
      const updatedData = dynamicData.map((field) => {
        if (field.name === "code") {
          field.title = cardCode.card?.code.name || "Code*";
          field.placeholder = cardCode.card?.code.name || "Code";
          field.maxLength = cardCode.card?.code.size || "3";
        }
        return field;
      });

      setDynamicData(updatedData);

      setFormData((prevData) => {
        return { ...prevData, cardNumber: formatted };
      });
    }
  };

  useEffect(() => {
    // Resets card type and dynamic data when card number is empty
    if (formData.cardNumber == "") {
      setCardType("");
      const updatedData = dynamicData.map((field) => {
        if (field.name === "code") {
          field.title = "Code*";
          field.placeholder = "Code";
          field.maxLength = 3;
        }
        return field;
      });
      setDynamicData(updatedData);
    }
  }, [formData]);

  const handleSelect = (fieldName, value) => {
    // Handles changes in select input fields
    setFormData((prevFormData) => ({
      ...prevFormData,
      [fieldName]: value,
    }));
    // Resets validation to true and clears error message
    setDataError((prevError) => ({
      ...prevError,
      [fieldName]: {
        valid: true,
        message: "",
      },
      expirationDate: {
        valid: true,
        message: "",
      },
    }));
  };

  const selectedImage = cardImages[cardType]; // Selects the card image based on card type

  const verifyCollection = async (cardNumber) => {
    // Verifies if the credit card number already exists in the collection
    const userDocRef = doc(db, "users", uid);
    const creditCardsCollectionRef = collection(userDocRef, "creditCards");

    const q1 = query(
      creditCardsCollectionRef,
      where("cardNumber", "==", cardNumber),
    );

    const exactQ1 = await getDocs(q1);

    if (!exactQ1.empty) {
      throw new Error("This credit card already exists.");
    }
  };

  const submitPaymentCardData = async (e) => {
    e.preventDefault(); // Prevents default form submission behavior

    // Defines an array of fields to validate
    const fieldsToValidate = [
      {
        name: "cardNumber",
        validator: () => cardValidator.number(formData.cardNumber),
        errorMessage: "Please enter a valid card number.",
      },
      {
        name: "code",
        validator: () => cardValidator.cvv(formData.code),
        errorMessage: "Please enter a correct code.",
      },
      {
        name: "cardholderName",
        validator: () => cardValidator.cardholderName(formData.cardholderName),
        errorMessage: "Please enter the full name of the cardholder.",
      },
      {
        name: "expirationDate",
        validator: () => {
          const expirationDate = `${formData.expirationMonth}/${formData.expirationYear}`;
          return cardValidator.expirationDate(expirationDate);
        },
        errorMessage: "Please select a valid expiration date.",
      },
      {
        name: "expirationMonth",
        validator: () =>
          cardValidator.expirationMonth(formData.expirationMonth),
        errorMessage: "Please select a valid expiration month.",
      },
      {
        name: "expirationYear",
        validator: () => cardValidator.expirationYear(formData.expirationYear),
        errorMessage: "Please select a valid expiration year.",
      },
    ];

    // Perform validations in a loop
    const updatedDataError = { ...dataError }; // Creates a copy of the state

    for (const field of fieldsToValidate) {
      const validation = field.validator();
      updatedDataError[field.name] = {
        valid: validation.isValid,
        message: validation.isValid ? "" : field.errorMessage,
      };
    }

    // Updates the dataError state with the updated copy
    setDataError(updatedDataError);

    const hasErrors = Object.values(updatedDataError).some(
      (errorData) => !errorData.valid,
    );

    if (hasErrors) {
      console.log("There are errors in the form.");
      return; // Stops function execution if there are errors
    } else {
      console.log("Form is valid, proceed with try block.");
      // No errors, proceed with the "try" block
    }

    try {
      await verifyCollection(formData.cardNumber); // Verifies if the card number already exists
      const userDocRef = doc(db, "users", uid); // Reference to the user document

      const creditCardsCollection = collection(userDocRef, "creditCards");

      const querySnapshot = await getDocs(creditCardsCollection);

      if (formData.defaultPayment === true) {
        // Clears existing addresses with the same default payment flag
        await runTransaction(db, async (transaction) => {
          querySnapshot.forEach((doc) => {
            const creditCardData = doc.data();
            if (creditCardData.defaultPayment === true) {
              // Sets defaultPayment to false in documents that meet the condition
              transaction.update(doc.ref, {
                defaultPayment: false,
              });
            }
          });
        });
      }

      // Adds the new document to the collection
      const addDocPromise = addDoc(creditCardsCollection, {
        ...formData,
        expirationDate: `${formData.expirationMonth}/${formData.expirationYear}`,
        type: cardType,
        timestamp: serverTimestamp(),
      });

      await addDocPromise; // Waits for the document to be added
      setTimeout(() => window.location.reload(), 2400); // Reloads the page after 2.4 seconds
      return true; // Returns true indicating successful submission
    } catch (error) {
      console.log(error.message);
      setDataError((prevError) => ({
        ...prevError,
        general: {
          valid: false,
          message: error.message, // Sets the error message returned by verifyCollection
        },
      }));
      return false; // Returns false indicating unsuccessful submission
    }
  };

  return (
    <>
      <div className="relative bg-slate-100">
        <div className="my-3  max-w-full ">
          <DashHeader
            /*  backPage="/dashboard/payment-methods/add" */
            title=" Add New Card"
            textStyle="lg:text-xl"
            dashHeight="md:h-14 gap-0"
          />
          <span className=" text-sm leading-relaxed md:text-sm">
            Now enter the card details exactly as they appear printed.
          </span>
        </div>
        <>
          <form
            id="card-form"
            noValidate
            className="my-7 relative grid gap-6 max-w-xs"
          >
            <div className="grid gap-6">
              {dynamicData.slice(0, 1).map((data) => {
                return (
                  <React.Fragment key={data.name}>
                    <Input
                      label={data.title}
                      type={data.type}
                      name={data.name}
                      value={formData[data.name]}
                      placeholder={data.placeholder}
                      onInputChange={handleChange}
                      initialValidity={dataError[data.name].valid}
                      maxLength={data.maxLength}
                      error={dataError[data.name].message}
                      required={false}
                      paymentCard={cardType}
                      selectedImage={selectedImage}
                    />
                  </React.Fragment>
                );
              })}
              {dynamicData.slice(1, 2).map((data) => {
                return (
                  <React.Fragment key={data.name}>
                    <Input
                      label={data.title}
                      type={data.type}
                      name={data.name}
                      value={formData[data.name]}
                      placeholder={data.placeholder}
                      onInputChange={handleChange}
                      initialValidity={dataError[data.name].valid}
                      maxLength={data.maxLength}
                      error={dataError[data.name].message}
                      required={false}
                    />
                  </React.Fragment>
                );
              })}
            </div>
            <ExpiryDate
              handleSelect={handleSelect}
              dataError={dataError}
              formData={formData}
            />
            <div className="grid gap-6 w-full grid-cols-2">
              {dynamicData.slice(2).map((data) => {
                return (
                  <React.Fragment key={data.name}>
                    <Input
                      label={data.title}
                      type={data.type}
                      name={data.name}
                      value={formData[data.name]}
                      placeholder={data.placeholder}
                      onInputChange={handleChange}
                      initialValidity={dataError[data.name].valid}
                      maxLength={data.maxLength}
                      error={dataError[data.name].message}
                      required={false}
                    />
                  </React.Fragment>
                );
              })}
            </div>
            
          <CheckboxInput
              label="Set as default payment method."
              name="defaultPayment"
              checked={formData.defaultPayment}
              onInputChange={handleChange}
              aria={formData.defaultPayment}
            /> 
            {!savedPayment && (
              <span className="text-sm">
                You need to set it as the default payment because it's your
                first payment method.
              </span>
            )}
            {dataError.general.message && (
              <span className="text-red-700 text-sm">
                {dataError.general.message}
              </span>
            )}
            <SaveButton
              isFormValid={isFormValid}
              saveFunction={(e) => submitPaymentCardData(e)}
              icon={<AddCard />}
            />
          </form>
        </>
      </div>
    </>
  );
};
