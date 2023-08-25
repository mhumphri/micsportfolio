import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ActionButton from "../../widgets/components/actionButton";
import "../styles/basketModal.css";

// modal which appears when a link to a hotel is clicked (in place of navigating to the page for the hotel)

function BasketModal(props) {
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
          <div className="link-modal-lw2">1 item added to basket</div>
        </header>
        <div className="basket-modal-rt6">
        <svg className="basket-modal-vr3" width="70px" height="70px" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><path style={{fill: "#699f4c", fillRule: "evenodd"}} d="M800,510a30,30,0,1,1,30-30A30,30,0,0,1,800,510Zm-16.986-23.235a3.484,3.484,0,0,1,0-4.9l1.766-1.756a3.185,3.185,0,0,1,4.574.051l3.12,3.237a1.592,1.592,0,0,0,2.311,0l15.9-16.39a3.187,3.187,0,0,1,4.6-.027L817,468.714a3.482,3.482,0,0,1,0,4.846l-21.109,21.451a3.185,3.185,0,0,1-4.552.03Z" id="check" transform="translate(-770 -450)"/></svg>
        <div className="basket-modal-fd2">
          <div className="basket-modal-fd3">
        <ActionButton message={"Go to basket"} clickFunction={navigateToBasket} focusable={true} />
        </div>

        <ActionButton message={"Continue shopping"} borderOnly={true} clickFunction={closeModal} focusable={true} />
        </div>

        </div>
        </div>
        </div>
      </div>
    </div>
  );
}

export default BasketModal;
