import React, { useState, useRef } from "react";
import CurrencyModal from "../../modals/components/currencyModal";
import "../styles/currencyButton.css";

function CurrencyButton(props) {

  // boolean controlling state of remove item modal
  const [currencyModalActive, setCurrencyModalActive] = useState();

const openCurrencyModal = () => {
  console.log("openCurrencyModal")
  setCurrencyModalActive(true)
}


  return (

<>
    <button className="currency-button-hd4" onClick={openCurrencyModal}>
      <span className="currency-button-bd6">£(GBP)</span>
    </button>
    {currencyModalActive ? <CurrencyModal setModalActive={setCurrencyModalActive} /> : null}
    </>

)


}

export default CurrencyButton;
