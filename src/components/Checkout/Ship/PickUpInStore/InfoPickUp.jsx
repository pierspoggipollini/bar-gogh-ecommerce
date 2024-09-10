import { LockClock, LockClockOutlined, Mail, MailOutlineSharp } from "@mui/icons-material";
import React from "react";

export const InfoPickUp = () => {
  const instructions = [
    {
      icon: <Mail />,
      description:
        " We will send you an email as soon as your items are ready for in-store pickup.",
    },
    {
      icon: (
        <svg
          fill="#00000"
          version="1.1"
          
          id="Capa_1"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          width="24px"
          height="24px"
          viewBox="0 0 988 988"
          xmlSpace="preserve"
        >
          <g>
            <path
              d="M928,109.5H60c-33.1,0-60,26.9-60,60v649c0,33.1,26.9,60,60,60h868c33.1,0,60-26.9,60-60v-649
    C988,136.4,961.1,109.5,928,109.5z M470.5,671.7c0,24.399-85.8,44.2-192.5,44.7C171.3,715.9,85.5,696.1,85.5,671.7v-93.2
    c0-32.5,26.3-58.8,58.8-58.8h62.3c14,0,18.9-11.9,16.2-24.101c-3.2-14.399-16.3-23.199-25.6-33.6c-22.5-25.3-39.7-55.3-39.7-90
    c0-66.5,53.9-120.4,120.4-120.4c0.1,0,0.2,0,0.2,0c0.1,0,0.2,0,0.2,0c66.5,0,120.4,53.9,120.4,120.4c0,34.7-17.2,64.7-39.7,90
    c-9.3,10.4-22.5,19.3-25.6,33.6C330.7,507.9,335.5,519.7,349.6,519.7H411.9c32.5,0,58.8,26.3,58.8,58.8v93.2H470.5z M859.4,642.5
    h-264c-22.101,0-40-17.9-40-40s17.899-40,40-40h264c22.1,0,40,17.9,40,40S881.5,642.5,859.4,642.5z M859.4,405.5h-264
    c-22.101,0-40-17.9-40-40s17.899-40,40-40h264c22.1,0,40,17.9,40,40S881.5,405.5,859.4,405.5z"
            
            />
          </g>
        </svg>
      ),
      description:
        "Please bring a valid identification document with you. If you have delegated another person to pick up the order, that person must also present a valid identification document and provide the order number.",
    },
    {
      icon: <LockClock/>,
      description:
        "Your order will be held for 10 days before it is automatically returned and refunded.",
    },
  ];

  return (
    <>
      <div className="w-full mt-3 mb-2">
        <h3 className="uppercase font-semibold text-base">
          How does the pickup work?
        </h3>
      </div>

      <div className="grid gap-4">
        {instructions.map((data, index) => (
          <div
            key={index}
            className="flex flex-col items-start md:flex-row w-full gap-3 md:gap-5 md:items-center text-xs leading-relaxed"
          >
            {<span className="">{data.icon}</span>}
            <p className="">{data.description}</p>
          </div>
        ))}
        <span></span>
        <p></p>
      </div>
    </>
  );
};
