import React, { useRef } from "react";
import { motion } from "framer-motion";
import mission from "../images/aboutUs/mission.jpeg"
import team from "../images/aboutUs/team.jpeg";
import story from "../images/aboutUs/story.jpeg";
import InfoLayout from "../Layout/InfoLayout";

const AboutUsContainerCard = ({
  title,
  description,
  descriptionSecond,
  descriptionThirst,
  orderTextNumber,
  orderImgNumber,
  img,
  alt,
  
}) => {

const orderVariants = {
  second: 'md:order-2',
  first: 'md:order-1',

};


  return (
    <>
      

      <motion.div
        initial={{
          opacity: 0,
          x: -100,
        }}
        whileInView={{
          opacity: 1,
          x: 0,
          transition: {
            duration: 0.7,
          },
        }}
        viewport={{ once: true }}
        className="flex flex-col p-4 md:flex-row justify-center gap-10 items-center  md:justify-between  w-full md:max-w-[50rem] xl:max-w-[62.5rem]"
      >
        <div
          className={`flex order-2 ${orderVariants[orderTextNumber]} flex-col gap-4 basis-1/2`}
        >
          <h2 className="font-bold text-xl text-slate-100">{title}</h2>
          <p className="text-slate-100 text-base text-balance">{description}</p>
          {descriptionSecond && (
            <p className="text-slate-100 text-base text-balance ">
              {descriptionSecond}
            </p>
          )}
          {descriptionThirst && (
            <p className="text-slate-100 text-base text-balance ">
              {descriptionThirst}
            </p>
          )}
        </div>

        <picture className={`order-1 ${orderVariants[orderImgNumber]}`}>
          <img
            src={img}
            alt={alt}
            className="w-full sm:max-w-[24rem] xl:max-w-[30rem] rounded-md shadow-lg"
          />
        </picture>
      </motion.div>
    </>
  );
};

/* export const aboutUsInfo = [
  {
    title: "Our Story",
    description: `Bar Gogh è nato dalla passione per le erbe e le tisane. Fondata nel
        2020, la nostra missione è di fornire tisane di alta qualità
        utilizzando solo le migliori erbe. Offriamo una varietà di tisane
        che puoi gustare nel nostro negozio o acquistare per prepararle a
        casa.`,
  },
  // Puoi aggiungere altre sezioni se necessario
]; */

const AboutUs = () => {
 /*  const ourStory = useRef();

  const moveDown = () => {
    ourStory.current.scrollIntoView({ behavior: "smooth" });
  }; */

  return (
    <>
      <InfoLayout firstTitle="About" secondTitle="Us">
        <div className="flex justify-center">
          <AboutUsContainerCard
            title="Our Story"
            description="Nestled in a picturesque village, Bar Gogh is an herb and tea shop that has been delighting customers for over a decade. Founded by Pierre, an expert herbalist with a passion for botany and art, Bar Gogh offers high-quality, organic teas inspired by the works of Vincent van Gogh."
            descriptionSecond="The shop features a warm, inviting atmosphere with reproductions of van Gogh's paintings on the walls. Customers can relax and enjoy freshly brewed teas in a cozy setting, or have their favorite blends shipped directly to their homes through Bar Gogh's efficient service.
"
            descriptionThirst="In addition to selling teas, Bar Gogh hosts workshops and events on herbs and teas, making it a community hub for learning and sharing a passion for natural wellness. With ten years of excellence, Bar Gogh continues to symbolize quality and authenticity, blending a love for nature and art in every cup."
            img={story}
            alt="Our Story"
            orderTextNumber="first"
            orderImgNumber="second"
          />
        </div>

        <div className="flex justify-center">
          <AboutUsContainerCard
            title="Our Mission"
            description=" At Bar Gogh, we harness the healing power of herbs to enhance the well-being of our customers."
            descriptionSecond=" We are dedicated to delivering exceptional products that not only taste exquisite but also promote health and relaxation. "
            descriptionThirst=" Each of our tea blends is meticulously crafted to ensure superior quality and flavor, reflecting our passion for natural wellness and our commitment to excellence."
            img={mission}
            alt="Our Mission"
            orderTextNumber="second"
            orderImgNumber="first"
          />
        </div>
        <div className="flex justify-center">
          <AboutUsContainerCard
            title="Our team"
            description="Our team consists of herbal specialists and tea enthusiasts dedicated to helping you discover the perfect blend for every moment of your day."
            descriptionSecond="With extensive knowledge and a genuine passion for natural wellness, we are here to guide you in selecting teas that not only taste great but also support your health and well-being."
            img={team}
            alt="Our Team"
            orderTextNumber="first"
            orderImgNumber="second"
          />
        </div>
      </InfoLayout>
    </>
  );
};

export default AboutUs;
