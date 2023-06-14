import React, { useState, useRef, useEffect } from "react";
import crossButton from "./crossButton";
import "../css/searchModal.css";

// modal which displays country options and also text input for filtering. Used in small view only. Performs same function as dropdown in large view. In contrast to dropdown the number of options can be limited to prevent scrolling and avoid a conflict with the soft keyboard when text input is active.

function SearchModal(props) {

  // css style for modal conatiner - changes due to animated open/close
  const [modalStyle, setModalStyle] = useState("search-modal-oje");
  // boolean which is true when text input is in focus
  const [textInputFocus, setTextInputFocus] = useState();
  // init refs for text input and scrolling options container - used to focus, blur etc
  const textInputRef = useRef(null);

  const closeModal = () => {
    // close modal
    setModalStyle("search-modal-1iw");
    // reset initial modal styles (after animation completes)
    setTimeout(() => {
      setModalStyle("search-modal-oje");
      props.closeModal();
    }, "400");
  };

  // deletes text input value and focuses text input when user inputs clicks on cross button
  const crossButtonHandler = () => {
    props.setLocationInputText("");
    textInputRef.current.focus();
  };

  return (
    <>
      <section>
        <div className="search-modal-j29">
          <div class={modalStyle}>
            <div className="search-modal-pa3">
              <button
                aria-label="Close search"
                type="button"
                className="search-modal-oda"
                onClick={closeModal}
              >
                <span className="search-modal-e29">
                  <svg
                    className="search-modal-ka0"
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

            <div className="search-modal-z4l">
              <header className="search-modal-sj7" />
              <section className="search-modal-po4">
                <h2 className="search-modal-we5">Select a location</h2>

                <form className="search-modal-f1w">
                  <label for="country-input-small" className="search-modal-1dr">
                    <div className="search-modal-vjv">
                      <svg
                        viewBox="0 0 32 32"
                        xmlns="http://www.w3.org/2000/svg"
                        className="search-modal-bw4"
                      >
                        <g fill="none">
                          <path d="m13 24c6.0751322 0 11-4.9248678 11-11 0-6.07513225-4.9248678-11-11-11-6.07513225 0-11 4.92486775-11 11 0 6.0751322 4.92486775 11 11 11zm8-3 9 9"></path>
                        </g>
                      </svg>
                    </div>
                    <input
                      id="country-input-small"
                      className="search-modal-1l1"
                      placeholder="Search locations"
                      autoComplete="off"
                      value={props.locationInputText}
                      onChange={props.textInputHandler}
                      ref={textInputRef}
                      onFocus={() => setTextInputFocus(true)}
                      onBlur={() => setTextInputFocus(false)}
                    />
                    {props.locationInputText.length > 0
                      ? crossButton(props.deleteInputText)
                      : null}
                  </label>
                </form>
              </section>

              <div className="search-modal-bz3">
                {props.popularLocationActive ? (
                  <div className="search-map-nav-de2">popular locations</div>
                ) : null}
                {props.searchResultArray.length > 0 ? (
                  props.searchResultArray.map((x) => (
                    <div
                      className="search-modal-uzo"
                      onClick={() => props.selectLocation(x)}
                    >
                      <div className="search-modal-bi8">
                        <svg
                          className="search-modal-zp3"
                          viewBox="0 0 32 32"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                          role="presentation"
                        >
                          <path d="m15.9999.33325c6.4433664 0 11.6667 5.22332687 11.6667 11.66665 0 .395185-.0196984.7942624-.0585936 1.1970109-.3656031 3.7857147-2.3760434 7.7525726-5.487905 11.7201691-1.1932825 1.5214248-2.4696691 2.9382012-3.7464266 4.2149447l-.264609.2625401-.2565836.2505683-.4871024.4643445-.3377669.3126669-.2592315.2338445-.7684829.6644749-.6531219-.5633124-.7123549-.6476755-.4871002-.4643445c-.1682693-.1630063-.3422204-.3341398-.5211901-.5131084-1.2767516-1.2767436-2.5531323-2.69352-3.74640918-4.2149449-3.11184685-3.9675963-5.12227757-7.9344539-5.48787896-11.7201677-.03889501-.4027484-.05859326-.8018256-.05859326-1.1970105 0-6.44329813 5.22335863-11.66665 11.66665-11.66665zm0 2c-5.3387224 0-9.66665 4.32792195-9.66665 9.66665 0 .3301812.01653349.665142.04933146 1.004757.32161647 3.3302606 2.17313947 6.9835713 5.07084634 10.6781398.9771881 1.2459122 2.0157692 2.4217661 3.0628871 3.5026159l.5240256.5323924.4974749.4897834.4621846.4404115.2257179-.2133444.4810251-.4660964.252726-.2507558c1.2232503-1.2232369 2.4468714-2.5814442 3.5869296-4.0350084 2.8977203-3.6945683 4.7492518-7.3478787 5.0708697-10.6781384.0327981-.3396149.0493317-.6745755.0493317-1.0047566 0-5.33875305-4.3279026-9.66665-9.6667-9.66665zm.0001 4.66675c2.7614237 0 5 2.23857625 5 5 0 2.7614237-2.2385763 5-5 5s-5-2.2385763-5-5c0-2.76142375 2.2385763-5 5-5zm0 2c-1.6568542 0-3 1.3431458-3 3s1.3431458 3 3 3 3-1.3431458 3-3-1.3431458-3-3-3z"></path>
                        </svg>
                      </div>
                      <div className="search-modal-182">{x.name}</div>
                    </div>
                  ))
                ) : (
                  <div className="search-modal-jp4">
                    <div className="search-modal-ha1">no matches</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default SearchModal;
