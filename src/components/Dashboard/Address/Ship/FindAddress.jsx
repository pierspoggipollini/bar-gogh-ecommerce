import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Input from "../../../Input/Input";
import { motion } from "framer-motion";
import { useDebounce } from "react-use";
import {
  DeleteForeverOutlined,
  DeleteOutline,
} from "@mui/icons-material";
import { useLoadScript } from "@react-google-maps/api";

export const FindAddress = ({
  query,
  handleInputChange,
  onClick,
  onResetQuery,
  country,
  openManuallyAddress,
  validity,
  errorMessage,
  location,
  addLocation,
  removeLocation,
}) => {
  /* const { country, addresses } = useSelector((state) => state.shippingData); */
  const [autocompleteService, setAutocompleteService] = useState(null);

  const dispatch = useDispatch();

  /*   const [query, setQuery] = useState(""); */
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  const [active, setActive] = useState(false);

  const [state, setState] = useState("");

  const libraries = ["places"]; // Carica la libreria Places
  // Funzione per visualizzare i suggerimenti ottenuti dal servizio di autocompletamento
  const displaySuggestions = (predictions, status) => {
    if (status === "OK" && predictions.length > 0) {
      setResults(predictions.map((prediction) => prediction.description));
    } else {
      console.error("Errore nella ricerca di suggerimenti:", status);
      setError("Not Found");
      setResults([]);
    }
  };

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY, // Replace with your API key
    libraries,
  });

  useEffect(() => {
    if (isLoaded && !autocompleteService) {
      setAutocompleteService(new google.maps.places.AutocompleteService());
    }
  }, [isLoaded, autocompleteService]);

  const [, cancel] = useDebounce(
    async () => {
      if (query.length > 0) {
        try {
          autocompleteService.getQueryPredictions(
            {
              input: query,
              types: ["address"],
              componentRestrictions: { country: country },
            },
            (predictions, status) => {
              // Filtrare le previsioni per includere solo quelle relative agli indirizzi
              const addressPredictions = predictions.filter((prediction) => {
                return (
                  prediction.types.includes("street_address") ||
                  prediction.types.includes("route") ||
                  prediction.types.includes("geocode")
                );
              });

              displaySuggestions(addressPredictions, status);
            },
          );
        } catch (error) {
          console.error("Error in API request:", error);
          setError("Not Found");
          setResults([]);
        }
      }
    },
    500,
    [query],
  );

  const handleChange = (event) => {
    handleInputChange(event);
    setState("Continue writing the address to view the results");
    setError(null);
    setActive(true);
  };

  useEffect(() => {
    if (query === "") {
      setActive(false);
    } else if (query === location) {
      setActive(false);
    } else {
      setActive(true);
    }
  }, [query]);

  const handleAddressSelection = (selectedAddress) => {
    /*     dispatch(ShippingDataActions.addLocation(selectedAddress)); */
    addLocation(selectedAddress);
    setResults([]); // Pulisci i risultati della ricerca
    setActive(false);
    onResetQuery();
  };

  return (
    <div className="relative">
      <Input
        initialValidity={validity}
        find={true}
        classNameInputFind="pl-9 pr-24 text-sm "
        classNameLabelFind="md:peer-placeholder-shown:left-9 md:peer-placeholder-shown:text-sm md:peer-placeholder-shown:top-3 peer-placeholder-shown:text-slate-800"
        placeholder="Start typing..."
        type="text"
        onInputChange={handleChange}
        label="Find Address"
        value={query}
        required={false}
        name="query"
        error={errorMessage}
      />
      {active && (
        <span
          onClick={onClick}
          className=" absolute right-6 top-3 text-sm p-1 cursor-pointer tracking-wide font-semibold"
        >
          Reset
        </span>
      )}
      {active && (
        <div className="border-2 border-t-0 pb-1 border-slate-500">
          {state && (
            <>
              <p className="mb-1 bg-slate-300 px-3 py-2 text-sm">{state}</p>
            </>
          )}

          {error && (
            <span className="px-3 py-1 flex border-b w-full leading-relaxed text-red-700 text-sm">
              {error}
            </span>
          )}
          {results.length > 0 && (
            <div className="max-w-sm overflow-y-scroll h-32">
              <ul role="listbox" className="text-left w-full">
                {results.map((description, index) => (
                  <React.Fragment key={index}>
                    <li className="hover:bg-slate-300 border-b border-b-slate-300">
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        aria-label={description}
                        role="button"
                        type="button"
                        className=" text-sm w-full cursor-pointer p-3 text-left leading-relaxed"
                        onClick={() => handleAddressSelection(description)}
                      >
                        {description}
                      </motion.button>
                    </li>
                  </React.Fragment>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      {location && (
        <div className="flex flex-wrap items-center relative w-full min-h-14 px-3 py-1 mt-5  bg-slate-300 ">
          <span className="text-sm xs:text-base max-w-full pr-9 ">
            {location}
          </span>
          <motion.button
            whileTap={{ scale: 0.95 }}
            role="button"
            title="Remove the address"
            aria-label="Remove the address"
            onClick={removeLocation}
            className="absolute right-0 top-1.5 md:top-2 p-2 cursor-pointer"
          >
            <span className="hover:bg-slate-200 rounded-full p-2">
              <DeleteOutline sx={{ scale: "1.2" }} />
            </span>
          </motion.button>
        </div>
      )}
    </div>
  );
};
