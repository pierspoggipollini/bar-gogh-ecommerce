import React from "react";
import { Rating, createTheme } from "@mui/material";
import { ThemeProvider } from "styled-components";

export const RatingStars = ({ rating, primary, size }) => {
  /*  const roundedRating = Math.floor(Math.round(rating * 2) / 2);
   const stars = [...Array(roundedRating)].map((_, i) => (
     <Rating
      key={i}
       precision={0.5}
       readOnly
     />
   )); */
  const theme = createTheme({
    palette: {
      border: {
        main: primary,
      },
    },
  });

  return (
    <>
      <ThemeProvider theme={theme}>
        <Rating
          name="read-only"
          value={rating}
          precision={0.5}
          defaultValue={2.5}
          size={size}
          readOnly
          color="border"
        />
      </ThemeProvider>
    </>
  );
};
