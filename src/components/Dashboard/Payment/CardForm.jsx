import React, { useEffect, useState } from "react";
import { DashHeader } from "../DashHeader";
import { LayoutDashboard } from "../../Layout/LayoutDashboard";
import Input from "../../Input/Input";
import { ExpiryDate } from "./ExpiryDate";
import * as cardValidator from "card-validator";
import { CheckboxInput } from "../../Input/CheckboxInput/CheckboxInput";
import { SaveButton } from "../SaveButton";
import { AddCard, AddCardOutlined } from "@mui/icons-material";
import { cardImages } from "./CardImages";
import { db } from "../../../firebaseMethod";
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
import { useNavigate } from "react-router";
import { useStripe } from "@stripe/react-stripe-js";
import { createPaymentMethod } from "./createPaymentMethod";

const creditCardFormFields = [
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

const CardForm = () => {
  const stripe = useStripe();
  const [cardType, setCardType] = useState("");
  const uid = useSelector((state) => state.userAuth.user.uid); // Fetch UID from Redux store
  const navigate = useNavigate();



  // Fetch savedPayment state from Redux store
  const savedPayment = useSelector((state) => state.savedPayment);

  // Initialize dynamicData state with creditCardFormFields
  const [dynamicData, setDynamicData] = useState([...creditCardFormFields]);

  // Initialize paymentMethodId state
  const [paymentMethodId, setPaymentMethodId] = useState(null);

  // Initialize formData state with initial form values
  const [formData, setFormData] = useState({
    cardNumber: "",
    cardholderName: "",
    expirationMonth: "",
    expirationYear: "",
    code: "",
    defaultPayment: savedPayment ? true : false, // Set defaultPayment based on savedPayment state
  });

  // Initialize dataError state to manage form validation errors
  const [dataError, setDataError] = useState({
    cardNumber: { valid: true, message: "" }, // Valid card number initially
    cardholderName: { valid: true, message: "" }, // Valid cardholder name initially
    expirationMonth: { valid: true, message: "" }, // Valid expiration month initially
    expirationYear: { valid: true, message: "" }, // Valid expiration year initially
    expirationDate: { valid: true, message: "" }, // Valid expiration date initially
    code: { valid: true, message: "" }, // Valid code (CVV) initially
    general: { valid: true, message: "" }, // General validation message initially
  });

  // Variable to track overall form validity
  let isFormValid = true;

  useEffect(() => {
    // Update isFormValid based on the validity of all dataError objects
    isFormValid = Object.values(dataError).every((errorObj) => errorObj.valid);
  }, [dataError]);

  const handleChange = (event) => {
    const { name, type, value, checked } = event.target;

    console.log(`Changing ${name} to ${type === "checkbox" ? checked : value}`);

    // Update formData based on the type of input element
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Reset the validity and message to empty string
    setDataError((prevError) => ({
      ...prevError,
      [name]: {
        valid: true,
        message: "",
      },
    }));

    if (name === "code") {
      // Remove non-numeric characters from value
      const numericValue = value.replace(/[^0-9]/g, "");

      // Update formData with the numeric value of code
      setFormData((prevData) => {
        return { ...prevData, code: numericValue };
      });
    }

    if (name === "cardNumber") {
      // Remove non-numeric characters and spaces from value
      const numericValue = value.replace(/[\s\D]/g, "");

      // Format the card number with spaces every 4 digits
      let formatted = "";
      for (let i = 0; i < numericValue.length; i++) {
        if (i > 0 && i % 4 === 0) {
          formatted += " "; // Add a space every 4 digits
        }
        formatted += numericValue[i]; // Append current numeric character
      }

      // Validate card number and determine card type
      const cardCode = cardValidator.number(numericValue);
      setCardType(cardCode.card ? cardCode.card.type : "");

      // Update dynamicData for code field based on card type
      const updatedData = dynamicData.map((field) => {
        if (field.name === "code") {
          field.title = cardCode.card?.code.name || "Code*";
          field.placeholder = cardCode.card?.code.name || "Code";
          field.maxLength = cardCode.card?.code.size || "3";
        }
        return field;
      });
      setDynamicData(updatedData);

      // Update formData with formatted card number
      setFormData((prevData) => {
        return { ...prevData, cardNumber: formatted };
      });
    }
  };

  useEffect(() => {
    // Reset cardType and update dynamicData when cardNumber is empty
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
    // Update formData with selected field value
    setFormData((prevFormData) => ({
      ...prevFormData,
      [fieldName]: value,
    }));

    // Reset validity and message for selected field and expirationDate
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

  const selectedImage = cardImages[cardType];

  // Function to verify if the credit card number already exists in the collection
  const verifyCollection = async (cardNumber) => {
    const userDocRef = doc(db, "users", uid);
    const creditCardsCollectionRef = collection(userDocRef, "creditCards");

    // Query to check if the card number already exists
    const q1 = query(
      creditCardsCollectionRef,
      where("cardNumber", "==", cardNumber),
    );

    // Execute the query
    const exactQ1 = await getDocs(q1);

    console.log(exactQ1);

    // Throw an error if the card number already exists in the collection
    if (!exactQ1.empty) {
      throw new Error("This credit card already exists.");
    }
  };

  // Function to submit payment card data
  const submitPaymentCardData = async (e) => {
    e.preventDefault();

    // Fields and their validators for form validation
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

    // Create a copy of dataError state to update validation status
    const updatedDataError = { ...dataError };

    // Validate each field in the form
    for (const field of fieldsToValidate) {
      const validation = field.validator();
      updatedDataError[field.name] = {
        valid: validation.isValid,
        message: validation.isValid ? "" : field.errorMessage,
      };
    }

    // Update dataError state with validation results
    setDataError(updatedDataError);

    // Check if there are any validation errors
    const hasErrors = Object.values(updatedDataError).some(
      (errorData) => !errorData.valid,
    );

    // If there are validation errors, stop further execution
    if (hasErrors) {
      console.log("There are errors in the form.");
      return;
    } else {
      console.log("Form is valid, proceed with try block.");
    }

    try {
      // Prepare card data for creating a payment method
      const cardData = {
        number: formData.cardNumber,
        exp_month: formData.expirationMonth,
        exp_year: formData.expirationYear,
        cvc: formData.code.toString(),
      };

      // Verify if the card number already exists in the collection
      await verifyCollection(formData.cardNumber);

      // Create a payment method using Stripe API
      const resultFromCreatePaymentMethod = await createPaymentMethod(
        stripe,
        cardData,
      );

      // Handle error if payment method creation fails
      if (resultFromCreatePaymentMethod.error) {
        console.error(resultFromCreatePaymentMethod.error);
        return false;
      } else {
        const { paymentMethodId } = resultFromCreatePaymentMethod;
        // Set the paymentMethodId for further use
        setPaymentMethodId(paymentMethodId);
      }

      // Reference to the user document
      const userDocRef = doc(db, "users", uid);

      // Reference to the credit cards collection
      const creditCardsCollection = collection(userDocRef, "creditCards");

      // Get a snapshot of the credit cards collection
      const querySnapshot = await getDocs(creditCardsCollection);

      // If defaultPayment is true, update existing documents accordingly
      if (formData.defaultPayment === true) {
        await runTransaction(db, async (transaction) => {
          querySnapshot.forEach((doc) => {
            const creditCardData = doc.data();
            if (creditCardData.defaultPayment === true) {
              transaction.update(doc.ref, {
                defaultPayment: false,
              });
            }
          });
        });
      }

      // Add the new document to the credit cards collection
      const addDocPromise = addDoc(creditCardsCollection, {
        ...formData,
        expirationDate: `${formData.expirationMonth}/${formData.expirationYear}`,
        type: cardType,
        paymentMethodId: paymentMethodId,
        timestamp: serverTimestamp(),
      });

      // Wait for the document addition to complete
      await addDocPromise;

      // Navigate to payment methods page after a delay
      setTimeout(() => navigate("/dashboard/payment-methods"), 2400);
      return true;
    } catch (error) {
      console.log(error.message);
      // Update dataError with the error message from verifyCollection
      setDataError((prevError) => ({
        ...prevError,
        general: {
          valid: false,
          message: error.message,
        },
      }));
      return false;
    }
  };

  return (
    <>
      <LayoutDashboard selectedItem={"payment-methods"}>
        <div className=" my-4 mx-3 md:m-0 relative h-full flex-col gap-2 md:flex w-full md:w-1/2 max-w-[32.5rem] lg:w-full">
          <div className=" h-auto flex flex-col  bg-slate-100 rounded-lg max-w-full">
            <DashHeader
              backPage={true}
              title=" Add New Card"
              icon={<AddCardOutlined fontSize="large" />}
            />
            <div className="px-4 grid">
              <span className=" text-sm leading-relaxed md:text-sm">
                Now enter the card details exactly as they appear printed.
              </span>
              <>
                <form
                  id="card-form"
                  noValidate
                  className="h-auto overflow-hidden py-6 px-2 flex max-w-xs xs:w-82 flex-col gap-7"
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
                    name={"defaultPayment"}
                    checked={formData.defaultPayment}
                    onInputChange={handleChange}
                  />
                  {!savedPayment && (
                    <span className="text-sm">
                      You need to set it as the default payment because it's
                      your first payment method.
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
          </div>
        </div>
      </LayoutDashboard>
    </>
  );
};

export default CardForm;
