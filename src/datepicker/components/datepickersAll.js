import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import DatePicker from "./datepicker";
import SimpleSlider from "../../widgets/components/simpleSlider";
import "../css/datepickersAll.css";

const calcNewViewWidth = (newSliderPosition, screenWidth, minWidth, maxWidth) => {
  if (maxWidth > Math.round(screenWidth)*0.9) {
    maxWidth = Math.round(screenWidth)*0.9
  }
  let minMaxdiff = maxWidth - minWidth
  if (minMaxdiff<0) {
    minMaxdiff=0;
  }
  const newMobileViewWidth = minWidth + newSliderPosition*minMaxdiff/100
  return newMobileViewWidth
}

const updateMobileViewWidth = (newSliderPosition, screenWidth) => {
  let minWidth = 280;
  let maxWidth = 550;
  return calcNewViewWidth(newSliderPosition, screenWidth, minWidth, maxWidth)
}

const updateSinglePanelWidth = (newSliderPosition, screenWidth) => {
  let minWidth = 280;
  let maxWidth = 650;
  return calcNewViewWidth(newSliderPosition, screenWidth, minWidth, maxWidth)
}

const updateDoublePanelWidth = (newSliderPosition, screenWidth) => {
  console.log("updateDoublePanelWidth: " + newSliderPosition)
  let minWidth = 600;
  let maxWidth = 1300;
  return calcNewViewWidth(newSliderPosition, screenWidth, minWidth, maxWidth)
}

// renders list of individual portfolio items in a grid

function DatepickersAll() {
  // large view (boolean indicating if app currently in large view) and screen height (stored in redux)
  const largeView = useSelector((state) => state.deviceData.largeView);
  // viewport width (stored in redux)
  const screenWidth = useSelector((state) => state.deviceData.screenWidth);
  // boolean showing true if the relevant slider is currently dragging
  const [simpleDrag, setSimpleDrag] = useState();
  //
  const [mobileViewWidth, setMobileViewWidth] = useState(280);
  //
  const [singlePanelWidth, setSinglePanelWidth] = useState(280);

  const [doublePanelWidth, setDoublePanelWidth] = useState(600);

  // used to store position of mobile view slider - needed to update mobileViewWidth if screen width changes
  const mobileSliderRef = useRef();
  const singlePanelSliderRef = useRef();
  const doublePanelSliderRef = useRef();


  const handleMobileSliderChange = (newSliderPosition) => {
    setMobileViewWidth(updateMobileViewWidth(newSliderPosition, screenWidth))
    mobileSliderRef.current = newSliderPosition
  }

  const handleSinglePanelChange = (newSliderPosition) => {
    setSinglePanelWidth(updateSinglePanelWidth(newSliderPosition, screenWidth))
    singlePanelSliderRef.current = newSliderPosition
  }

  const handleDoublePanelChange = (newSliderPosition) => {
    setDoublePanelWidth(updateDoublePanelWidth(newSliderPosition, screenWidth))
    doublePanelSliderRef.current = newSliderPosition
  }

  // triggers update of markers when props.hotelArray updates
   useEffect(() => {
  mobileSliderRef.current = 0;
  singlePanelSliderRef.current = 0
  doublePanelSliderRef.current = 0
  }, []);

  // triggers update of markers when props.hotelArray updates
  useEffect(() => {
    setMobileViewWidth(updateMobileViewWidth(mobileSliderRef.current, screenWidth))
    setSinglePanelWidth(updateSinglePanelWidth(singlePanelSliderRef.current, screenWidth))
    setDoublePanelWidth(updateDoublePanelWidth(doublePanelSliderRef.current, screenWidth))
  }, [screenWidth]);




if (largeView) {
  return (
    <main className="date-pickers-all-yu1">
    <h2 className="date-pickers-all-ps2">vertical picker</h2>
    <div className="date-pickers-all-hs1">
    <div className="date-pickers-all-ta1">width: {Math.round(mobileViewWidth)}px</div>
    <SimpleSlider
      simpleDrag={simpleDrag}
      setSimpleDrag={setSimpleDrag}
      sliderPositionInit={mobileSliderRef.current}
      updateSliderPosition={handleMobileSliderChange}
      labelDisabled={true}
      smallMargins={true}
    />
    </div>
     <div className="date-pickers-all-re2" style={{width: mobileViewWidth + "px"}}>

  <DatePicker width={mobileViewWidth} />

    </div>


 <h2 className="date-pickers-all-ps2">horizontal picker - single panel</h2>
    <div className="date-pickers-all-hs1">
    <div className="date-pickers-all-ta1">width: {Math.round(singlePanelWidth)}px</div>
    <SimpleSlider
      simpleDrag={simpleDrag}
      setSimpleDrag={setSimpleDrag}
      sliderPositionInit={singlePanelSliderRef.current}
      updateSliderPosition={handleSinglePanelChange}
      labelDisabled={true}
      smallMargins={true}
    />
    </div>
  <div className="date-pickers-all-re3" style={{width: singlePanelWidth + "px"}}>
    <DatePicker width={singlePanelWidth} largeView={true} />
   </div>

   {screenWidth > 650 ?
     <>
   <h2 className="date-pickers-all-ps2">horizontal picker - double panel</h2>
   <div className="date-pickers-all-hs1">
   <div className="date-pickers-all-ta1">width: {Math.round(doublePanelWidth)}px</div>
   <SimpleSlider
     simpleDrag={simpleDrag}
     setSimpleDrag={setSimpleDrag}
     sliderPositionInit={doublePanelSliderRef.current}
     updateSliderPosition={handleDoublePanelChange}
     labelDisabled={true}
     smallMargins={true}
   />
   </div>
 <div className="date-pickers-all-re3" style={{width: doublePanelWidth + "px"}}>
   <DatePicker width={doublePanelWidth} largeView={true} doublePanel={true} />
  </div>
  </>
:
<>
<h2 className="date-pickers-all-ps2">horizontal picker - double panel</h2>
  <div className="date-pickers-all-ta1">
    you'll need a screen at least 650px wide to see this one
  </div>
</> }



    </main>
  );
}
else {
  return(

    <div className="date-pickers-all-ks7" style={{width: screenWidth + "px", marginTop: "70px"}}>

 <DatePicker width={screenWidth} />

   </div>

  )
}

}

export default DatepickersAll;
