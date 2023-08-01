import React, { useEffect, useRef, useState } from "react";
import "../styles/productDetails.css";


function ProductDescription(props) {

    return (
      <div className="product-options-cv2">
         <h2 className="product-details-zu7">Description</h2>
        {props.productObject.description.map((x) => (
        <p className="product-details-gf2">{x}</p>
      ))}
      {/*  <h2 className="product-details-zu7">Size Guide</h2>
        <div className="product-details-gw6">
        {props.productObject.sizeGuide.map((x) => (
        <div className="product-details-ds3">• {x.label} | {x.width}mm (W) x {x.height}mm (H) </div>
        ))}
        </div>
        <h2 className="product-details-zu7">Materials & Specifications</h2>
        <ul className="product-details-gw6">
        {props.productObject.specs.map((x) => (
        <li className="product-details-ds3">• {x} </li>
        ))}
        </ul> */}
      </div>
    );

  }


export default ProductDescription;
