import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slice/Authslice";
import walletReducer from "../slice/Walletslice";
import assetReducer from "../slice/Assetslice";
import transactionReducer from "../slice/Transactionslice";
import portfolioReducer from "../slice/Portfolioslice";
import priceReducer from "../slice/Priceslice";
import sipReducer from "../slice/Sipslice";
import adminReducer from "../slice/Adminslice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    wallet: walletReducer,
    asset: assetReducer,
    transaction: transactionReducer,
    portfolio: portfolioReducer,
    price: priceReducer,
    sip: sipReducer,
    admin: adminReducer,
  },
});

export default store;