import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import "../styles/basketButton.css";

function BasketButton(props) {





  return (


    <Link to="/shop-app/basket" className="basket-button-ja1">
    <span className="basket-button-gr4">
    1
    </span>
      <svg
        width="25px"
        height="25px"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12 4C10.4508 4 9.0799 5.00309 8.61115 6.47966L7.81104 9H8.49995H15.5H16.1889L15.3888 6.47966C14.92 5.00309 13.5491 4 12 4ZM18.2872 9L17.295 5.8745C16.5626 3.56734 14.4206 2 12 2C9.57933 2 7.43733 3.56734 6.7049 5.8745L5.71268 9H3.34789C2.00585 9 1.04464 10.2956 1.43384 11.58L2.55808 15.29L3.94596 19.87C4.32928 21.135 5.49529 22 6.81704 22H9.99995H14H17.1829C18.5046 22 19.6706 21.135 20.0539 19.87L21.4418 15.29L22.5661 11.58C22.9553 10.2956 21.9941 9 20.652 9H18.2872ZM6.4444 11H3.34789L4.25698 14H8.03615L7.62706 11H6.4444ZM9.64557 11L10.0547 14H13.9452L14.3543 11H9.64557ZM16.3728 11L15.9638 14H19.7429L20.652 11H17.5555H16.3728ZM19.1369 16H15.691L15.1456 20H17.1829C17.6235 20 18.0121 19.7117 18.1399 19.29L19.1369 16ZM13.1271 20L13.6725 16H10.3274L10.8728 20H13.1271ZM8.85434 20L8.30888 16H4.86304L5.86001 19.29C5.98778 19.7117 6.37646 20 6.81704 20H8.85434Z"
          fill="#000000"
        />
      </svg>
    </Link>

)


}

export default BasketButton;