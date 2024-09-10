import { Skeleton } from '@mui/material';
import React from 'react'
import { Link } from 'react-router-dom';
import { Message } from '../../Dashboard/Message/Message';
import { motion } from 'framer-motion';
import { ArrowBackIosOutlined } from "@mui/icons-material";
import { LocalShippingOutlined } from "@mui/icons-material";
import AddressContainer from './AddressContainer';

const CheckoutAddressesLayout = ({
  addresses,
  showForm,
  setShowForm,
  isLoadingComponent,
  isNotificationVisible,
  modify,
  setModify,
  sortedAddresses,
  selectedId,
  activeModify,
  submitAddress,
  addressSubmitTitle,
  showFormRef,
  isDefaultBilling,
  isDefaultShipping,
  handleRadioChange,
}) => {
  return (
    <>
      <div>
        {/*  if there aren't addresses in array */}
        {!addresses.length && !showForm && (
          <>
            <div className=" flex flex-col  leading-relaxed h-32 w-full ">
              <div className="flex flex-col gap-1 w-full flex-wrap">
                {isLoadingComponent ? (
                  <Skeleton
                    variant="text"
                    sx={{ fontSize: "1rem" }}
                    width={280}
                  />
                ) : (
                  <span className="text-sm">
                    Currently, you have no address.
                  </span>
                )}
                {isLoadingComponent ? (
                  <Skeleton
                    variant="text"
                    sx={{ fontSize: "1rem" }}
                    width={280}
                  />
                ) : (
                  <span className="text-sm lg:text-sm">
                    You can create a new one by clicking below.
                  </span>
                )}
                {isLoadingComponent ? (
                  <Skeleton
                    variant="rounded"
                    width={280}
                    sx={{ marginTop: "0.75rem", marginBottom: "1rem" }}
                    height={45}
                  />
                ) : (
                  <>
                    <>
                      <Link
                        /* onClick={showForm} */
                        to="/delivery/address-book/add"
                        className=" uppercase my-3 flex h-12 w-full md:w-72 items-center justify-center rounded-md bg-primary-btn  p-2 font-semibold hover:bg-primary-hover"
                      >
                        Add New Address
                      </Link>
                    </>
                  </>
                )}
              </div>
            </div>
          </>
        )}

        {isNotificationVisible && (
          <div className="mb-4">
            <Message />
          </div>
        )}
        <div className="relative">
          {modify
            ? 
              sortedAddresses &&
              !showForm && (
                <div>
                  <h4 className="text-sm">
                    Please select the desired address from the available options
                    below.
                  </h4>
                  {sortedAddresses.map((address, index) => (
                    <motion.div
                      key={address.id}
                      whileTap={{ scale: 0.95 }}
                      className="my-4 p-4  border  hover:border-slate-400 hover:border-2 border-slate-300 shadow-sm"
                    >
                      <div className="flex items-center gap-6">
                        <div className=" inline-block w-full relative cursor-pointer">
                          <label
                            htmlFor={address.id}
                            className={`grid w-full min-w-full gap-1 pl-10 relative text-base cursor-pointer transition-all duration-300`}
                          >
                            <input
                              type="radio"
                              value={address.id}
                              id={address.id}
                              name={address.id}
                              onChange={(e) => handleRadioChange(e, address.id)}
                              checked={selectedId === address.id}
                              className={` absolute  peer cursor-pointer opacity-0 w-0 h-0 `}
                            />

                            <ul className="flex max-w-full text-sm lg:text-base flex-col flex-wrap gap-2">
                              <li>{address.firstName}</li>
                              <li>{address.lastName}</li>
                              <li>{address.phone}</li>
                              {address.newAddress.address.length > 0 ? (
                                <li>{address.fullAddress}</li>
                              ) : (
                                <li className="w-full">{address.location}</li>
                              )}
                            </ul>

                            {address.defaultShipping && (
                              <div className="my-5 flex w-full  flex-col gap-5">
                                <span className="flex items-center text-sm text-slate-500 gap-2">
                                  This is your default shipping address.{" "}
                                  <span className="hidden md:block">
                                    <LocalShippingOutlined />
                                  </span>
                                </span>
                              </div>
                            )}

                            <span
                              className={` peer-checked:peer-hover:scale-90 peer-checked:transform peer-checked:-translate-y-1/2 peer-checked:border-4 peer-checked:border-primary-btn peer-checked:scale-90
                          peer-hover:transform peer-hover:-translate-y-1/2 peer-hover:scale-125  peer-hover:border-primary-btn peer-hover:shadow-custom              
                          absolute top-1/2 left-0 transform -translate-y-1/2 w-5 h-5 rounded-[50%]  border-2 border-slate-600 transition-all`}
                              aria-checked={
                                selectedId === address.id ? "true" : "false"
                              }
                              /* aria-label={address.name} */
                            ></span>
                          </label>
                        </div>
                      </div>
                      {selectedId === address.id && (
                        <>
                          <div className="flex mt-6 justify-center">
                            <motion.button
                              role="button"
                              aria-label={addressSubmitTitle}
                              whileTap={{ scale: 0.95 }}
                              type="submit"
                              title={addressSubmitTitle}
                              onClick={() => submitAddress(selectedId)}
                              className=" flex h-11 w-full md:w-72 items-center justify-center rounded-md bg-primary-btn  p-2  hover:bg-primary-hover"
                            >
                              {addressSubmitTitle}
                            </motion.button>
                          </div>
                          <div className="flex justify-center">
                            <Link
                              onClick={activeModify}
                              to={`/delivery/address-book/edit/${address.id}`}
                              className=" my-3 flex h-11 w-full md:w-72 items-center justify-center border border-slate-400 rounded-md bg-slate-200  p-2  hover:bg-slate-300"
                            >
                              Edit this address
                            </Link>
                          </div>
                        </>
                      )}
                    </motion.div>
                  ))}
                  {!showForm && (
                    <>
                      <div className="flex justify-center">
                        <Link
                          to={`/delivery/address-book/add`}
                          className=" my-3 uppercase font-semibold flex h-11 w-full md:w-72 items-center justify-center border border-slate-400 rounded-md bg-slate-200  p-2  hover:bg-slate-300"
                        >
                          Add New Address
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              )
            : // If `modify` is false, show only the first address if `sortedAddresses` exists
              sortedAddresses &&
              sortedAddresses.length > 0 &&
              sortedAddresses[0].id && (
                <div className="flex flex-col md:flex-row md:justify-between">
                  <div>
                    <AddressContainer
                      key={sortedAddresses[0].id}
                      addressesWithDefaultShipping={[sortedAddresses[0]]}
                      isDefaultBilling={isDefaultBilling}
                      isDefaultShipping={isDefaultShipping}
                      loading={isLoadingComponent}
                    />
                  </div>
                  <div>
                    {!modify && !isLoadingComponent && (
                      <>
                        <motion.button
                          aria-label="Modify Address"
                          role="button"
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setModify(true)}
                          className=" flex p-2 w-full border border-slate-400 md:border-none md:w-[7rem] md:mr-4 font-semibold h-10 md:h-8 justify-center items-center hover:bg-slate-400 bg-slate-300 overflow-hidden tracking-wide text-base rounded-lg"
                        >
                          Modify
                        </motion.button>
                      </>
                    )}
                  </div>
                </div>
              )}
        </div>

        {showForm && (
          <div ref={showFormRef} className="relative">
            <motion.button
              whileTap={{ scale: 0.95 }}
              role="button"
              aria-label="Cancel Address"
              onClick={() => setShowForm(false)}
              className="hidden md:flex absolute left-4 top-6  items-center gap-1 text-sm md:left-auto md:right-9 md:top-2 rounded-full hover:bg-slate-200 p-2"
            >
              <ArrowBackIosOutlined fontSize="small" />
              Cancel
            </motion.button>
          </div>
        )}
      </div>
    </>
  );
};

export default CheckoutAddressesLayout
