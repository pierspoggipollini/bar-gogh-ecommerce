import React, { useCallback, useEffect, useState } from "react";
import { DashHeader } from "../DashHeader";
import { NavLink } from "react-router-dom";
import {
  CreditCardOutlined,
  DeleteForeverOutlined,
  PersonOutline,
} from "@mui/icons-material";
import { Skeleton } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { CheckboxInput } from "../../Input/CheckboxInput/CheckboxInput";
import { cardImages } from "./CardImages";
import { db } from "../../../firebaseMethod";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  runTransaction,
  updateDoc,
} from "firebase/firestore";
import { fetchCreditCardsData } from "../../../store/savedPayments";
import { Confirmation } from "../Address/EditShip/Confirmation";
import { Message } from "../Message/Message";
import { motion } from "framer-motion";
import { useMessageContext } from "../Message/MessageContext";

const PaymentMethodsContainer = ({
  creditCardWithDefaultShipping,
  onInputChange,
  loading,
  deleteCreditCard,
  defaultPaymentChecked,
  savedPayment,
}) => {
  return (
    <>
      {loading ? (
        <div className="relative flex h-64 justify-center flex-col w-full bg-slate-100 p-8 ">
          <div className="flex mt-3  w-2/3 sm:text-sm lg:text-base flex-col flex-wrap gap-2">
            {[...Array(4)].map((_, i) => (
              <React.Fragment key={i}>
                <Skeleton
                  variant="text"
                  sx={{ fontSize: "1rem" }}
                  width={200}
                />
              </React.Fragment>
            ))}

            <div className="absolute text-sm p-1 top-5 right-9 flex items-center gap-2 text-slate-900 hover:text-slate-700">
              <Skeleton variant="text" width={100} height={22} />
            </div>
          </div>
        </div>
      ) : (
        <div className="relative flex gap-2 h-auto mb-2  last:mb-0 flex-col w-full bg-slate-100 p-8 ">
          {creditCardWithDefaultShipping.map((card, index) => (
            <React.Fragment key={index}>
              <div className="flex items-center gap-3">
                <img
                  src={cardImages[card.type]}
                  alt="credit card type"
                  className="w-8 h-auto"
                />
                <span>{`${card.type.toUpperCase()} (${card.cardNumber.slice(
                  15,
                  19,
                )})`}</span>
              </div>
              <ul className="flex max-w-xs leading-relaxed text-sm xs:text-base lg:text-base flex-col flex-wrap gap-2">
                <li>Exp: {card.expirationDate}</li>
                <li>{card.cardholderName}</li>
              </ul>
              <>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={deleteCreditCard}
                  role="button"
                  aria-label="Delete payment info"
                  title="Delete payment info"
                  disabled={savedPayment > 1 ? card.defaultPayment : false}
                  className={`absolute top-4 p-2 text-sm right-3 md:right-9  flex items-center gap-2 text-slate-900 disabled:text-slate-500 disabled:hover:text-slate-500 hover:text-slate-700`}
                >
                  <span className="hidden lg:block">Delete</span>
                  <span>
                    <DeleteForeverOutlined sx={{ fontSize: "2rem" }} />
                  </span>
                </motion.button>
              </>

              {card.defaultPayment && (
                <div className="flex w-full flex-col">
                  <span className="flex items-center text-sm text-slate-500 gap-2">
                    This is your default payment method.
                  </span>
                </div>
              )}

              {!card.defaultPayment && (
                <div className="flex flex-col gap-4 text-sm">
                  <CheckboxInput
                    name="defaultPayment"
                    label="Set as default payment method."
                    onInputChange={(e) => onInputChange(e, card.id)} // Passa l'ID dell'indirizzo
                    checked={defaultPaymentChecked}
                  />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      )}
    </>
  );
};

export const MyPaymentMethods = () => {
  // State for managing loading state of the component
  const [isLoadingComponent, setIsLoadingComponent] = useState(false);

  // Destructuring values from useMessageContext custom hook
  const {
    isNotificationVisible,
    setIsNotificationVisible,
    showSuccessMessage,
    showErrorMessage,
    text,
  } = useMessageContext();

  // Selector to access savedPayment state from Redux store
  const savedPayment = useSelector((state) => state.savedPayment);

  // Destructuring user's UID from userAuth state in Redux store
  const {
    user: { uid },
  } = useSelector((state) => state.userAuth);

  // Dispatcher function from Redux to dispatch actions
  const dispatch = useDispatch();

  // Reference to the user document in Firestore
  const userDocRef = doc(db, "users", uid);

  // Reference to the "creditCards" collection under the user document
  const creditCardsCollectionRef = collection(userDocRef, "creditCards");

  // Effect hook to simulate component loading and fetch credit card data
  useEffect(() => {
    // Simulate loading state for 800 milliseconds
    setTimeout(() => {
      setIsLoadingComponent(false); // Set loading state to false after 800 milliseconds
    }, 800);

    // Subscribe to changes in the "creditCards" collection and fetch updated data
    const unsub = onSnapshot(creditCardsCollectionRef, () => {
      dispatch(fetchCreditCardsData());
    });

    // Cleanup function to unsubscribe from snapshot listener
    return () => {
      unsub();
    };

    /*  const unsub = onSnapshot(creditCardsCollectionRef, (doc) => {
    doc.docChanges().forEach((change) => {
      const addressData = change.doc.data();
      const addressId = change.doc.id;
      // Update Redux state with newly added or modified address
      dispatch(fetchCreditCardsData(token));
      console.log(dispatch);
    });
    return () => {
      unsub();
    };
  }); */
  }, []);

  // State to manage default payment methods
  const [defaultPayments, setDefaultPayments] = useState({});

  // Effect hook to initialize defaultPayments based on savedPayment from Redux
  useEffect(() => {
    if (savedPayment) {
      // Create an object mapping IDs to defaultPayment values
      const initialDefaultPayments = savedPayment.reduce((acc, cards) => {
        acc[cards.id] = cards.defaultPayment;
        return acc;
      }, {});

      setDefaultPayments(initialDefaultPayments);
    }
  }, [savedPayment]);

  // Function to sort payment methods by defaultPayment value
  const sortPaymentMethods = useCallback((payments) => {
    if (payments.length > 1) {
      return [...payments].sort((a, b) => {
        return b.defaultPayment - a.defaultPayment;
      });
    } else {
      return [...payments];
    }
  }, []); // Empty dependencies ensure the function is memoized only once

  // Sort payment methods using the stored function
  const sortedPaymentMethods = sortPaymentMethods(savedPayment);

  const [checkboxChanged, setCheckboxChanged] = useState(false);
  const [selectedID, setSelectedID] = useState(null);

  // Handle checkbox change event
  const handleChange = (e, id) => {
    const { checked } = e.target;

    // Update defaultPayments state with the checked status
    setDefaultPayments((prevDefaultPayments) => ({
      ...prevDefaultPayments,
      [id]: checked,
    }));

    // Update selectedID with the ID of the selected payment method
    setSelectedID(checked ? id : null);

    // Set checkboxChanged to true indicating a change in checkbox state
    setCheckboxChanged(true);
  };

  useEffect(() => {
    // This effect runs whenever selectedID changes
    // and when the checkbox has been changed (checkboxChanged is true)
    if (selectedID !== null && checkboxChanged) {
      // Delay sending the updated default payment ID
      setTimeout(() => {
        send(selectedID);
      }, 600);

      // Reset checkboxChanged to false after execution
      setCheckboxChanged(false);
    }
  }, [selectedID, checkboxChanged]); // Add checkboxChanged to dependencies

  const send = async (id) => {
    try {
      // Get the specific document based on the ID
      const docRef = doc(creditCardsCollectionRef, id);

      // Check if the current payment method is already set as default
      if (defaultPayments[id] === true) {
        // Update the specific document with the ID to set defaultPayment to true
        await updateDoc(docRef, {
          defaultPayment: true,
        });

        // After updating the specific document, logic to set other documents to false
        const querySnapshot = await getDocs(creditCardsCollectionRef);
        await runTransaction(db, async (transaction) => {
          querySnapshot.forEach((doc) => {
            const creditCardsData = doc.data();
            if (creditCardsData.defaultPayment === true && doc.id !== id) {
              // Update defaultPayment to false for documents meeting the condition
              transaction.update(doc.ref, {
                defaultPayment: false,
              });
            }
          });
        });

        // Scroll to the top of the page
        window.scrollTo(0, 0);

        // Display success message
        showSuccessMessage("Default Payment Method Updated.");
      }
    } catch (error) {
      // Handle errors during the update process
      showErrorMessage("Error during saving. Please try again.");
    }
  };

  const [showConfirmation, setShowConfirmation] = useState(false);

  // Function to show the delete confirmation dialog
  const confirmDelete = () => {
    setShowConfirmation(true);
  };

  // Function to cancel the delete confirmation
  const cancelConfirmDelete = () => {
    setShowConfirmation(false);
  };

  // Function to delete a payment method
  const deletePayment = async (e, id) => {
    e.preventDefault();
    try {
      // Get the specific document based on the ID
      const docRef = doc(creditCardsCollectionRef, id);

      // Delete the document from Firestore
      await deleteDoc(docRef);

      // Fetch updated data after deletion
      onSnapshot(creditCardsCollectionRef, () => {
        dispatch(fetchCreditCardsData());
      });

      // Scroll to the top of the page
      window.scrollTo(0, 0);

      // Show success message after deletion
      showSuccessMessage("Payment Method Removed Successfully.");
    } catch (error) {
      // Handle errors during deletion
      if (error) {
        showErrorMessage(
          "Error during removing this payment method. Please try again.",
        );
      }
    }
  };

  return (
    <>
      <DashHeader
        /*  backPage="/dashboard" */
        backIcon={<PersonOutline sx={{ fontSize: "1.8rem" }} />}
        title="My Payment Methods"
        icon={<CreditCardOutlined fontSize="large" />}
      />
      {savedPayment.length > 0 && (
        <div className="w-full flex justify-center md:justify-normal">
          <NavLink
            to="/dashboard/payment-methods/add"
            className="mx-4 mb-4 w-72 border uppercase border-slate-400 bg-slate-200 p-4 text-center text-base font-semibold hover:bg-slate-300  "
          >
            Add New Payment Method
          </NavLink>
        </div>
      )}
      <Message />

      <>
        {/*  if there aren't payment in array */}
        {!savedPayment.length && (
          <div className=" flex justify-center items-center gap-2  p-4 rounded-lg  max-w-full leading-relaxed h-64 bg-slate-100 ">
            <div className="flex flex-col items-center gap-2 text-center justify-center w-full flex-wrap">
              {isLoadingComponent ? (
                <Skeleton
                  variant="text"
                  sx={{ fontSize: "1rem" }}
                  width={280}
                />
              ) : (
                <span className="font-semibold text-base lg:text-lg">
                  Currently, you have no payment methods.
                </span>
              )}
              {isLoadingComponent ? (
                <Skeleton
                  variant="text"
                  sx={{ fontSize: "1rem" }}
                  width={330}
                />
              ) : (
                <span className="text-sm lg:text-base">
                  You can create a new one by clicking below.
                </span>
              )}
              {isLoadingComponent ? (
                <Skeleton
                  variant="rounded"
                  width={260}
                  sx={{ marginTop: "0.75rem", marginBottom: "1rem" }}
                  height={45}
                />
              ) : (
                <NavLink
                  to="add"
                  className=" my-3 uppercase flex min-h-12 w-full md:w-72 items-center justify-center rounded-md bg-primary-btn  p-2 font-semibold hover:bg-primary-hover"
                >
                  Add New Payment Method
                </NavLink>
              )}
            </div>
          </div>
        )}
        {savedPayment && (
          <>
            {sortedPaymentMethods.map((cards) => (
              <>
                <PaymentMethodsContainer
                  key={cards.id}
                  onInputChange={handleChange}
                  creditCardWithDefaultShipping={[cards]}
                  loading={isLoadingComponent}
                  defaultPaymentChecked={defaultPayments[cards.id]}
                  deleteCreditCard={confirmDelete}
                  savedPayment={savedPayment}
                />
                <Confirmation
                  showConfirmation={showConfirmation}
                  title="Remove Payment Method"
                  advice="Are you sure you want to delete this payment method?"
                  label="Payment Method"
                  sendRemoval={(e) => deletePayment(e, cards.id)}
                  cancel={cancelConfirmDelete}
                />
              </>
            ))}
          </>
        )}
      </>
    </>
  );
};
