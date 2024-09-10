import React from 'react'
import { SelectInput } from './SelectInput';

function getMonthsInYear() {
  // Get the current year as a four-digit number (e.g., 2023)
  const currentYear = new Date().getFullYear();

  // Create an empty array to store information about the months
  const months = [];

  // Iterate through the months from January (0) to December (11)
  for (let month = 0; month < 12; month++) {
    // Create a date for the current month with day 1
    const date = new Date(currentYear, month, 1);

    // Get the full name of the month in the default locale
    const monthName = date.toLocaleString("default", { month: "long" });

    // Add an object to our "months" array with the month number (from 1 to 12) and the full month name
    months.push({
      month: month + 1, // Months in JavaScript are 0-based, so we add 1
      name: monthName,
    });
  }

  // Return the "months" array containing information about the months of the current year
  return months;
}

const monthsInYear = getMonthsInYear();


function getYearsList() {
  const currentYear = new Date().getFullYear();
const years = [...Array(11)].map((_, index) => currentYear + index);

  return years;
}

const yearsList = getYearsList();

const selectData = [
  {
    label: "Month*",
    name: "expirationMonth",
    placeholder: "Month",
    options: monthsInYear.map(data => data.month)
  },
  {
    label: "Year*",
    name: "expirationYear",
    placeholder: "Year",
    options: yearsList
  },
];


export const ExpiryDate = ({ handleSelect, dataError, formData }) => {
  
  
    const handleChage = (event, fieldName) => {
      const selectedOption = event.target.value;
      handleSelect(fieldName, selectedOption);
    };

 const errorMessages = [];
    selectData.forEach((data) => {
      const error =
        data.name === "expirationMonth"
          ? dataError.expirationMonth.message
          : data.name === "expirationYear"
          ? dataError.expirationYear.message
          : "";
      

      if (error) {
        errorMessages.push(error);
      }

    });
const errorDate = dataError.expirationDate.message;


  return (
    <div className={`grid relative gap-5 border-[1.5px] rounded-sm ${dataError.expirationDate.valid ? "border-gray-800" : "border-red-700"} p-5`}>
      <span className={`absolute -top-5 ${dataError.expirationDate.valid ? "text-slate-800" : "text-red-700"} bg-slate-100 left-2 text-xs p-2`}>
        Expiry Date*
      </span>
      <div className="flex  flex-col md:flex-row gap-4 w-full">
        {selectData.map((data) => {
          return (
            <div className="w-full relative" key={data.name}>
              <SelectInput
                label={data.label}
                id="expiry-date"
                options={data.options}
                defaultOption={data.label}
                defaultValue={formData[data.name]}
                disabled={false}
                handleSelect={(e) => handleChage(e, data.name)}
                selectedValue={!!formData[data.name]}
                error={
                  data.name === "expirationMonth"
                    ? dataError.expirationMonth.message
                    : data.name === "expirationYear"
                    ? dataError.expirationYear.message
                    : dataError.expirationDate.message
                }
              />
            </div>
          );
        })}
      </div>
      {selectData.map((data) => {
        const error =
            data.name === "expirationMonth"
            ? dataError.expirationMonth.message
            : data.name === "expirationYear"
            ? dataError.expirationYear.message
            : ""
           
      


        // Mostra lo <span> solo se esiste un messaggio di errore
        if (error) {
          return (
            <span key={`error-${data.name}`} className="text-red-700 text-sm">
              {error}
            </span>
          );
        }

        return null; // Non renderizzare nulla se non c'è errore
      })}
     { errorDate && errorMessages && <div>
        <span className='text-red-700 text-sm'>{errorDate}</span>
      </div>}
    </div>
  );
};
