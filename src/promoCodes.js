import { nanoid } from "nanoid";

export const promoCodes = [
  {
    code: nanoid(8),
    discount: 10,
    startDate: "2023-11-01",
    endDate: "2023-11-30",
    description: "Promo Code 1",
  },
  {
    code: nanoid(8),
    discount: 30,
    startDate: "2023-12-01",
    endDate: "2023-12-31",
    description: "Promo Code 2",
  },
  // Add more promo codes here
];
