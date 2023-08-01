import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Header from "../../header/components/header";
import Banner from "./banner";
import ProductSearch from "./productSearch";
import Footer from "../../footer/components/footer";
import { categoryArray, itemsArray } from "./data";
import "../styles/searchPage.css";

function SearchPage() {
  // viewport width (stored in redux)
  const screenWidth = useSelector((state) => state.deviceData.screenWidth);

  if (screenWidth < 900) {
    return (
      <>
        <Header />
        <main className="search-page-tr2">
          <Banner />
          <ProductSearch />
        </main>
        <Footer />
      </>
    );
  } else {
    return (
      <>
        <Header largeView={true} />
        <main>
          <Banner largeView={true} />
          <ProductSearch largeView={true} />
        </main>
        <Footer />
      </>
    );
  }
}

export default SearchPage;
