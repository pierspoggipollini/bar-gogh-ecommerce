export const variants = {
  open: {
    opacity: 1,
    x: 0,
    transition: {
      type: "tween",
      stiffness: 500,
      damping: 50,
      mass: 1,
      restSpeed: 0.01,
      staggerChildren: (index) => index * 0.1,
    },
  },
  closed: {
    opacity: 0,
    x: "-100%",
    transition: {
      type: "tween",
      duration: 0.3,
      when: "afterChildren",
    },
  },
};

export const variantFooter = {
  open: {
    clipPath: "inset(0% 0% 0% 0%)",
    transition: {
      type: "spring",
      bounce: 0,
      duration: 0.7,
      delayChildren: 0.2,
      staggerChildren: 0.05,
    },
  },
  closed: {
    clipPath: "inset(10% 50% 90% 50% )",
    transition: {
      type: "spring",
      bounce: 0,
      duration: 0.3,
    },
  },
};

export const termsMenuVariant = {
  open: {
    height: "100%", // o max-height a un valore sufficientemente grande
    transition: {
      type: "spring",
      bounce: 0,
      duration: 0.1,
      delayChildren: 0.1,
      staggerChildren: 0.1,
    },
  },
  closed: {
    height: 0,
    overflow: "hidden", // Nasconde il contenuto che fuoriesce dall'altezza chiusa
    transition: {
      type: "spring",
      bounce: 0,
      duration: 0.3,
    },
  },
};


export const accountVariantProva = {
  open: {
    clipPath: "inset(0% 0% 0% 0%)",
    transition: {
      type: "spring",
      duration: 0.7,
      staggerChildren: (index) => index * 6,
    },
  },
  closed: {
    clipPath: "inset(10% 50% 90% 50%)",
    transition: {
      type: "spring",
      duration: 0.3,
      when: "afterChildren",
    },
  },
};

export const accountVariant = {
  open: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.2 },
  },
  closed: {
    opacity: 0,
    scale: 0.5,
    transition: { duration: 0.2 },
  },
};

export const variantsRight = {
  open: {
    opacity: 1,
    x: 0,
    transition: {
      type: "tween",
      stiffness: 500,
      damping: 50,
      mass: 1,
      restSpeed: 0.01,
      staggerChildren: (index) => index * 0.1,
    },
  },
  closed: {
    opacity: 0,
    x: "100%",
    transition: {
      type: "tween",
      duration: 0.3,
    },
  },
};

export const itemVariants = {
  open: {
    opacity: 1,
    x: 0,
    transition: { type: "tween", duration: 0.5 },
  },
  closed: {
    opacity: 0,
    x: "-100%",
    transition: { duration: 0.3 },
  },
};

export const itemDeskVariant = {
  open: {
    opacity: 1,
    y: 0,
    transition: { type: "tween", duration: 0.5 },
  },
  closed: {
    opacity: 0,
    y: "-100%",
    transition: { duration: 0.2 },
  },
};

export const itemVariantsFooter = {
  open: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 200, damping: 24 },
  },
  closed: { opacity: 0, y: 20, transition: { stiffness: 200, damping: 24 } },
};


export const variantMobile = {
  initial: { opacity: 0, scale: 0.5, x: '-50%' },
  animate: { opacity: 1, scale: 1, x: '-50%' },
  exit: { opacity: 0, scale: 0.5, x: '-50%',  },
  transition: { duration: 0.2 },
};


// Variants for Framer Motion animations
export const containerVariants = {
  open: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      staggerChildren: 0.1,
      stiffness: 500,
      damping: 55,
    },
  },
  closed: {
    opacity: 0,
    y: -50,
    transition: {
      duration: 0.2,
    },
  },
};
