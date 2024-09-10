import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { db } from "../../../../firebaseMethod";
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  runTransaction,
  updateDoc,
} from "firebase/firestore";
import { fetchShippingData } from "../../../../store/shippingData";
import { useMessageContext } from "../../../Dashboard/Message/MessageContext";
import * as CheckoutActions from "../../../../store/checkout";
import CheckoutAddressesLayout from "../../Addresses/CheckoutAddressesLayout";

export const ShipAddress = () => {
  const dispatch = useDispatch();
  const shippingData = useSelector((state) => state.shippingData);
  const { addresses } = shippingData;
  const [showForm, setShowForm] = useState(false);
  const [modify, setModify] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [isLoadingComponent, setIsLoadingComponent] = useState(true);
  const {
    user: { uid },
  } = useSelector((state) => state.userAuth);

  const {
    isNotificationVisible,
    setIsNotificationVisible,
    showSuccessMessage,
    showErrorMessage,
    text,
  } = useMessageContext();

  // Reference to the user document
  const userDocRef = doc(db, "users", uid);
  // Reference to the "addresses" collection
  const addressCollectionRef = collection(userDocRef, "addresses");

  useEffect(() => {
    // Simulate loading for 3 seconds
    setTimeout(() => {
      setIsLoadingComponent(false); // Change state to false after 3 seconds
    }, 800); // 800 milliseconds

    const unsub = onSnapshot(addressCollectionRef, () => {
      dispatch(fetchShippingData()); // Dispatch action to fetch shipping data
    });

    return () => {
      unsub(); // Unsubscribe from snapshot listener on component unmount
    };
  }, []);

  // Sort addresses based on defaultShipping value
  const sortedAddresses = [...addresses].sort(
    (a, b) => b.defaultShipping - a.defaultShipping,
  );
  // Initialize state for new addresses checkbox
  const [newAdddresses, setNewAddresses] = useState({});

  useEffect(() => {
    if (addresses) {
      // Map addresses to create initial state object for checkboxes
      const initialCheckboxState = addresses.reduce((acc, address) => {
        acc[address.id] = {
          defaultShipping: address.defaultShipping,
        };
        return acc;
      }, {});

      setNewAddresses(initialCheckboxState); // Set initial checkbox state
    }
  }, [addresses]);

  useEffect(() => {
    // Check if there are addresses and calculate defaultShippingAddress only if present
    if (addresses && addresses.length > 0) {
      const defaultShippingAddress = sortedAddresses.find(
        (address) => address.defaultShipping === true,
      );

      dispatch(CheckoutActions.addShipAddress(defaultShippingAddress));

      // Set selectedId only if defaultShippingAddress is present
      setSelectedId(defaultShippingAddress ? defaultShippingAddress.id : null);
    }
  }, [addresses]);

  // Handle change in checkbox state
  const handleChange = (e, id) => {
    const { checked } = e.target;
    setNewAddresses((prevValue) => ({
      ...prevValue,
      [id]: {
        ...prevValue[id],
        defaultShipping: checked,
      },
    }));
    setSelectedId(id);
  };

  // Activate modify mode
  const activeModify = () => {
    setModify(true);
  };

  // Update specific address property in Firestore
  async function updateAddressProperty(id, property, message) {
    try {
      // Get specific document reference based on ID
      const docRef = doc(addressCollectionRef, id);

      if (newAdddresses[id][property] === true) {
        // Update specific document with property value
        await updateDoc(docRef, { [property]: true });

        // Update other documents where property is true
        const querySnapshot = await getDocs(addressCollectionRef);
        await runTransaction(db, async (transaction) => {
          querySnapshot.forEach((doc) => {
            const addressData = doc.data();
            if (addressData[property] === true && doc.id !== id) {
              transaction.update(doc.ref, { [property]: false });
            }
          });
        });

        showSuccessMessage(message); // Show success message after successful update
      }
    } catch (error) {
      console.error("An error occurred during address update:", error);
      throw error; // Re-throw error for further propagation
    }
  }

  const ShipAddressSection = useRef();
  // Ref for showing form scroll
  const showFormRef = useRef();

  // Scroll to element function
  const scrollToElement = (ref) => {
    if (ref.current) {
      ref.current.scrollIntoView({
        behavior: "auto",
        block: "start",
        inline: "nearest",
      });
    }
  };

  // Handle sending of updated default shipping address
  const submitAddress = async (id) => {
    try {
      await updateAddressProperty(
        id,
        "defaultShipping",
        "Default Shipping Address Updated",
      );
      setModify(false);
      scrollToElement(ShipAddressSection);
    } catch (error) {
      showErrorMessage("Error during saving. Please try again.");
    }
  };

  useEffect(() => {
    if (showForm) {
      scrollToElement(showFormRef); // Scroll to form when showForm is true
    }
  }, [showForm]);

  return (
    <>
      <div
        ref={ShipAddressSection}
        className="w-full border-t  border-slate-800 pt-4 mt-3"
      >
        <h3 className="uppercase font-semibold text-lg">Ship Addresses</h3>
      </div>
      <CheckoutAddressesLayout
        addresses={addresses}
        sortedAddresses={sortedAddresses}
        showForm={showForm}
        setShowForm={setShowForm}
        isLoadingComponent={isLoadingComponent}
        isNotificationVisible={isNotificationVisible}
        modify={modify}
        setModify={setModify}
        activeModify={activeModify}
        submitAddress={submitAddress}
        isDefaultShipping={true}
        addressSubmitTitle="Delivery to this address"
        selectedId={selectedId}
        showFormRef={showFormRef}
        handleRadioChange={handleChange}
      />
    </>
  );
};
