import React, { useState } from "react";
import "../styles/actionButton.css";;

function ActionButton(props) {
  const [spinner, setSpinner] = useState();

  const clickHandler = () => {
    console.log("clickHandler");
    props.clickFunction();
  };

  const clickHandlerLoader = () => {
    console.log("clickHandlerLoader");
    setSpinner(true);
    setTimeout(() => {
      setSpinner(false);
      props.clickFunction();

    }, "1500");
  };

  if (props.loader) {
    return (
      <button
        type="button"
        className={props.narrow ? "action-button-qq7 narrow" : "action-button-qq7"}
        onClick={clickHandlerLoader}
      >
        <div className={spinner ? "spinner" : "spinner hidden"} />
        <span
          className={spinner ? "action-button-sk9 hidden" : "action-button-sk9"}
        >
          {props.message}
        </span>
      </button>
    );
  }
  else if (props.large) {
    return (
      <button type="button" className="action-button-qq7 large" onClick={clickHandler}>
        <span className="action-button-sk9">{props.message}</span>
      </button>
    );
  }
  else if (props.borderOnly) {
    return (
      <button type="button" className="action-button-qq7 border-only" onClick={clickHandler}>
        <span className="action-button-sk9">{props.message}</span>
      </button>
    );
  }
  else {
    return (
      <button type="button" className="action-button-qq7" onClick={clickHandler}>
        <span className="action-button-sk9">{props.message}</span>
      </button>
    );
  }
}

export default ActionButton;
