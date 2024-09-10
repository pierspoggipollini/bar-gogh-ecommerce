import { Skeleton } from '@mui/material';
import React from 'react'
import { motion } from 'framer-motion';

export const SkeletonCardProduct = () => {
   return (
     <>
       <motion.div
         whileHover={{ scale: 0.95 }}
         className=" relative h-[20rem] lg:h-[28.125rem] lg:max-h-[28.125rem] w-full max-w-[18rem] 2xl:max-w-[20rem] rounded-lg overflow-hidden cursor-pointer flex flex-col  bg-primary  lg:drop-shadow-2xl"
       >
         <div className=" relative h-[12rem] w-full rounded-t-lg  bg-slate-200">
           {/* Image Skeleton  */}
           <Skeleton
             sx={{ bgcolor: "grey.200" }}
             animation="wave"
             variant="rounded"
             width="100%"
             height="12rem"
           />
           {/* 
            <img
              src={images[Image]}
              alt={Title}
              className="h-full w-full rounded-lg   object-contain"
            /> */}
         </div>
         <div className="flex flex-col flex-1  px-3  gap-4">
           <div className="mt-3 text-[14px] lg:flex lg:items-center justify-between  lg:text-left">
             <div className="w-full max-w-full lg:max-w-[75%] pr-6">
               {/* Title Skeleton */}
               <Skeleton
                 variant="text"
                 animation="pulse"
                 sx={{ fontSize: "1.5rem", bgcolor: "grey.400" }}
                 width={130}
               />
             </div>
             <div className=" absolute bottom-5 lg:bottom-0  font-semibold text-[16px] lg:relative  xl:text-lg">
               {/* Price Skeleton */}
               <Skeleton
                 variant="text"
                 animation="pulse"
                 sx={{ fontSize: "1.5rem", bgcolor: "grey.400" }}
                 width={50}
               />
             </div>
           </div>
           <div className="-mt-2 flex">
             {/* Rating Skeleton */}
             <Skeleton
               animation="pulse"
               sx={{ bgcolor: "grey.400" }}
               variant="rounded"
               width={100}
               height={15}
             />
           </div>

           <div className="hidden text-center text-xs leading-relaxed  lg:text-left lg:line-clamp-2">
             {/* Description Skeleton */}
             <Skeleton
               sx={{ bgcolor: "grey.400" }}
               variant="rounded"
               animation="pulse"
               width="100%"
               height={30}
             />
           </div>

           {/*  <button className='w-full relative mt-1 py-3 px-12 bg-primary-btn rounded-2xl'>Add to Cart</button>
        <ShoppingCartIcon sx={{position: 'absolute', bottom: '1.6rem', left: '27%'}} /> */}
         </div>
         <div className="left-0 bottom-0 right-0 mx-2 mb-4 ">
           <div className="absolute top-1 right-3 ">
             {/* Like Skeleton */}
             <Skeleton
               sx={{ bgcolor: "grey.400" }}
               variant="circular"
               animation="pulse"
               width={30}
               height={30}
             />
           </div>

           <div className="hidden lg:flex lg:justify-center">
             {/* Add to Cart Skeleton */}
             <Skeleton
               sx={{ bgcolor: "grey.400" }}
               variant="rounded"
               animation="pulse"
               width={185}
               height={50}
             />
           </div>
           <div className=" absolute bottom-3 px-3 right-0  lg:hidden">
             {/* Add to Cart Skeleton */}
             <Skeleton
               sx={{ bgcolor: "grey.400" }}
               variant="rounded"
               animation="pulse"
               width={60}
               height={35}
             />
           </div>
         </div>
       </motion.div>
     </>
   );
};


