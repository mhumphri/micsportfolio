import "../css/crossButton.css";

// delete button with cross svg

const crossButton = (clickFunction) => {

  return [

        <button aria-label="Clear Input" type="button" className="cross_button_10r" onClick={clickFunction} >

            <svg
              viewBox="0 0 32 32"
              xmlns="http://www.w3.org/2000/svg"
              className="cross_button_fa3"
              aria-hidden="true"
              role="presentation"
              focusable="false"
            >
              <path d="m6 6 20 20"></path>
              <path d="m26 6-20 20"></path>
            </svg>

        </button>

  ]

}

export default crossButton
