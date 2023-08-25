import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import SearchPage from "./searchPage/components/searchPage";
import ProductPage from "./productPage/components/productPage";
import Basket from "./basket/components/basket";
import AddressForm from "./checkout/components/addressForm";
import PaymentForm from "./checkout/components/paymentForm";
import "./shopApp.css";


function ShopApp() {


return (
<>
  <Routes>


    <Route
      path="/"
      element={<SearchPage />}
    />
    <Route
      path="/basket"
      element={<Basket />}
    />
    <Route
      path="/address-form"
      element={<AddressForm />}
    />
    <Route
      path="/payment-form"
      element={<PaymentForm />}
    />
    <Route
      path="/product/:productID"
      element={<ProductPage />}
    />




  </Routes>
  </>


)

}

export default ShopApp;
