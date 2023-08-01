import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Dropdown from "../../widgets/components/dropdown";
import ActionButton from "../../widgets/components/actionButton";
import { categoryArray, itemsArray } from "../../data/data";
import "../styles/productOptions.css";

const optionsArray = [
  { key: "a0", label: "select an option" },
  { key: "a1", label: "option 1" },
  { key: "a2", label: "option 2" },
  { key: "a3", label: "option 3" },
  { key: "a4", label: "option 4" },
  { key: "a5", label: "option 5" },
  { key: "a6", label: "option 6" },
];

function ProductOptions(props) {

  const [activeOption1, setActiveOption1] = useState(optionsArray[0]);

  const [activeOption2, setActiveOption2] = useState(optionsArray[0]);

  const [activeOption3, setActiveOption3] = useState(optionsArray[0]);



  return (
    <div className={props.largeView? "product-options-yw2 large-view" : "product-options-yw2"}>
      <div className="product-options-ne9">
        <Dropdown optionsArray={optionsArray} activeOption={activeOption1} selectOption={setActiveOption1} />
      </div>
      <div className="product-options-ne9">
        <Dropdown optionsArray={optionsArray} activeOption={activeOption2} selectOption={setActiveOption2} />
      </div>
      <div className="product-options-ne9">
        <Dropdown optionsArray={optionsArray} activeOption={activeOption3} selectOption={setActiveOption3} />
      </div>
      <div className="product-options-ne9">
        <ActionButton message={"add to basket"} clickFunction={()=>props.setBasketModalActive(true)} large={true} />
      </div>
    </div>
  );
}

export default ProductOptions;
