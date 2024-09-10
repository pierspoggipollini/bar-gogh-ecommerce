import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  addDoc,
  and,
  collection,
  deleteDoc,
  doc,
  getDocs,
  or,
  query,
  runTransaction,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../../../firebaseMethod";
import { postcodeValidator } from "postcode-validator";
import { capitalizeFirstLetter } from "../../../utilities/capitalizeFirstLetter";

import ShipFormContext from "./ShipFormContext";
import parsePhoneNumber from 'libphonenumber-js'


const shippingValue = [
  {
    label: "Name*",
    name: "firstName",
    type: "text",
    placeholder: "Name",
    required: true,
  },
  {
    label: "Surname*",
    name: "lastName",
    type: "text",
    placeholder: "Surname",
    required: true,
  },
  {
    label: "Phone Number*",
    name: "phone",
    type: "text",
    placeholder: "Phone Number",
    required: true,
  },
];

const addressValue = [
  {
    label: "Address*",
    name: "address",
    type: "text",
    placeholder: "Address",
    required: true,
  },
  {
    label: "City*",
    name: "city",
    type: "text",
    placeholder: "City",
    required: true,
  },
  {
    label: "Zip Code*",
    name: "zipCode",
    type: "text",
    placeholder: "Zip Code",
    required: true,
  },
];

export const checkboxValue = [
  {
    label: "Set as default shipping address.",
    name: "defaultShipping",
  },
  { label: "Set as default billing address.", name: "defaultBilling" },
];

