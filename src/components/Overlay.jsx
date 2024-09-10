import React, { useEffect } from 'react'

export const Overlay = ({active}) => {
   useEffect(() => {
     // Aggiungi la classe al body quando l'overlay è attivo
     document.body.classList.toggle("body-modal-open", active);

     // Pulisci al momento della disattivazione dell'overlay
     return () => {
       document.body.classList.remove("body-modal-open");
     };
   }, [active]);
  return (
    active && (
      <div className={`fixed inset-0 z-10 h-screen w-full bg-gradient-to-b from-overlay-start to-overlay-finish `}></div>
    )
  )
}
