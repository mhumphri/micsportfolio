import React, { useState, useRef } from "react";
import CurrencyModal from "../../modals/components/currencyModal";
import "../styles/contactButton.css";

function ContactButton(props) {


  // boolean controlling state of remove item modal
  const [currencyModalActive, setCurrencyModalActive] = useState();

const openCurrencyModal = () => {
  console.log("openCurrencyModal")
  setCurrencyModalActive(true)
}


  return (
    <>
    <button className="contact-button-hd4" onClick={openCurrencyModal}>
    <svg width="25px" height="25px" viewBox="0 0 24 21" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill="white" fill-rule="evenodd" clip-rule="evenodd" d="M3.75 5.25L3 6V18L3.75 18.75H20.25L21 18V6L20.25 5.25H3.75ZM4.5 7.6955V17.25H19.5V7.69525L11.9999 14.5136L4.5 7.6955ZM18.3099 6.75H5.68986L11.9999 12.4864L18.3099 6.75Z" fill="#080341"/>
</svg>
      <span className="contact-button-bd6">contact us</span>
    </button>
    {currencyModalActive ? <CurrencyModal setModalActive={setCurrencyModalActive} /> : null}
</>

)


}

export default ContactButton;
