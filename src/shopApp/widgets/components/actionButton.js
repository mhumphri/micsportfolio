import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/actionButton.css";

function ActionButton(props) {

  // boolean which indicates if loading spinner is active
  const [spinner, setSpinner] = useState();
  // contains css style - used to control style if / when button is active
  const [buttonStyle, setButtonStyle] = useState(props.focusable ? "action-button-qq7 action-button-rt5" :"action-button-qq7");
  // ref for button - used to controls
  const buttonRef = useRef(null)
  // hook for navigate fuction from react router - use to navigate whilst retaining redux state
  const navigate = useNavigate();



  // handles button click inc loader spinner controls
  const clickHandler = (e) => {
    e.preventDefault();
    document.activeElement.blur()
    if (props.loader) {
      console.log("clickHandlerLoader");
      setSpinner(true);
      setTimeout(() => {
        setSpinner(false);
        props.clickFunction();
      }, "1500");
    }
    else if (props.navigate) {
      console.log("navigate: " + props.navigate)
      navigate(props.navigate);
    }
    else {
      console.log("clickHandler");
      props.clickFunction();
    }
  };


  // handles mouse enter event - disables active styling
  const mouseEnterHandler = (e) => {
    if (props.focusable && document.activeElement!==buttonRef.current) {
      setButtonStyle("action-button-qq7")
    }
    console.log("mouseEnterHandler")
  }

  // handles mouse enter event - enables active styling
  const mouseLeaveHandler = (e) => {
    if (props.focusable) {
      setButtonStyle("action-button-qq7 action-button-rt5")
    }
    console.log("mouseExitHandler")
  }



  return (
    <button
      ref={buttonRef}
      type="button"
      className={buttonStyle}
      onClick={clickHandler}
      onMouseEnter={mouseEnterHandler}
      onMouseLeave={mouseLeaveHandler}
    >
    {props.loader ? (
      <>
      <div className={spinner ? "spinner" : "spinner hidden"} />
      <span
        className={spinner ? "action-button-sk9 hidden" : "action-button-sk9"}
      >
        {props.message}
      </span>
      </>
    ) :
    (
      <span className="action-button-sk9">{props.message}</span>
    )}
    </button>
)


}

export default ActionButton;
