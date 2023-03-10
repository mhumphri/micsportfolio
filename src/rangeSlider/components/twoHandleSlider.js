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
  const [activeRangeLeft, setActiveRangeLeft] = useState(leftButtonPos)
  const [activeRangeWidth, setActiveRangeWidth] = useState(rightButtonPos - leftButtonPos)

  // ref for slider track
  const sliderTrack = useRef(null);

  // initialses sliderTrack on load and updates at screen resize events
  useEffect(() => {
    // initialises sliderTrack on load
    setTrackPosition(sliderTrack.current.getBoundingClientRect());
    // screen resize event listener
    window.addEventListener("resize", () => {
      setTrackPosition(sliderTrack.current.getBoundingClientRect());
    });
    return () => {
      // removes event listener
      window.removeEventListener("resize", () => {
        setTrackPosition(sliderTrack.current.getBoundingClientRect());
      });
    };
  }, []);

  // sets & removes pointermove event listener when slider button is dragged
  const handlePointerDown = (e) => {
    console.log("E: " + e)
    let newButtonPos =
      ((e.clientX - trackPosition.left) / trackPosition.width) * 100;
      const leftDistance = Math.abs(newButtonPos - leftButtonPos)
      const rightDistance = Math.abs(newButtonPos - rightButtonPos)

      if (leftDistance > rightDistance ) {
         setRightButtonPos(newButtonPos);
      window.addEventListener("pointermove", handleRightDrag);
         props.setTwoHandleRightDrag(true)
        window.addEventListener("pointerup", () => {
        props.setTwoHandleRightDrag(false)
        window.removeEventListener("pointermove", handleRightDrag);
        });
      }
      else {
        setLeftButtonPos(newButtonPos);
     window.addEventListener("pointermove", handleLeftDrag);
        props.setTwoHandleLeftDrag(true)
       window.addEventListener("pointerup", () => {
       props.setTwoHandleLeftDrag(false)
       window.removeEventListener("pointermove", handleLeftDrag);
       });
      }
  };

  /* updates leftButtonPos and priceLowTextInput in response to drag of left slider button */
  const handleLeftDrag = (e) => {
    let newLeftPos =
      ((e.clientX - trackPosition.left) / trackPosition.width) * 100;
    const buttonBuffer = 21/(trackPosition.width/100);

    if (newLeftPos < 0) {
      newLeftPos = 0;
    } else if (newLeftPos > rightButtonPos - buttonBuffer) {
      newLeftPos = rightButtonPos - buttonBuffer;
    }
    console.log("newLeftPos: " + newLeftPos)
    setLeftButtonPos(newLeftPos)
  };

/* updates rightButtonPos and priceHighTextInput in response to drag of right slider button */
  const handleRightDrag = (e) => {
    let newRightPos =
      ((e.clientX - trackPosition.left) / trackPosition.width) * 100;


    const buttonBuffer = 21/(trackPosition.width/100);

    if (newRightPos > 100) {
      newRightPos = 100;
    } else if (newRightPos < leftButtonPos + buttonBuffer) {
      newRightPos = leftButtonPos + buttonBuffer;
    }

    console.log("newRightPos: " + newRightPos)
      setRightButtonPos(newRightPos)
  };

  return (
    <div class="rangeslider-hc7">
      <div>
        <div class="rangeslider-jn7">
          <div class="rangeslider-ty3" ref={sliderTrack}></div>
          <div
            class="rangeslider-vs7"
            style={{ left: leftButtonPos + "%", width: rightButtonPos - leftButtonPos + "%" }}
          ></div>
          <div class="rangeslider-af3" onPointerDown={handlePointerDown}>
            <SliderButton buttonPos={leftButtonPos} handleDrag={handleLeftDrag} buttonDrag={props.twoHandleLeftDrag} />
            <SliderButton buttonPos={rightButtonPos} handleDrag={handleRightDrag} buttonDrag={props.twoHandleRightDrag} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default TwoHandleSlider;
