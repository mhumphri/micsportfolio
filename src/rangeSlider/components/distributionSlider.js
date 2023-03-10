import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import SliderButton from "./sliderButton";
import "../css/rangeSlider.css";
import "../css/distributionSlider.css";

// range slider portfolio item

function DistributionSlider(props) {

// screen width (stored in redux)
const screenWidth = useSelector((state) => state.deviceData.screenWidth);

  // stores screen position of slider track
  const [trackPosition, setTrackPosition] = useState();

  // stores position of left and right slider buttons (scale 0  to 100)
  const [leftButtonPos, setLeftButtonPos] = useState(1);
  const [rightButtonPos, setRightButtonPos] = useState(100);

  // strores position of active section of slider track
  const [activeRangeLeft, setActiveRangeLeft] = useState(leftButtonPos)
  const [activeRangeWidth, setActiveRangeWidth] = useState(rightButtonPos - leftButtonPos)

  // stores render of bar chart showing active price distribution
  const [distributionRender, setDistributionRender] = useState([]);

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

  // updates bar chart render in response to changes in props.dataDistribution, highValue, lowValue
useEffect(() => {

  function stdNormalDistribution (x) {
  return Math.pow(Math.E,-Math.pow(x,2)/2)/Math.sqrt(2*Math.PI);
}

let numBars = 25
if (screenWidth>500) (
  numBars = 40
)
if (screenWidth>767) (
  numBars = 50
)

  let newDistributionRender = [];

  let dataDistribution = []
  for (let i=0; i < numBars; i++ ) {

    // const stdInputValue = -3 + i/(numBars/6)
    const stdInputValue = -3 + i/(numBars/6.2)
    console.log(i + ' ' + stdInputValue)

    const barHeight = stdNormalDistribution(stdInputValue) *350
    console.log("barHeight " + i + ": " + barHeight)
    dataDistribution.push(barHeight)
  }

  // adjustment factor for converting 0-100 slider track range into number of bars in chart
  const barAdjFactor = 100/numBars

  // scales up/down 0 to 100 slider track range into relevant range for bar chart
  const newHighValue = rightButtonPos/barAdjFactor - 0.5
  const newLowValue = leftButtonPos/barAdjFactor - 0.5

  let barScalingFactor = 0.75

  if (screenWidth>500) (
    barScalingFactor = 1
  )
  if (screenWidth>767) (
    barScalingFactor = 1.5
  )

  for (let i = 0; i < dataDistribution.length; i++) {
    if (i >= newLowValue && i <= newHighValue) {
      newDistributionRender.push(
        <div
          class="rangeslider-fi6"
          style={{ height: dataDistribution[i]*barScalingFactor + "px" }}
        />
      );
    } else {
      newDistributionRender.push(
        <div
          class="rangeslider-fi6 off"
          style={{ height: dataDistribution[i]*barScalingFactor + "px" }}
        />
      );
    }
  }
  setDistributionRender(newDistributionRender);

  // calculate and set position of active track (0 to 100)

  setActiveRangeLeft(leftButtonPos)
  setActiveRangeWidth(rightButtonPos - leftButtonPos)


}, [rightButtonPos, leftButtonPos, screenWidth]);


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
       props.setDistributionRightDrag(true)
      window.addEventListener("pointerup", () => {
      props.setDistributionRightDrag(false)
      window.removeEventListener("pointermove", handleRightDrag);
      });
    }
    else {
      setLeftButtonPos(newButtonPos);
   window.addEventListener("pointermove", handleLeftDrag);
      props.setDistributionLeftDrag(true)
     window.addEventListener("pointerup", () => {
     props.setDistributionLeftDrag(false)
     window.removeEventListener("pointermove", handleLeftDrag);
     });
    }
};

  /* updates leftButtonPos and priceLowTextInput in response to drag of left slider button */
  const handleLeftDrag = (e) => {
    let newLeftPos =
      ((e.clientX - trackPosition.left) / trackPosition.width) * 100;
    const buttonBuffer = 21/(trackPosition.width/100);;

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
        <div
            class="rangeslider-1da"
          >
            {distributionRender}
          </div>
        <div class="rangeslider-jn7">
          <div class="rangeslider-ty3 narrow" ref={sliderTrack}></div>
          <div
            class="rangeslider-vs7 narrow"
            style={{ left: leftButtonPos + "%", width: rightButtonPos - leftButtonPos + "%" }}
          ></div>
          <div class="rangeslider-af3" onPointerDown={handlePointerDown}>
            <SliderButton buttonPos={leftButtonPos} handleDrag={handleLeftDrag} buttonDrag={props.distributionLeftDrag} labelDisabled={true} />
            <SliderButton buttonPos={rightButtonPos} handleDrag={handleRightDrag} buttonDrag={props.distributionLeftDrag} labelDisabled={true} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DistributionSlider;
