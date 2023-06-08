import React, { useState } from "react";
import DatePicker from "./datePicker";
import SimpleSlider from "../../rangeSlider/components/simpleSlider";
import "../css/datePickersAll.css";

// renders list of individual portfolio items in a grid

function DatePickersAll() {
  // boolean showing true if the relevant slider is currently dragging
  const [simpleDrag, setSimpleDrag] = useState();
  // boolean showing true if the relevant slider is currently dragging
  const [sliderPosition, setSliderPosition] = useState(50);
  //
  const [mobileViewWidth, setMobileViewWidth] = useState(411);
  //
  const [largeViewWidth, setLargeViewWidth] = useState(500);

  const [doublePanelWidth, setDoublePanelWidth] = useState(800);

  const updateMobileViewWidth = (newSliderPosition) => {
    const newMobileViewWidth = 300 + Math.ceil(newSliderPosition*2.5)
    setMobileViewWidth(newMobileViewWidth)
  }

  const updateLargeViewWidth = (newSliderPosition) => {
    const newLargeViewWidth = 300 + Math.ceil(newSliderPosition*4)
    setLargeViewWidth(newLargeViewWidth)
  }

  const updateDoublePanelWidth = (newSliderPosition) => {
    const newDoublePanelWidth =600 + Math.ceil(newSliderPosition*8)
    setDoublePanelWidth(newDoublePanelWidth)
  }

  return (
    <main className="date-pickers-all-yu1">
    <h2 className="date-pickers-all-ps2">large view - double panel</h2>
    <div className="date-pickers-all-hs1">
    {doublePanelWidth}
    <SimpleSlider
      simpleDrag={simpleDrag}
      setSimpleDrag={setSimpleDrag}
      sliderPosition={sliderPosition}
      updateSliderPosition={updateDoublePanelWidth}
    />
    </div>
  <div className="date-pickers-all-re3" style={{width: doublePanelWidth + "px"}}>
    <DatePicker width={doublePanelWidth} largeView={true} doublePanel={true} />
   </div>
 <h2 className="date-pickers-all-ps2">large view</h2>
    <div className="date-pickers-all-hs1">
    {largeViewWidth}
    <SimpleSlider
      simpleDrag={simpleDrag}
      setSimpleDrag={setSimpleDrag}
      sliderPosition={sliderPosition}
      updateSliderPosition={updateLargeViewWidth}
    />
    </div>
  <div className="date-pickers-all-re3" style={{width: largeViewWidth + "px"}}>
    <DatePicker width={largeViewWidth} largeView={true} />
   </div>

    <h2 className="date-pickers-all-ps2">mobile view</h2>
     <div className="date-pickers-all-re2" style={{width: mobileViewWidth + "px"}}>
  <DatePicker width={mobileViewWidth} />

    </div>
    <div className="date-pickers-all-hs1">
    {sliderPosition}
    <SimpleSlider
      simpleDrag={simpleDrag}
      setSimpleDrag={setSimpleDrag}
      sliderPosition={sliderPosition}
      updateSliderPosition={updateMobileViewWidth}
    />
    </div>

    </main>
  );
}

export default DatePickersAll;