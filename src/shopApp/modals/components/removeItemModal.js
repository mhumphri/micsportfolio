import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ActionButton from "../../widgets/components/actionButton";
import "../styles/basketModal.css";

// modal which appears when a link to a hotel is clicked (in place of navigating to the page for the hotel)

function RemoveItemModal(props) {
  // modal backdrop CSS style - changes for animation
  const [backdropStyle, setBackdropStyle] = useState("link-modal-jr6");
  // modal outer container CSS setMapStyle - changes for animation
  const [modalStyle, setModalStyle] = useState("link-modal-pq2");
  // hook for navigate fuction from react router - use to navigate whilst retaining redux state
  const navigate = useNavigate();

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

  // click event listener which closes dropdown menu if user clicks outside searchnav / dropdown list (large view only)
  useEffect(() => {
    const handleKeyDown = (e) => {
      console.log("KEY DOWN!!: " + e.code)
      console.log("document.activeElement: " + document.activeElement )
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  });


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
      props.setBasketModalActive(false);
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
          <div className="link-modal-lw2">remove item from basket?</div>
        </header>
        <div className="basket-modal-rt6">
        <svg className="basket-modal-vr3" width="70px" height="70px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="style=linear">
        <g id="warning-circle">
        <path id="vector" d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="red" stroke-width="1.5"/>
        <path id="vector_2" d="M12 7V14.1047" stroke="#000000" stroke-width="1.5" stroke-linecap="round"/>
        <path id="ellipse" d="M12 17H12.01" stroke="#000000" stroke-width="2" stroke-linecap="round"/>
        </g>
        </g>
        </svg>
        <div className="basket-modal-fd2">
          <div className="basket-modal-fd3">
        <ActionButton message={"Remove item"} clickFunction={navigateToBasket} focusable={true} />
        </div>

        <ActionButton message={"Keep item"} borderOnly={true} clickFunction={closeModal} focusable={true} />
        </div>

        </div>
        </div>
        </div>
      </div>
    </div>
  );
}

export default RemoveItemModal;
