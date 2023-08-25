import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Dropdown from "../../widgets/components/dropdown";
import ActionButton from "../../widgets/components/actionButton";
import ProductOptions from "../../productPage/components/productOptions";
import "../styles/basketModal.css";

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

function CurrencyModal(props) {
  // modal backdrop CSS style - changes for animation
  const [backdropStyle, setBackdropStyle] = useState("link-modal-jr6");
  // modal outer container CSS setMapStyle - changes for animation
  const [modalStyle, setModalStyle] = useState("link-modal-pq2");
  // hook for navigate fuction from react router - use to navigate whilst retaining redux state
  const navigate = useNavigate();

  const [activeOption1, setActiveOption1] = useState(optionsArray[0]);

  const [activeOption2, setActiveOption2] = useState(optionsArray[0]);

  const [activeOption3, setActiveOption3] = useState(optionsArray[0]);

  const navigateToBasket = () => {
    document.body.style.overflow = "auto";
    document.body.style.position = "static";
    navigate("../basket");
  }

  // disables scrolling when the modal opens (component loads)
  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.body.style.position = "relative";
  }, []);





  const closeModal = () => {
    // close modal
    setBackdropStyle("link-modal-bm0");
    setModalStyle("link-modal-lf8");

    // reset initial modal styles (after animation completes)
    setTimeout(() => {
      setBackdropStyle("link-modal-jr6");
      setModalStyle("link-modal-pq2");
      // enables scrolling when modal is closed
      document.body.style.overflow = "auto";
      document.body.style.position = "static";
      props.setModalActive(false);
    }, "400");
  };

  return (
    <div>
      <div className={backdropStyle}></div>
      <div onClick={closeModal} className="link-modal-ke7">
        <div className={modalStyle} onClick={(e) => e.stopPropagation()}>
        <div className="link-modal-pa3">
          <button
            aria-label="Close"
            type="button"
            className="link-modal-oda"
            onClick={closeModal}
          >
            <span className="link-modal-e29">
              <svg
                className="link-modal-ka0"
                viewBox="0 0 32 32"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                role="presentation"
                focusable="false"
              >
                <path d="m6 6 20 20"></path>
                <path d="m26 6-20 20"></path>
              </svg>
            </span>
          </button>
        </div>
        <div className="link-modal-z4l">
        <header className="link-modal-sj7">
          <div className="link-modal-lw2">choose currency</div>
        </header>
        <div className="currency-modal-pw2">
<Dropdown optionsArray={optionsArray} activeOption={activeOption2} selectOption={setActiveOption2} label="Currency" required={true} />
<div className="currency-modal-fd3">
<ActionButton message={"Go to basket"} clickFunction={navigateToBasket} focusable={true} />
</div>

<ActionButton message={"Continue shopping"} borderOnly={true} clickFunction={closeModal} focusable={true} />
        </div>
        </div>
        </div>
      </div>
    </div>
  );
}

export default CurrencyModal;
