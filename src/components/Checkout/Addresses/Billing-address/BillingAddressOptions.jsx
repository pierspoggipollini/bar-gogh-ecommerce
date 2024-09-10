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
import * as CheckoutActions from "../../../../store/checkout";
import CheckoutAddressesLayout from "../CheckoutAddressesLayout";
import { useMessageContext } from "../../../Dashboard/Message/MessageContext";

export const BillingAddressOptions = ({ billingAddressSection }) => {
  const dispatch = useDispatch();
  const shippingData = useSelector((state) => state.shippingData);
  const { addresses } = shippingData;
  const [showForm, setShowForm] = useState(false);
  const [modify, setModify] = useState(false);
  const [isLoadingComponent, setIsLoadingComponent] = useState(true);
  const {
    user: { uid },
  } = useSelector((state) => state.userAuth);

  // Reference to user document
  const userDocRef = doc(db, "users", uid);
  // Reference to "addresses" collection
  const addressCollectionRef = collection(userDocRef, "addresses");

  useEffect(() => {
    // Simulate loading for 3 seconds
    setTimeout(() => {
      setIsLoadingComponent(false); // Change state to false after 3 seconds
    }, 800); // 3 seconds in milliseconds

    const unsub = onSnapshot(addressCollectionRef, () => {
      dispatch(fetchShippingData());
    });

    return () => {
      unsub();
    };
  }, []);

  const [selectedId, setSelectedId] = useState("");

  useEffect(() => {
    // Check if there are addresses and calculate defaultBillingAddress only if present
    if (addresses && addresses.length > 0) {
      const defaultBillingAddress = sortedAddresses.find(
        (address) => address.defaultBilling === true,
      );

      /* dispatch(CheckoutActions.addBillingAddress(defaultBillingAddress)); */

      // Set selectedId only if defaultBillingAddress is present
      setSelectedId(defaultBillingAddress ? defaultBillingAddress.id : null);
    }
  }, [addresses]); // Dependency of the side effect on addresses

  const sortedAddresses = [...addresses].sort(
    (a, b) => b.defaultBilling - a.defaultBilling,
  );

  // Initialize checkbox state with the object created above
  const [newAdddresses, setNewAddresses] = useState({});

  const {
    isNotificationVisible,
    setIsNotificationVisible,
    showSuccessMessage,
    showErrorMessage,
    text,
  } = useMessageContext();

  useEffect(() => {
    if (addresses) {
      // Map addresses to create an initial state object
      const initialCheckboxState = addresses.reduce((acc, address) => {
        acc[address.id] = {
          defaultBilling: address.defaultBilling,
        };
        return acc;
      }, {});

      setNewAddresses(initialCheckboxState);
    }
  }, [addresses]);

  // Handle change in checkbox state
  const handleChange = (e, id) => {
    const { checked } = e.target;
    setNewAddresses((prevValue) => ({
      ...prevValue,
      [id]: {
        ...prevValue[id],
        defaultBilling: checked,
      },
    }));
    setSelectedId(id); // Set selected id after updating newAddresses
  };

  // Activate modify function
  const activeModify = () => {
    setModify(false);
  };

  // Async function to update address property
  async function updateAddressProperty(id, property, message) {
    // Get specific document based on ID
    const docRef = doc(addressCollectionRef, id);

    if (newAdddresses[id][property] === true) {
      // Update specific document referred by ID
      await updateDoc(docRef, { [property]: true });

      const defaultBillingAddress = addresses.find(
        (address) => address.defaultBilling === true,
      );

      dispatch(CheckoutActions.addBillingAddress(defaultBillingAddress));

      // Now that specific document is updated, you can run logic to set others to false
      const querySnapshot = await getDocs(addressCollectionRef);
      await runTransaction(db, async (transaction) => {
        querySnapshot.forEach((doc) => {
          const addressData = doc.data();
          if (addressData[property] === true && doc.id !== id) {
            // Set property to false in documents meeting the condition
            transaction.update(doc.ref, { [property]: false });
          }
        });
      });

      showSuccessMessage(message);
    }
  }

  // Function to submit address
  const submitAddress = async (id) => {
    try {
      // Use to set defaultBilling
      await updateAddressProperty(
        id,
        "defaultBilling",
        "Default Billing Address Updated",
      );
      setModify(false);
      scrollToElement(billingAddressSection);
    } catch (error) {
      showErrorMessage("Error during saving. Please try again.");
    }
  };

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

  useEffect(() => {
    if (showForm) {
      scrollToElement(showFormRef); // Scroll to form when showForm is true
    }
  }, [showForm]);

  return (
    <>
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
        isDefaultBilling={true}
        addressSubmitTitle="Set as billing address"
        selectedId={selectedId}
        showFormRef={showFormRef}
        handleRadioChange={handleChange}
      />
    </>
  );
};
