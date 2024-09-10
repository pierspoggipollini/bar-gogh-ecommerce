import React from "react";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import WalletOutlinedIcon from "@mui/icons-material/WalletOutlined";
import CardGiftcardOutlinedIcon from "@mui/icons-material/CardGiftcardOutlined";
import HeadsetMicOutlinedIcon from "@mui/icons-material/HeadsetMicOutlined";
import { CardInfo } from "../../Card/CardInfo";
import { CardCategories } from "../../Card/CardCategories";
import { motion } from "framer-motion";
import { GridGallery } from "../Home/GridGallery";
import catTon from "../../images/categories/cat-ton.webp"
import catDig from "../../images/categories/cat-dig.webp"
import catRelax from "../../images/categories/cat-relax.webp"
import { v4 as uuidv4 } from "uuid";
import { BasicTabs } from "../../Carousel/BasicTabs";
import useCurrencyFormatter from "../../utilities/currency/useCurrencyFormatter";


// Section component
export const Section = () => {
  const formatAmount = useCurrencyFormatter();

  // Import background images
  const catRelaxBg = `${catRelax}`;
  const catDigBg = `${catDig}`;
  const catTonBg = `${catTon}`;

  // Information items with unique IDs
  const infoItem = [
    {
      id: uuidv4(),
      icon: <LocalShippingOutlinedIcon />,
      title: "Free shipping worldwide",
      info: `On orders over ${formatAmount(50)}`,
    },
    {
      id: uuidv4(),
      icon: <WalletOutlinedIcon />,
      title: "Cash on Delivery",
      info: "100% money-back guarantee",
    },
    {
      id: uuidv4(),
      icon: <CardGiftcardOutlinedIcon />,
      title: "Special gift card",
      info: "Offer special bonuses with a gift",
    },
    {
      id: uuidv4(),
      icon: <HeadsetMicOutlinedIcon />,
      title: "24/7 customer service",
      info: "Call us 24/7 at +33 93 006 4794",
    },
  ];

  // Categories with unique IDs
  const categories = [
    {
      id: uuidv4(),
      image: catRelaxBg,
      link: "/products/category/soothing",
      title: "Soothing",
    },
    {
      id: uuidv4(),
      image: catDigBg,
      link: "/products/category/digestive",
      title: "Digestive",
    },
    {
      id: uuidv4(),
      image: catTonBg,
      link: "/products/category/tonifying",
      title: "Tonifying",
    },
  ];
  return (
    <>
      <section className="h-full pt-5">
        {/* Animated Information Items */}
        <motion.div
          initial={{
            opacity: 0,
            x: -100,
          }}
          whileInView={{
            opacity: 1,
            x: 0,
            transition: {
              duration: 0.75,
            },
          }}
          viewport={{ once: true }}
          className="flex snap-x snap-mandatory scroll-p-0 gap-4 overflow-x-auto px-2 xl:mx-12 xl:justify-between "
        >
          {/* Mapping through information items */}
          {infoItem.map((item) => (
            <CardInfo
              key={item.id}
              icon={item.icon}
              title={item.title}
              info={item.info}
            />
          ))}
        </motion.div>

        {/* Animated Top Categories */}
        <motion.div
          initial={{
            opacity: 0,
          }}
          whileInView={{
            opacity: 1,

            transition: {
              duration: 0.75,
            },
          }}
          viewport={{ once: true }}
          className="mt-6 px-2"
        >
          {/* Heading for Top Categories */}
          <h1 className="text-bold text-center text-2xl text-slate-100">
            Top Categories
          </h1>

          {/* Relative container for category cards */}
          <div className="relative z-0 my-5 flex snap-x snap-mandatory scroll-p-0 gap-4 overflow-x-auto px-2 xl:mx-12 xl:justify-between 2xl:justify-evenly ">
            {/* Mapping through category items */}
            {categories.map((item) => (
              <CardCategories
                key={item.id}
                image={item.image}
                link={item.link}
                title={item.title}
              />
            ))}
          </div>
        </motion.div>

        {/* Additional Content (e.g., Top Products) */}
        <div className="mt-6">
          {/* Animated Basic Tabs Component */}
          <motion.div
            initial={{
              opacity: 0,
            }}
            whileInView={{
              opacity: 1,
              transition: {
                duration: 0.75,
              },
            }}
            viewport={{ once: true }}
            className="mx-4 xl:mx-6 "
          >
            <BasicTabs />
          </motion.div>
        </div>

        {/* Animated Grid Gallery Component */}
        <motion.div
          initial={{
            opacity: 0,
          }}
          whileInView={{
            opacity: 1,
            transition: {
              duration: 1,
            },
          }}
          viewport={{ once: true }}
          className="my-6 "
        >
          <GridGallery />
        </motion.div>
      </section>
    </>
  );
};
