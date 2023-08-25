import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Header from "../../header/components/header";
import Footer from "../../footer/components/footer";
import ImageGallery from "./imageGallery";
import ProductSummary from "./productSummary";
import ProductOptions from "./productOptions";
import ProductDescription from "./productDescription";
import ProductSpecs from "./productSpecs";
import BasketModal from "../../modals/components/basketModal";
import "../styles/productPage.css";

const imageArray = [
  "https://i.etsystatic.com/34623276/c/2303/1831/246/127/il/db2bf5/4065269795/il_340x270.4065269795_928b.jpg",
  "https://i.etsystatic.com/34623276/r/il/00c18a/4001235760/il_340x270.4001235760_5geo.jpg",
  "https://i.etsystatic.com/34623276/c/1460/1160/518/305/il/280f35/4712976233/il_340x270.4712976233_rqiy.jpg",
  "https://i.etsystatic.com/34623276/c/2303/1831/295/0/il/ba03cc/4143720129/il_340x270.4143720129_9f19.jpg",
  "https://i.etsystatic.com/34623276/c/2752/2187/199/0/il/a4219d/4887108173/il_340x270.4887108173_59qr.jpg",
];

const productObject = {
  summary:
    "Star mark stickers in dots and squares for planners and journals, matte transparent functional stickers, icon stickers, multi colours, UK",
  description: [
    "Star mark stickers in dots and squares for planners and journals, matte transparent functional stickers, icon stickers, multi colours, UK",
    "Star mark stickers in dots and squares for planners and journals, matte transparent functional stickers, icon stickers, multi colours, UK",
    "Star mark stickers in dots and squares for planners and journals, matte transparent functional stickers, icon stickers, multi colours, UK",
  ],
  sizeGuide: [
    { label: "Small size", height: 105, width: 150 },
    { label: "Medium size", height: 105, width: 150 },
    { label: "Large size", height: 105, width: 150 },
  ],
  specs: [
    "hghghg mnmnmn mnmnm hkhkhkh",
    "hghgh popopo iuiuiuiu",
    "hghghg mnmnmn mnmnm hkhkhkh",
    "hghgh popopo iuiuiuiu",
    "hghghg mnmnmn mnmnm hkhkhkh",
    "hghgh popopo iuiuiuiu",
  ],
};

function ProductPage(props) {
  // viewport width (stored in redux)
  const screenWidth = useSelector((state) => state.deviceData.screenWidth);

  const [basketModalActive, setBasketModalActive] = useState();

    return (
      <>
      {screenWidth < 650 ?

      (<>
        <Header productPage={true} />
        <main className="shop-app-tr2">
          <ImageGallery images={imageArray} />
          <div className="shop-app-te2">
            <ProductSummary />
            <ProductOptions setBasketModalActive={setBasketModalActive}  />
            <ProductSpecs productObject={productObject} />
            <ProductDescription productObject={productObject} />
          </div>
        </main>
        <Footer />
      </>
  ):
      (<>
        <Header productPage={true} largeView={true} />
        <main className="shop-app-te2 large-view">
          <ImageGallery largeView={true} images={imageArray} />
          <div className="product-page-rt3">
            <div className="product-page-io7"><ProductSummary /><ProductSpecs productObject={productObject} /><ProductDescription productObject={productObject} /></div>
            <div className="product-page-io8"><ProductOptions largeView={true} setBasketModalActive={setBasketModalActive} /></div>
          </div>
        </main>
        {/* <Footer /> */}

      </>)
    }
    { basketModalActive ?
    <BasketModal setBasketModalActive={setBasketModalActive} /> : null
    }
    </>

)
}

export default ProductPage;