const ShipFormProvider = ({ children }) => {
  // Retrieve user information from Redux state
  const navigate = useNavigate(); // Access the navigate function from the React Router
  const user = useSelector((state) => state.userAuth.user);
  const { country, addresses } = useSelector((state) => state.shippingData);
  const uid = user.uid; // Extract the user ID from the user object

  // Filter addresses to find those with default shipping
  const addressesWithDefaultShipping = useMemo(() => {
    return addresses.filter((address) => address.defaultShipping === true);
  }, [addresses]);

  // Extract default phone numbers from addresses with default shipping
  const defaultPhone = useMemo(() => {
    return addressesWithDefaultShipping.map((address) => address.phone);
  }, [addressesWithDefaultShipping]);

  const [shipValue, setShipValue] = useState({
  // Initial state for shipping information
  firstName: user.firstName || "", // First name from user data or empty string
  lastName: user.lastName || "", // Last name from user data or empty string
  phone: defaultPhone.toString() || "", // Default phone number converted to string or empty string
  query: "", // Query for address search
  location: "", // Location for selected address
  newAddress: {
    address: "", // New address line
    city: "", // City for new address
    country: country || "", // Country for new address or default value
    state: "Select State*", // State for new address, default is "Select State*"
    zipCode: "", // ZIP code for new address
  },
  defaultShipping: true, // Default shipping address flag
  defaultBilling: true, // Default billing address flag
});

const [formattedPhoneNumber, setFormattedPhoneNumber] = useState("");
// State for formatted phone number

const [validity, setValidity] = useState({
  // State for form field validity
  firstName: true, // Validity of first name field
  lastName: true, // Validity of last name field
  phone: true, // Validity of phone number field
  query: true, // Validity of address search query
  newAddress: {
    address: true, // Validity of new address field
    country: true, // Validity of country field in new address
    city: true, // Validity of city field in new address
    state: true, // Validity of state field in new address
    zipCode: true, // Validity of ZIP code field in new address
  },
});

const [errorForm, setErrorForm] = useState({
  // State for form errors
  findAddress: "", // Error message for address search
  zipCode: "", // Error message for ZIP code
  general: "", // General error message
});

  const isFormValid = useMemo(() => {
    // Calculate if all values in the 'validity' object are truthy
    return Object.values(validity).every((valid) => valid);
  }, [validity]);

  const [manuallyAddress, setManuallyAddress] = useState(false);

  const [activeFinalForm, setActiveFinalForm] = useState(false);

  //const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // Function to handle input field changes
  const handleChange = (event) => {
    const { name, value, checked, type } = event.target;

    // Set the validity state for the specific field to true
    setValidity((prevValidity) => ({
      ...prevValidity,
      [name]: true,
      newAddress: {
        ...prevValidity.newAddress,
        [name]: true, // Update validity for "name" field as an example
      },
    }));

    // If the input field is inside newAddress
    if (name.startsWith("newAddress.")) {
      setValidity((prevValidity) => ({
        ...prevValidity,
        newAddress: {
          ...prevValidity.newAddress,
          [name.split(".")[1]]: true,
        },
      }));
    } else {
      setValidity((prevValidity) => ({
        ...prevValidity,
        [name]: true,
      }));
    }

    // If the input field is inside newAddress
    if (name.startsWith("newAddress.")) {
      setShipValue((prevData) => ({
        ...prevData,
        newAddress: {
          ...prevData.newAddress,
          [name.split(".")[1]]: type === "checkbox" ? checked : value,
        },
      }));
    } else if (name === 'phone') {
       setShipValue((prevData) => ({
          ...prevData,
          phone: value, // Aggiorna il numero di telefono nel formato grezzo
        }));
      const phoneNumberObj = parsePhoneNumber(value, country);

      if (phoneNumberObj && phoneNumberObj.isValid()) {
        const formatted = phoneNumberObj.formatInternational();
        setFormattedPhoneNumber(formatted);
  
      } else {
        // if phone number is not valid, reset the format number
        setFormattedPhoneNumber('');
       
      }} else {
      // For other fields directly update shipValue
      setShipValue((prevData) => ({
        ...prevData,
        [name]: type === "checkbox" ? checked : value,
      }));
    }

    // If the user starts modifying the input, clear the error message for that field
    setErrorForm((prevError) => ({
      ...prevError,
      [name]: "",
      findAddress: "", // Clear findAddress error message as well
    }));
  };

  // Function to handle select field changes
  const handleSelectChange = (event) => {
    // Do something with the selected value, for example, update the state
    setShipValue((prevData) => ({
      ...prevData,
      newAddress: {
        ...prevData.newAddress,
        state: event.target.value,
      },
    }));

    // Set the validity state for the state field to true
    setValidity((prevValidity) => ({
      ...prevValidity,
      newAddress: {
        ...prevValidity.newAddress,
        state: true, // Set the state field as valid
      },
    }));
  };

  const handleCountryChange = (selectedCountry) => {
    setShipValue((prevData) => ({
      ...prevData,
      newAddress: {
        ...prevData.newAddress,
        country: selectedCountry, // Update the country field with the selected country
      },
    }));
  };

  const requiredFields = ["firstName", "lastName", "phone"];
  const secondFieldsRequired = ["address", "zipCode", "city", "state"];

  // Check if all requiredFields are filled
  const isAllRequiredFieldsFilled = requiredFields.every(
    (field) => !!shipValue[field],
  );

  const verifyCollectionNewAddress = async (location, address) => {
    // Reference to the user document
    const userDocRef = doc(db, "users", uid);
    const addressCollectionRef = collection(userDocRef, "addresses");

    // Construct query to find existing address with the same location or address details
    const q1 = query(
      addressCollectionRef,
      where("location", "==", location),
      where("location", "!=", ""),
    );

    const q2 = query(
      addressCollectionRef,
      where("newAddress.address", "==", address.address),
      where("newAddress.city", "==", address.city),
      where("newAddress.state", "==", address.state),
      where("newAddress.zipCode", "==", address.zipCode),
      where("newAddress.address", "!=", ""), // Exclude empty addresses
    );

    // Execute both queries concurrently
    const [exactQ1, exactQ2] = await Promise.all([getDocs(q1), getDocs(q2)]);

    // Check if any address with the same location or details exists
    if (!exactQ1.empty || !exactQ2.empty) {
      throw new Error("This address already exists");
    }
  };

  const verifyCollectionEditAddress = async (
    location,
    address,
    defaultShipping,
    defaultBilling,
  ) => {
    // Reference to the user document
    const userDocRef = doc(db, "users", uid);
    const addressCollectionRef = collection(userDocRef, "addresses");

    // Construct query to find existing address with the same location or address details
    const q1 = query(
      addressCollectionRef,
      where("location", "==", location),
      where("location", "!=", ""),
    );

    const q2 = query(
      addressCollectionRef,
      where("newAddress.address", "==", address.address),
      where("newAddress.city", "==", address.city),
      where("newAddress.state", "==", address.state),
      where("newAddress.zipCode", "==", address.zipCode),
      where("newAddress.address", "!=", ""), // Exclude empty addresses
    );

    // Execute both queries concurrently
    const [exactQ1, exactQ2] = await Promise.all([getDocs(q1), getDocs(q2)]);

    // Check if any address with the same location or details exists
    if (!exactQ1.empty || !exactQ2.empty) {
      // If such address exists, check if defaultShipping and defaultBilling are the same
      const matchingAddress = exactQ1.docs.concat(exactQ2.docs).find((doc) => {
        const data = doc.data();
        return (
          data.defaultShipping === defaultShipping &&
          data.defaultBilling === defaultBilling
        );
      });

      if (matchingAddress) {
        throw new Error(
          "This address already exists with the same default shipping and billing settings.",
        );
      }
    }
  };

  const submitNewAddress = async (e) => {
    e.preventDefault();

    // Define required fields for the main form
    const requiredFields = ["firstName", "lastName", "phone"];

    // Define required fields for the manual address part
    const secondFieldsRequired = ["address", "city", "state"];

    // Copy the current validity state
    const updatedValidity = { ...validity };

    // Validate the requiredFields
    requiredFields.forEach((field) => {
      if (!shipValue[field]) {
        updatedValidity[field] = false;
      }
    });

    // Check if all requiredFields are filled
    const isAllRequiredFieldsFilled = requiredFields.every(
      (field) => !!shipValue[field],
    );

    // Check if all secondFieldsRequired are filled
    const isAllSecondRequiredFieldsFilled = secondFieldsRequired.every(
      (field) => !!shipValue.newAddress[field],
    );

    // Check the presence of location
    if (
      !shipValue.location &&
      !shipValue.query &&
      !manuallyAddress &&
      !isAllSecondRequiredFieldsFilled
    ) {
      updatedValidity.query = false;
      setErrorForm((prevError) => ({
        ...prevError,
        findAddress: "Find an address or insert it manually below.",
      }));
      setValidity(updatedValidity);
      return;
    } else {
      updatedValidity.query = true;
      setValidity(updatedValidity);
    }

    // Check if all requiredFields for the main form are filled
    if (!isAllRequiredFieldsFilled && !manuallyAddress) {
      setErrorForm((prevError) => ({
        ...prevError,
        general: "Please fill in all required fields.",
      }));
      console.log("errore 1");
      return;
    } else {
      setErrorForm((prevError) => ({
        ...prevError,
        general: "",
      }));
    }

    // Handle the manual address part
    if (manuallyAddress) {
      // Check if all required fields under newAddress are filled
      // Trim and validate the zip code
      const trimmedZipCode = shipValue.newAddress.zipCode.trim();
      const isZipCodeValid = postcodeValidator(
        trimmedZipCode,
        shipValue.newAddress.country,
      );

      const isValidState = shipValue.newAddress.state !== "Select State*";

      // Validate the secondFieldsRequired under newAddress
      secondFieldsRequired.forEach((field) => {
        if (
          !shipValue.newAddress[field] ||
          shipValue.newAddress.state === "Select State*"
        ) {
          updatedValidity.newAddress[field] = false;
        } else {
          updatedValidity.newAddress[field] = true; // Set to true if the field is filled
        }
      });

      // Update the validity for state and zip code under newAddress
      updatedValidity.newAddress.state = isValidState;
      updatedValidity.newAddress.zipCode = isZipCodeValid;

      if (isAllSecondRequiredFieldsFilled) {
        setErrorForm((prevError) => ({
          ...prevError,
          findAddress: "",
        }));
      }

      // If any required field is not filled correctly, set the errors
      if (
        !isAllSecondRequiredFieldsFilled ||
        !isValidState ||
        !isZipCodeValid
      ) {
        setErrorForm((prevError) => ({
          ...prevError,
          general: !isAllSecondRequiredFieldsFilled
            ? "Please fill in all required fields."
            : "",
          findAddress: !isAllSecondRequiredFieldsFilled
            ? "Find an address or insert it manually below."
            : "",
          zipCode: !isZipCodeValid ? "Please provide a valid zip code." : "",
        }));
        return; // Stop the code execution here
      }

      // If all fields are filled correctly, reset the errors
      setErrorForm((prevError) => ({
        ...prevError,
        general: "",
        findAddress: "",
        zipCode: "",
      }));

      // Update the validity
      setValidity(updatedValidity);
    }

    try {
      // Verify if the address already exists in the collection
      await verifyCollectionNewAddress(
        shipValue.location,
        shipValue.newAddress,
      );

      // Prepare the new address object
      const newAddress = {
        address: shipValue.newAddress.address,
        city: shipValue.newAddress.city,
        country: shipValue.newAddress.country,
        state:
          shipValue.newAddress.state !== "Select State*"
            ? shipValue.newAddress.state
            : "",
        zipcode: shipValue.newAddress.zipCode,
      };

      // Reference to the user document
      const userDocRef = doc(db, "users", uid);
      const addressCollectionRef = collection(userDocRef, "addresses");

      // Fetch all documents in the addresses collection
      const querySnapshot = await getDocs(addressCollectionRef);

      // Update defaultShipping if needed
      if (shipValue.defaultShipping === true) {
        await runTransaction(db, async (transaction) => {
          querySnapshot.forEach((doc) => {
            const addressData = doc.data();
            if (addressData.defaultShipping === true) {
              transaction.update(doc.ref, {
                defaultShipping: false,
              });
            }
          });
        });
      }

      // Update defaultBilling if needed
      if (shipValue.defaultBilling === true) {
        await runTransaction(db, async (transaction) => {
          querySnapshot.forEach((doc) => {
            const addressData = doc.data();
            if (addressData.defaultBilling === true) {
              transaction.update(doc.ref, {
                defaultBilling: false,
              });
            }
          });
        });
      }

      // Add the new address document to the collection
      const addDocPromise = addDoc(addressCollectionRef, {
        firstName: capitalizeFirstLetter(shipValue.firstName),
        lastName: capitalizeFirstLetter(shipValue.lastName),
        phone: formattedPhoneNumber,
        location: shipValue.location,
        newAddress,
        defaultShipping: shipValue.defaultShipping,
        defaultBilling: shipValue.defaultBilling,
        fullAddress: `${capitalizeFirstLetter(newAddress.address)}, ${capitalizeFirstLetter(newAddress.city)}, ${newAddress.state} ${newAddress.zipcode} ${newAddress.country}`,
        timestamp: serverTimestamp(),
      });

      await addDocPromise; // Wait for the promise to resolve
      return true;
    } catch (error) {
      console.log(error.message);

      // Handle the exception thrown by verifyCollection
      setErrorForm((prevError) => ({
        ...prevError,
        general: error.message, // Display the error message returned by verifyCollection
      }));
      return false;
    }
  };

  const handleResetQuery = () => {
    setShipValue((prevValue) => ({
      ...prevValue,
      query: "",
    }));
  };

  const removeLocation = () => {
    setShipValue((prevValue) => ({ ...prevValue, location: "" }));
  };

  const saveLocation = (value) => {
    setShipValue((prevValue) => ({ ...prevValue, location: value }));
  };

  //EDIT

 // Function to handle manually opening the address entry section
const openManuallyAddress = () => {
  /* 
    Toggle the manually entered address section.
    Currently commented out to avoid toggling.
    Replace with your logic to toggle `manuallyAddress` state.
  */
  // setManuallyAddress(!manuallyAddress);

  // Reset the location field when opening manually entered address
  setShipValue((prevValue) => ({ ...prevValue, location: "" }));

  // Activate the manually entered address button or state
  setActiveManuallyButton(true);
};

// Check if any addresses have both default shipping and billing
const hasDefault = addresses.some(
  (address) => address.defaultShipping && address.defaultBilling
);

// State variables for managing UI and data
const [dataIsEqual, setDataIsEqual] = useState(false);
const [isSaved, setIsSaved] = useState(false);
const [isSaving, setIsSaving] = useState(false);
const [showConfirmation, setShowConfirmation] = useState(false);

// Function to update or submit address data
const updateAddress = async (e, id) => {
  e.preventDefault();

  // Required fields for the main form
  const requiredFields = ["firstName", "lastName", "phone"];

  // Required fields for manually entered address
  const secondFieldsRequired = ["address", "city", "country", "state"];

  // Copy of the current validity state
  const updatedValidity = { ...validity };

  // Validate each field in requiredFields
  requiredFields.forEach((field) => {
    if (!shipValue[field]) {
      updatedValidity[field] = false;
    }
  });

  // Check if all requiredFields are filled
  const isAllRequiredFieldsFilled = requiredFields.every(
    (field) => !!shipValue[field]
  );

  // Check if all secondFieldsRequired are filled for manually entered address
  const isAllSecondRequiredFieldsFilled = secondFieldsRequired.every(
    (field) => !!shipValue.newAddress[field]
  );

  // Check if location or query is provided for address lookup
  if (
    !shipValue.location &&
    !shipValue.query &&
    !manuallyAddress &&
    !isAllSecondRequiredFieldsFilled
  ) {
    updatedValidity.query = false;
    setErrorForm((prevError) => ({
      ...prevError,
      findAddress: "Find an address or insert it manually below.",
    }));
    setValidity(updatedValidity);
    return;
  } else {
    updatedValidity.query = true;
    setValidity(updatedValidity);
  }

  // Validate all required fields are filled if not manually entering address
  if (!isAllRequiredFieldsFilled && !manuallyAddress) {
    setErrorForm((prevError) => ({
      ...prevError,
      general: "Please fill in all required fields.",
    }));
    console.log("error 1");
    return;
    // Show a general error message or handle the error as desired
  } else {
    setErrorForm((prevError) => ({
      ...prevError,
      general: "",
    }));
  }

  // Handle validation and processing for manually entered address
  if (manuallyAddress) {
    // Check if all required fields are filled
    const isValidState = shipValue.newAddress.state !== "Select State*";
    const trimmedZipCode = shipValue.newAddress.zipCode.trim();
    const isZipCodeValid = postcodeValidator(
      trimmedZipCode,
      shipValue.newAddress.country
    );

    // Update field validity
    const updatedValidity = {
      ...validity,
      newAddress: {
        ...validity.newAddress,
        state: isValidState,
      },
    };

    if (isAllSecondRequiredFieldsFilled) {
      setErrorForm((prevError) => ({
        ...prevError,
        findAddress: "",
      }));
    }

    // Set errors if required fields are not filled or state is not valid
    if (
      !isAllRequiredFieldsFilled ||
      !isValidState ||
      !isAllSecondRequiredFieldsFilled ||
      !isZipCodeValid
    ) {
      setErrorForm((prevError) => ({
        ...prevError,
        general: !isAllRequiredFieldsFilled
          ? "Please fill in all required fields."
          : "",
        findAddress: !isAllRequiredFieldsFilled
          ? "Find an address or insert it manually below."
          : "",
        zipCode: !isZipCodeValid ? "Please provide a valid zip code." : "",
      }));
      return; // Exit function if there are errors
    }

    // Clear errors if all fields are valid
    setErrorForm((prevError) => ({
      ...prevError,
      general: "",
      findAddress: "",
      zipCode: "",
    }));

    // Update validity state
    setValidity(updatedValidity);
  }

  try {
    // Call a function to verify and edit the address collection
    await verifyCollectionEditAddress(
      shipValue.location,
      shipValue.newAddress,
      shipValue.defaultShipping,
      shipValue.defaultBilling
    );

    // Format the new address data
    const newAddress = {
      address: capitalizeFirstLetter(shipValue.newAddress.address),
      city: capitalizeFirstLetter(shipValue.newAddress.city),
      state:
        shipValue.newAddress.state !== "Select State*"
          ? shipValue.newAddress.state
          : "",
      zipcode: shipValue.newAddress.zipCode,
    };

    // Reference to the user document
    const userDocRef = doc(db, "users", uid);

    // Declare addressCollectionRef before using it
    const addressCollectionRef = collection(userDocRef, "addresses");

    // Get the specific document based on the ID
    const docRef = doc(addressCollectionRef, id);

    // Update specific document if it is set as default shipping
    if (shipValue.defaultShipping === true) {
      await updateDoc(docRef, {
        defaultShipping: true,
      });

      // Update other documents to set defaultShipping to false
      const querySnapshot = await getDocs(addressCollectionRef);

      await runTransaction(db, async (transaction) => {
        querySnapshot.forEach((doc) => {
          const addressData = doc.data();
          if (addressData.defaultShipping === true && doc.id !== id) {
            transaction.update(doc.ref, {
              defaultShipping: false,
            });
          }
        });
      });
    }

    // Update specific document if it is set as default billing
    if (shipValue.defaultBilling === true) {
      await updateDoc(docRef, {
        defaultBilling: true,
      });

      // Update other documents to set defaultBilling to false
      const querySnapshot = await getDocs(addressCollectionRef);

      await runTransaction(db, async (transaction) => {
        querySnapshot.forEach((doc) => {
          const addressData = doc.data();
          if (addressData.defaultBilling === true && doc.id !== id) {
            transaction.update(doc.ref, {
              defaultBilling: false,
            });
          }
        });
      });
    }

    // Update the new document in the collection
    const updateDocPromise = updateDoc(docRef, {
      firstName: capitalizeFirstLetter(shipValue.firstName),
      lastName: capitalizeFirstLetter(shipValue.lastName),
      phone: formattedPhoneNumber,
      location: capitalizeFirstLetter(shipValue.location),
      newAddress,
      defaultShipping: shipValue.defaultShipping,
      defaultBilling: shipValue.defaultBilling,
      fullAddress: `${capitalizeFirstLetter(newAddress.address)}, ${capitalizeFirstLetter(newAddress.city)}, ${newAddress.state} ${newAddress.zipcode} ${newAddress.country}`,
      timestamp: serverTimestamp(),
    });

    // Wait for the promise to resolve
    await updateDocPromise;
    return true; // Return true if update is successful
  } catch (error) {
    console.log(error.message);
    // Handle exceptions thrown by verifyCollectionEditAddress function
    setErrorForm((prevError) => ({
      ...prevError,
      general: error.message, // Display the error message returned by verifyCollectionEditAddress
    }));
    setIsSaved(false);
    setIsSaving(false);
    return false; // Return false if update fails
  }
};

  // Function to delete an address
const deleteAddress = async (id) => {
  try {
    // Reference to the user document
    const userDocRef = doc(db, "users", uid);

    // Declare addressCollectionRef before using it
    const addressCollectionRef = collection(userDocRef, "addresses");

    // Get the specific document based on the ID
    const docRef = doc(addressCollectionRef, id);

    // Delete the document
    await deleteDoc(docRef);
    return true; // Return true if deletion is successful
  } catch (error) {
    console.log(error); // Log the error if deletion fails
  }
};

const resetFormErrors = () => {
  // Reset form errors if the form is valid
  if (isFormValid) {
    setErrorForm({
      findAddress: "",
      zipCode: "",
      general: "",
    });
  }
};

const updateManualAddress = () => {
  // Update manual address fields if location is selected
  if (shipValue.location) {
    setShipValue((prevValue) => ({
      ...prevValue,
      newAddress: {
        address: "",
        zipCode: "",
        country: "",
        state: "Select State*",
        city: "",
      },
    }));
    setManuallyAddress(false); // Disable manual address input
    setActiveFinalForm(true); // Set active final form
  } else {
    setActiveFinalForm(true); // Set active final form
  }
};

const updateValidity = () => {
  // Update validity of manually entered address fields if all required fields are filled and not manually entering address
  if (isAllRequiredFieldsFilled && !manuallyAddress) {
    secondFieldsRequired.forEach((field) => {
      validity.newAddress[field] = true; // Set validity of each secondFieldsRequired to true
    });
  }
};


  return (
    <ShipFormContext.Provider
      value={{
        shippingValue,
        addressValue,
        checkboxValue,
        shipValue,
        setShipValue,
        setManuallyAddress,
        isAllRequiredFieldsFilled,
        validity,
        errorForm,
        activeFinalForm,
        isFormValid,
        manuallyAddress,
        addresses,
        handleChange,
        handleSelectChange,
        submitNewAddress,
        handleResetQuery,
        removeLocation,
        saveLocation,
        resetFormErrors,
        updateManualAddress,
        updateValidity,
        openManuallyAddress,
        hasDefault,
        updateAddress,
        deleteAddress,
        isSaved,
        setIsSaved,
        isSaving,
        setIsSaving,
        showConfirmation,
        setShowConfirmation,
        dataIsEqual,
        setDataIsEqual,
        handleCountryChange,
        formattedPhoneNumber
      }}
    >
      {children}
    </ShipFormContext.Provider>
  );
};

export default ShipFormProvider;
