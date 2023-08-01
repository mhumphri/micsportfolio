import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import SearchPage from "./searchPage/components/searchPage";
import ProductPage from "./productPage/components/productPage";
import Basket from "./basket/components/basket";
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
      path="/product/:productID"
      element={<ProductPage />}
    />




  </Routes>
  </>


)

}

export default ShopApp;
