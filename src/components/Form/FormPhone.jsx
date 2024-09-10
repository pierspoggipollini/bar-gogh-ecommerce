import React, { useEffect } from "react";
import { useState } from "react";
import PhoneInput from "react-phone-number-input";
/* import "react-phone-number-input/style.css"; */
/* import "./PhoneNumber.css"; */

import "country-flag-icons/3x2/flags.css";
import { useSelector } from "react-redux";

export const FormPhone = ({
  phoneValue,
  onPhoneChange,
  isPhoneValid,
  initialValidity,
}) => {

  const country = useSelector((state) => state.shippingData.country);

  const [countryData, setCountryData] = useState(
    localStorage.getItem("country") || country,
  );

  return (
    <div className="relative ">
      <PhoneInput
        international
        className={` ${
          initialValidity
            ? "border-neutral-500 "
            : isPhoneValid
              ? "border-green-600"
              : "border-red-600"
        }
        peer  h-12  w-full focus:border-slate-800
        rounded-xl border-2  bg-primary p-2 py-0 px-4 text-sm  placeholder-transparent outline-none transition-all focus:placeholder-slate-500 `}
        defaultCountry={countryData}
        value={phoneValue}
        onChange={onPhoneChange}
        name="phoneNumber"
      />
      <label
        /* className={` PhoneInputLabel ${
          isPhoneValid ? "text-slate-800" : "text-red-600"
        } `} */
       
         className="
                pointer-events-none 
                absolute
                left-3
                -top-3
                bg-primary
              p-1
                text-xs
                transition-all
                peer-placeholder-shown:top-2
                peer-placeholder-shown:bg-primary
              peer-placeholder-shown:text-sm
              peer-placeholder-shown:text-neutral-600
                peer-focus:-top-3
                peer-focus:left-3              
                peer-focus:bg-primary
                peer-focus:p-1
              peer-focus:text-xs
                peer-focus:text-neutral-800
                md:peer-placeholder-shown:top-2     
              md:peer-placeholder-shown:text-base
              md:peer-focus:-top-3
                md:peer-focus:left-3
             md:peer-focus:p-1
                md:peer-focus:text-xs
                md:peer-focus:text-neutral-800       
              
              "
      >
        Phone Number*
      </label>
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
