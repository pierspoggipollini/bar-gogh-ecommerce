import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CardForm from "./CardForm";
import React from 'react'

const CardFormRoute = () => {
  // Load Stripe with the publishable key from environment variables
  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

  return <>
    <Elements stripe={stripePromise}>
      <CardForm />
    </Elements>
  </>;
}

export default CardFormRoute
