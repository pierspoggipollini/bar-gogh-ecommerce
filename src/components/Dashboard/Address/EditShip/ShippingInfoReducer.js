export const INITIAL_STATE = {
  loading: false,
  shippingInfo: [],
  error: false,
};

export const shippingInfoReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_SHIPPING_INFO_REQUEST":
      return {
        ...state,
        loading: true,
      };
    case "FETCH_SHIPPING_INFO_SUCCESS":
      return {
        ...state,
        loading: false,
        shippingInfo: [action.payload],
      };
    case "FETCH_SHIPPING_INFO_FAILURE":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
