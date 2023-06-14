import React, { useState, useEffect, useRef } from "react";
import SliderButton from "./sliderButton";
import "../css/rangeSlider.css";

// range slider portfolio item

function TwoHandleSlider(props) {

  // stores screen position of slider track
  const [trackPosition, setTrackPosition] = useState();

  // stores position of left and right slider buttons (scale 0  to 100)
  const [leftButtonPos, setLeftButtonPos] = useState(1);
  const [rightButtonPos, setRightButtonPos] = useState(100);

  // strores position of active section of slider track
  const [activeRangeLeft, setActiveRangeLeft] = useState(leftButtonPos);
  const [activeRangeWidth, setActiveRangeWidth] = useState(
    rightButtonPos - leftButtonPos
  );

  // ref for slider track
  const sliderTrack = useRef(null);

  // initialses initialses trackPosition on load and updates at screen resize events
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

  // sets & removes pointermove event listener when slider button is dragged
  const handlePointerDown = (e) => {
    console.log("E: " + e);
    let newButtonPos =
      ((e.clientX - trackPosition.left) / trackPosition.width) * 100;
      if (newButtonPos<0) {
        newButtonPos=0
      }
      else if (newButtonPos>100) {
        newButtonPos=100
      }
    const leftDistance = Math.abs(newButtonPos - leftButtonPos);
    const rightDistance = Math.abs(newButtonPos - rightButtonPos);

    if (leftDistance > rightDistance) {
      setRightButtonPos(newButtonPos);
      window.addEventListener("pointermove", handleRightDrag);
      props.setTwoHandleRightDrag(true);
      window.addEventListener("pointerup", () => {
        props.setTwoHandleRightDrag(false);
        window.removeEventListener("pointermove", handleRightDrag);
      });
    } else {
      setLeftButtonPos(newButtonPos);
      window.addEventListener("pointermove", handleLeftDrag);
      props.setTwoHandleLeftDrag(true);
      window.addEventListener("pointerup", () => {
        props.setTwoHandleLeftDrag(false);
        window.removeEventListener("pointermove", handleLeftDrag);
      });
    }
  };

  // updates leftButtonPos in response to drag of left slider button
  const handleLeftDrag = (e) => {
    // calcs new button position (resulting from drag) on track as % (0%=LHS bound and 100%=RHS bound)
    let newLeftPos =
      ((e.clientX - trackPosition.left) / trackPosition.width) * 100;
    // button buffer sets minimum distance between buttons (so they can't collide)
    const buttonBuffer = 21 / (trackPosition.width / 100);

    // if new left button position is less than 0% (i.e. off the LHS of the track), button position state is set to 0
    if (newLeftPos < 0) {
      newLeftPos = 0;
    }
    // if new left button position is higher than right button position - the buffer (the upper bound), leftButtonPos is set at upper bound
    else if (newLeftPos > rightButtonPos - buttonBuffer) {
      newLeftPos = rightButtonPos - buttonBuffer;
    }
    // otherwise left button position is set to state unchanged
    setLeftButtonPos(newLeftPos);
  };

  // updates rightButtonPos in response to drag of right slider button
  const handleRightDrag = (e) => {
    // calcs new right button position (resulting from drag) on track as % (0%=LHS bound and rightButtonPos=RHS bound)
    let newRightPos =
      ((e.clientX - trackPosition.left) / trackPosition.width) * 100;
    // button buffer sets minimum distance between buttons (so they can't collide)
    const buttonBuffer = 21 / (trackPosition.width / 100);
    // if new right button position is greater than 100% (i.e. off the RHS of the track), button position is set to 100
    if (newRightPos > 100) {
      newRightPos = 100;
    }
    // if new right button position is less than left button position + buffer (the lower bound), rightButtonPos is set at lower bound
    else if (newRightPos < leftButtonPos + buttonBuffer) {
      newRightPos = leftButtonPos + buttonBuffer;
    }
    setRightButtonPos(newRightPos);
  };

  return (
    <div className="rangeslider-hc7">
      <div>
        <div className="rangeslider-jn7">
          <div className="rangeslider-ty3" ref={sliderTrack}></div>
          <div
            className="rangeslider-vs7"
            style={{
              left: leftButtonPos + "%",
              width: rightButtonPos - leftButtonPos + "%",
            }}
          ></div>
          <div className="rangeslider-af3" onPointerDown={handlePointerDown}>
            <SliderButton
              buttonPos={leftButtonPos}
              handleDrag={handleLeftDrag}
              buttonDrag={props.twoHandleLeftDrag}
            />
            <SliderButton
              buttonPos={rightButtonPos}
              handleDrag={handleRightDrag}
              buttonDrag={props.twoHandleRightDrag}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default TwoHandleSlider;
