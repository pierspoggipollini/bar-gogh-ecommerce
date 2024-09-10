import React, { useEffect } from "react";
import { useState } from "react";

import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import "./PhoneNumber.css";

import "country-flag-icons/3x2/flags.css";
import { useSelector } from "react-redux";

export const PhoneNumberInput = ({ phoneValue, onPhoneChange, isPhoneValid }) => {

  const country = useSelector((state) => state.shippingData.country);

  const [countryData, setCountryData] = useState(
    localStorage.getItem("country") || country
  );


  return (
    <div className="relative">
      <PhoneInput
        international
        className={`
         ${!isPhoneValid && "border-red-600 border-[1.5px]"}
        `}
        defaultCountry={countryData}
        value={phoneValue}
        onChange={onPhoneChange}
        name="phone"
      />
      <label
        htmlFor="phone"
        className={` PhoneInputLabel ml-5 ${isPhoneValid ? "text-slate-800" : "text-red-700"} `}
      >
        Phone Number*
      </label>
       {!isPhoneValid && (
        <div className="">
          <span className="text-red-700 text-sm">Please insert a valid phone number.</span>
        </div>
      )}
      {/*  <label className="PhoneCountryLabel">Prefix</label> */}
    </div>
  );
};

/* export const PhoneNumberInput = () => {

const [phoneNumber, setPhoneNumber] = useState("");
const [isValidPhoneNumber, setIsValidPhoneNumber] = useState(true);
const [internationalPrefix, setInternationalPrefix] = useState({
    country: "",
    prefix: ""
})


const handleChange = (event) => {
  const inputValue = event.target.value;

setPhoneNumber(inputValue);

  try {
    // Verifica se il numero di telefono è valido utilizzando libphonenumber-js
    const parsedPhoneNumber = parsePhoneNumberFromString(inputValue);

    const formattedNumber = parsedPhoneNumber.format('NATIONAL', {nationalPrefix: false})

    console.log(formattedNumber)

   if (parsedPhoneNumber) {
    
     const countryCallingCode = "+" + parsedPhoneNumber.countryCallingCode;
     const possibleCountries = parsedPhoneNumber.getPossibleCountries();
     const firstPossibleCountry =
       possibleCountries.length > 0 ? possibleCountries[0] : "";

     setInternationalPrefix({
       country: firstPossibleCountry,
       prefix: countryCallingCode,
     });
     setIsValidPhoneNumber(true);
   } else {
     setInternationalPrefix({
       country: "",
       prefix: "",
     });
     setIsValidPhoneNumber(false);
   }
  } catch (error) {
    console.log(error.message);
    setIsValidPhoneNumber(false);
  }
};



  return (
      <>
     <Input label="Phone Number" value={phoneNumber} 
     type="text"
     placeholder="add Phone Number"
     onInputChange={handleChange}
     initialValidity={true}
     
     />
      {!isValidPhoneNumber && phoneNumber !== "" && (
        <div className="text-xs -mt-5 text-red-500">
          Invalid phone number. Please enter a valid phone number.
        </div>
      )}
    </>
  
  )
}
 */
