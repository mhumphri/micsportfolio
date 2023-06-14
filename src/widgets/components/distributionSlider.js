import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import SliderButton from "./sliderButton";
import "../css/rangeSlider.css";

// two handled slider with integrated data distribution bar chart

function DistributionSlider(props) {
  // screen width (stored in redux)

  const screenWidth = useSelector((state) => state.deviceData.screenWidth);

  // stores position of slider track
  const [trackPosition, setTrackPosition] = useState();

  // stores position of left and right slider buttons (scale 0  to 100)
  const [leftButtonPos, setLeftButtonPos] = useState(1);
  const [rightButtonPos, setRightButtonPos] = useState(100);

  // stores render of bar chart showing active price distribution
  const [distributionRender, setDistributionRender] = useState([]);

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

  // updates bar chart render in response to changes in rightButtonPos, leftButtonPos and screenWidth
  useEffect(() => {
    function stdNormalDistribution(x) {
      return Math.pow(Math.E, -Math.pow(x, 2) / 2) / Math.sqrt(2 * Math.PI);
    }

    let numBars = 25;
    if (screenWidth > 500) numBars = 40;
    if (screenWidth > 767) numBars = 50;

    let newDistributionRender = [];

    let dataDistribution = [];
    for (let i = 0; i < numBars; i++) {
      // const stdInputValue = -3 + i/(numBars/6)
      const stdInputValue = -3 + i / (numBars / 6.2);
      console.log(i + " " + stdInputValue);

      const barHeight = stdNormalDistribution(stdInputValue) * 350;
      console.log("barHeight " + i + ": " + barHeight);
      dataDistribution.push(barHeight);
    }

    // adjustment factor for converting 0-100 slider track range into number of bars in chart
    const barAdjFactor = 100 / numBars;

    // scales up/down 0 to 100 slider track range into relevant range for bar chart
    const newHighValue = rightButtonPos / barAdjFactor - 0.5;
    const newLowValue = leftButtonPos / barAdjFactor - 0.5;

    let barScalingFactor = 0.75;

    if (screenWidth > 500) barScalingFactor = 1;
    if (screenWidth > 767) barScalingFactor = 1.5;

    for (let i = 0; i < dataDistribution.length; i++) {
      if (i >= newLowValue && i <= newHighValue) {
        newDistributionRender.push(
          <div
            className="rangeslider-fi6"
            style={{ height: dataDistribution[i] * barScalingFactor + "px" }}
          />
        );
      } else {
        newDistributionRender.push(
          <div
            className="rangeslider-fi6 off"
            style={{ height: dataDistribution[i] * barScalingFactor + "px" }}
          />
        );
      }
    }
    setDistributionRender(newDistributionRender);

  }, [rightButtonPos, leftButtonPos, screenWidth]);

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
      props.setDistributionRightDrag(true);
      window.addEventListener("pointerup", () => {
        props.setDistributionRightDrag(false);
        window.removeEventListener("pointermove", handleRightDrag);
      });
    } else {
      setLeftButtonPos(newButtonPos);
      window.addEventListener("pointermove", handleLeftDrag);
      props.setDistributionLeftDrag(true);
      window.addEventListener("pointerup", () => {
        props.setDistributionLeftDrag(false);
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
    <div className="rangeslider-lx4">
      <div className="rangeslider-ds2">
        <div className="rangeslider-1da">{distributionRender}</div>
        <div className="rangeslider-jn7">
          <div className="rangeslider-ty3 narrow" ref={sliderTrack}></div>
          <div
            className="rangeslider-vs7 narrow"
            style={{
              left: leftButtonPos + "%",
              width: rightButtonPos - leftButtonPos + "%",
            }}
          ></div>
          <div className="rangeslider-af3" onPointerDown={handlePointerDown}>
            <SliderButton
              buttonPos={leftButtonPos}
              handleDrag={handleLeftDrag}
              buttonDrag={props.distributionLeftDrag}
              labelDisabled={true}
              narrowTrack={true}
            />
            <SliderButton
              buttonPos={rightButtonPos}
              handleDrag={handleRightDrag}
              buttonDrag={props.distributionLeftDrag}
              labelDisabled={true}
              narrowTrack={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DistributionSlider;
