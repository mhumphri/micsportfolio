import React, { useState, useEffect, useRef } from "react";
import SliderButton from "./sliderButton";
import "../css/rangeSlider.css";

// simple range slider

function SimpleSlider(props) {
  // stores screen position of slider track
  const [trackPosition, setTrackPosition] = useState();

  // stores position of slider button (scale 0  to 100)
  const [buttonPos, setButtonPos] = useState(props.sliderPositionInit ? props.sliderPositionInit : 0);

  // ref for slider track
  const sliderTrack = useRef(null);

  // initialses trackPosition on load and updates at screen resize events
  useEffect(() => {
    setTrackPosition(sliderTrack.current.getBoundingClientRect());
    window.addEventListener("resize", () => {
      setTrackPosition(sliderTrack.current.getBoundingClientRect());
    });
    return () => {
      window.removeEventListener("resize", () => {
        setTrackPosition(sliderTrack.current.getBoundingClientRect());
      });
    };
  }, []);

  // drag event listener (sets button position on load)
  const handleButton = (e) => {
    let newButtonPos =
      ((e.clientX - trackPosition.left) / trackPosition.width) * 100;
    setButtonPos(newButtonPos);
    if (props.updateSliderPosition) {
      props.updateSliderPosition(newButtonPos);
    }
    window.addEventListener("pointermove", handleDrag);
    props.setSimpleDrag(true);
    window.addEventListener("pointerup", () => {
      props.setSimpleDrag(false);
      window.removeEventListener("pointermove", handleDrag);
    });
  };

  // updates buttonPos in response to drag of slider button
  const handleDrag = (e) => {
    // calcs new button position (resulting from drag) on track as % (0%=LHS bound and 100%=RHS bound)
    let newButtonPos =
      ((e.clientX - trackPosition.left) / trackPosition.width) * 100;
      // if new button position is less than 0% (i.e. off the LHS of the track), button position state is set to 0
    if (newButtonPos < 1) {
      newButtonPos = 0;
    }
    // if new button position is greater than than 100% (i.e. off the RHS of the track), button position state is set to 100
    else if (newButtonPos > 100) {
      newButtonPos = 100;
    }
    // otherwise button position state is set at current position on screen
    setButtonPos(newButtonPos);
    if (props.updateSliderPosition) {
      props.updateSliderPosition(newButtonPos);
    }
  };

  return (
    <div class={props.smallMargins ? "rangeslider-hc7 small-margins" : "rangeslider-hc7"}>
      <div>
        <div className="rangeslider-jn7">
          <div className="rangeslider-ty3" ref={sliderTrack}></div>

          <div
            className="rangeslider-vs7"
            style={{ left: "0%", width: buttonPos + "%" }}
          ></div>
          <div className="rangeslider-af3" onPointerDown={handleButton}>
            <SliderButton
              buttonPos={buttonPos}
              handleDrag={handleDrag}
              buttonDrag={props.simpleDrag}
              labelDisabled={props.labelDisabled}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SimpleSlider;
