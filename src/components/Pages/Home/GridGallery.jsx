import React from "react";
import ItemOne from "../../images/gallery/photo_1.webp";
import ItemTwo from "../../images//gallery/photo_2.webp";
import ItemThree from "../../images/gallery/photo_3.webp";
import ItemFour from "../../images/gallery/photo_4.webp";
import ItemFive from "../../images/gallery/photo_5.webp";
import { v4 as uuidv4 } from "uuid";

const gallery = [
  {
    id: uuidv4(),
    src: ItemOne,
    alt: "easy-to-brew teas",
    caption: "Greet wellness with our easy-to-brew teas.",
  },
  {
    id: uuidv4(),
    src: ItemTwo,
    alt: "sustainable agriculture herbal teas",
    caption: "Sip sustainability: Our sustainable agriculture herbal teas.",
  },
  {
    id: uuidv4(),
    src: ItemThree,
    alt: "moment of peace",
    caption: "Your moment of peace: Sip a herbal tea and unwind.",
  },
  {
    id: uuidv4(),
    src: ItemFour,
    alt: "range of flavors",
    caption:
      "Explore a range of flavors and create your custom herbal tea blend.",
  },
  {
    id: uuidv4(),
    src: ItemFive,
    alt: "steaming herbal tea",
    caption: "Your favorite herbal tea, freshly served and steaming.",
  },
];

// CaptionGallery component to display images with captions
const CaptionGallery = ({ src, alt, caption }) => (
  <figure className="relative grid h-full place-items-center group overflow-hidden">
    <img src={src} alt={alt} className="h-full w-full object-cover group-hover:scale-110 group-hover:transition group-hover:ease-in-out group-hover:transform group-hover:duration-1000" />
    <div className="absolute inset-0 bg-black opacity-40"></div>
    <figcaption className="absolute w-3/5 text-center text-[12px] text-primary lg:text-base opacity-0 group-hover:opacity-100 group-hover:ease-in-out transition-opacity duration-300">
      {caption}
    </figcaption>
  </figure>
);

// GridGallery component to organize images into a grid layout
export const GridGallery = () => {
  return (
    <div className="grid grid-cols-1 bg-primary sm:gap-4 md:grid-cols-3">
      {/* First div with the first two elements */}
      <div className="grid grid-cols-2 md:grid-cols-1 md:gap-3">
        {gallery.slice(0, 2).map((photo) => (
          <CaptionGallery
            key={photo.id}
            src={photo.src}
            alt={photo.alt}
            caption={photo.caption}
          />
        ))}
      </div>

      {/* Second div with only the third element */}
      <div className="col-span-2 grid md:col-span-1">
        {gallery.slice(2, 3).map((photo) => (
          <CaptionGallery
            key={photo.id}
            src={photo.src}
            alt={photo.alt}
            caption={photo.caption}
          />
        ))}
      </div>

      {/* Third div with the last two elements */}
      <div className="grid grid-cols-2 md:grid-cols-1 md:gap-4">
        {gallery.slice(3, 5).map((photo) => (
          <CaptionGallery
            key={photo.id}
            src={photo.src}
            alt={photo.alt}
            caption={photo.caption}
          />
        ))}
      </div>
    </div>
  );
};
