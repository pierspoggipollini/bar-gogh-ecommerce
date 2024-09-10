import React from "react";
import {
  EmailOutlined,
  HouseOutlined,
  PhoneOutlined,
} from "@mui/icons-material";

const ContactInfoData = [
  {
    icon: <HouseOutlined aria-label="Address icon" />,
    category: "Address",
    value: "80 rue Beauvau, 13003 Marseille, France",
  },
  {
    icon: <PhoneOutlined aria-label="Phone icon" />,
    category: "Phone",
    value: "+33 93 006 4794",
  },
  {
    icon: <EmailOutlined aria-label="Email icon" />,
    category: "Email",
    value: "bargogh@gmail.com",
  },
];

export default ContactInfoData;
