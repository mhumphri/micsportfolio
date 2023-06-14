import React, { useState, useRef } from "react";
import SliderButton from "./sliderButton";
import "../css/rangeSlider.css";

// range slider with resticted units (e.g. only 10,20, 30... can be selected by the user)

function DiscreetSlider(props) {


  // stores position of slider button (scale 0  to 100)
  const [buttonPos, setButtonPos] = useState(50);

  // ref for slider track
  const sliderTrack = useRef(null);

  // drag event listener (sets button position on load)
  const handleButton = (e) => {
    const trackPosition = sliderTrack.current.getBoundingClientRect();
    // calcs new button position (resulting from pointer down) on track as % (0%=LHS bound and 100%=RHS bound)
    let newButtonPos = ((e.clientX - trackPosition.left) / trackPosition.width) * 100;
    setButtonPos(Math.round(newButtonPos / 10) * 10);
    window.addEventListener("pointermove", handleDrag);
    props.setDiscreteDrag(true);
    window.addEventListener("pointerup", () => {
      props.setDiscreteDrag(false);
      window.removeEventListener("pointermove", handleDrag);
    });
  };

  // updates buttonPos in response to drag of slider button
  const handleDrag = (e) => {
    const trackPosition = sliderTrack.current.getBoundingClientRect();
    // calcs new button position (resulting from drag) on track as % (0%=LHS bound and 100%=RHS bound)
    let newButtonPos = ((e.clientX - trackPosition.left) / trackPosition.width) * 100;
    // if new button position is less than 0% (i.e. off the LHS of the track), button position state is set to 0
    if (newButtonPos < 0) {
      setButtonPos(0);
      // if new button position is greater than than 100% (i.e. off the RHS of the track), button position state is set to 100
    } else if (newButtonPos > 100) {
      setButtonPos(100);
      // otherwise button position state is set to nearest multiple of 10 (permitted unit for discrete steps)
    } else {
      setButtonPos(Math.round(newButtonPos / 10) * 10);
    }
  };

  return (
    <div className="rangeslider-hc7">
      <div>
        <div className="rangeslider-jn7">
          <div className="rangeslider-ty3 wide" ref={sliderTrack} />
          <div
            className="rangeslider-vs7 wide"
            style={{ left: "0%", width: buttonPos + "%" }}
          ></div>

          {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((x) => (
            <div
              style={{ left: x + "%" }}
              className={
                buttonPos < x ? "rangeslider-hn2" : "rangeslider-hn2 on"
              }
            />
          ))}

          <div className="rangeslider-af3" onPointerDown={handleButton}>
            <SliderButton
              buttonPos={buttonPos}
              handleDrag={handleDrag}
              buttonDrag={props.discreteDrag}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DiscreetSlider;
