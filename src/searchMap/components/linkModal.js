import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateMainModal } from "../../redux/modals/modalsSlice";
import itemArray from "../../data/itemArray";
import "../css/linkModal.css";

function LinkModal(props) {
  const [backdropStyle, setBackdropStyle] = useState("link-modal-jr6");
  const [modalStyle, setModalStyle] = useState("link-modal-pq2");

  const closeModal = () => {
    // close modal
    setBackdropStyle("link-modal-bm0");
    setModalStyle("link-modal-lf8");

// reset initial modal styles (after animation completes)
    setTimeout(() => {
      setBackdropStyle("link-modal-jr6");
      setModalStyle("link-modal-pq2");
      props.setActiveLink(false);
    }, "400");

  };

  return (
    <div>
      <div className={backdropStyle}></div>
      <div onClick={closeModal} className="link-modal-ke7">
        <div
          className={modalStyle}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="link-modal-pa3">
            <button
              aria-label="Close"
              type="button"
              class="link-modal-oda"
              onClick={closeModal}
            >
              <span class="link-modal-e29">
                <svg
                  class="link-modal-ka0"
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

          <div class="link-modal-z4l">
            <header className="link-modal-sj7">
              <div className="link-modal-lw2">link clicked</div>
            </header>
            <div class="link-modal-hs6">link to {props.activeLink}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LinkModal;
