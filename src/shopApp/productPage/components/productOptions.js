import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Dropdown from "../../widgets/components/dropdown";
import ActionButton from "../../widgets/components/actionButton";
import { categoryArray, itemsArray } from "../../data/data";
import "../styles/productOptions.css";

const optionsArray = [
  { value: "a0", label: "select an option" },
  { value: "a1", label: "option 1" },
  { value: "a2", label: "option 2" },
  { value: "a3", label: "option 3" },
  { value: "a4", label: "option 4" },
  { value: "a5", label: "option 5" },
  { value: "a6", label: "option 6" },
];

const quantityArray = [
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "4", label: "4" },
  { value: "5", label: "5" },
  { value: "6", label: "6" },
  { value: "7", label: "7" },
];

function ProductOptions(props) {

  const [activeOption1, setActiveOption1] = useState(optionsArray[0]);

  const [activeOption2, setActiveOption2] = useState(optionsArray[0]);

  const [activeOption3, setActiveOption3] = useState(optionsArray[0]);



  return (
    <div className={props.largeView? "product-options-yw2 large-view" : "product-options-yw2"}>
      <div className="product-options-ne9">
        <Dropdown optionsArray={optionsArray} activeOption={activeOption1} selectOption={setActiveOption1} label="label1" required={true} warningMsg="error message 1" warning={true}/>
      </div>
      <div className="product-options-ne9">
        <Dropdown optionsArray={optionsArray} activeOption={activeOption2} selectOption={setActiveOption2} label="label1" required={true} warningMsg="error message 2" warning={true}/>
      </div>
      <div className="product-options-ne9">
        <Dropdown optionsArray={quantityArray} activeOption={activeOption3} selectOption={setActiveOption3} label="quantity" required={false} warningMsg="error message 3" warning={false}/>
      </div>
      {props.editItems ? (<div className="product-options-wy9">
        <div className="basket-modal-fd3">
        <ActionButton message={"update item"} clickFunction={()=>props.setBasketModalActive(true)} focusable={true} />
          </div>
          <ActionButton message={"return to basket"} secondary={true} clickFunction={()=>props.setBasketModalActive(true)} focusable={true} />
      </div>) : (<div className="product-options-ne9">
        <ActionButton message={"add to basket"} clickFunction={()=>props.setBasketModalActive(true)} focusable={true} />

      </div>) }
    </div>
  );
}

export default ProductOptions;
