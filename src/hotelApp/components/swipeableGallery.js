import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";

import "../css/swipeableGallery.css";

// renders individual portfolio item either as a swipable photo gallry with progress indicator

function SwipeableGallery(props) {
  // boolean indicating if device is touch screen (stored in redux)
  const touchScreen = useSelector((state) => state.deviceData.touchScreen);
  // index of photo currently visible
  const [currentPhoto, setCurrentPhoto] = useState(0);
  // boolean value indicating if chevrons currently active - used for styling
  const [chevronsActive, setChevronsActive] = useState(false);
  // boolean value indicating if pointer is currently hovering over gallery
  const [pointerHover, setPointerHover] = useState(false);
  // css styles for LHS and RHS chevrons
  const [lhsChevronStyle, setLhsChevronStyle] = useState(
    "s134m7bb s1tdgjmu dir dir-ltr"
  );
  const [rhsChevronStyle, setRhsChevronStyle] = useState(
    "s134m7bb s1tdgjmu dir dir-ltr"
  );

  // ref for photo viewer div
  const galleryRef = useRef(null);

  /* updates chevron styling in reponse to photo gallery being scrolled */
  const onGalleryScroll = () => {
    const currentScrollPos = galleryRef.current.scrollLeft;
    const imageWidth = galleryRef.current.offsetWidth;
    if (Math.round(currentScrollPos / imageWidth) !== currentPhoto) {
      setCurrentPhoto(Math.round(currentScrollPos / imageWidth));
    }
  };

  // moves to next image when LHS chevron is clicked
  const scrollLeft = (e) => {
    e.stopPropagation();
    const currentScrollPos = galleryRef.current.scrollLeft;
    const imageWidth = galleryRef.current.offsetWidth;
    galleryRef.current.scrollTo({
      left: currentScrollPos - imageWidth,
      behavior: "smooth",
    });
    setChevronsActive(true);
  };

  // moves to next image when RHS chevron is clicked
  const scrollRight = (e) => {
    e.stopPropagation();
    const currentScrollPos = galleryRef.current.scrollLeft;
    const imageWidth = galleryRef.current.offsetWidth;
    galleryRef.current.scrollTo({
      left: currentScrollPos + imageWidth,
      behavior: "smooth",
    });
    setChevronsActive(true);
  };

  // render of progress dots at the bottom of the photo (which show as you scroll through the photo array)
  const dotsRender = (livePhoto) => {
    // total number of photos in array
    const maxPhoto = props.photos.length - 1;
    let newDots = [];
    for (let i = 0; i < props.photos.length; i++) {
      let style = "swipeable-gallery-1k9";
      if (i === livePhoto) {
        style = "swipeable-gallery-4o7";
      }

      let dotScale = 1;

      if (i > 0) {
        if (i >= livePhoto + 2 || i <= livePhoto - 2) {
          dotScale = 0.666667;
        }
        if (i > 1) {
          if (i === livePhoto + 1 || i === livePhoto - 1) {
            dotScale = 0.833333;
          }
        }

        if (livePhoto > maxPhoto - 2) {
          if (i >= maxPhoto - 2) {
            dotScale = 1;
          }
          if (i === maxPhoto - 3) {
            dotScale = 0.833333;
          }
        }

        if (livePhoto < 3) {
          if (i < 3) {
            dotScale = 1;
          }
          if (i === 3) {
            dotScale = 0.833333;
          }
        }

        if (i === livePhoto) {
          dotScale = 1;
        }
      }

      newDots.push(
        <span
          class={style}
          style={{ transform: "scale(" + dotScale + ")" }}
        ></span>
      );
    }

    let dotsPosition = 0;

    if (currentPhoto > 1) {
      dotsPosition = (currentPhoto - 2) * -11;
    }

    if (currentPhoto >= maxPhoto - 2) {
      dotsPosition = (maxPhoto - 4) * -11;
    }

    const newRender = (
      <div
        className="swipeable-gallery-1b2"
        style={{ transform: "translateX(" + dotsPosition + "px)" }}
      >
        {newDots}
      </div>
    );

    return newRender;
  };



  // updates chevron styling in response to changes in currentPhoto and props.activeResult

  useEffect(() => {

    // sets styles for rhs and lhs chevrons - different depending on whether the trigger is hover or scroll. if scroll, the chevron button remains visible to prevent link from being clicked. If hover, triggers the chevron button is hidden so cant be clicked
    const updateChevrons = () => {
      // total number of photos in array
      const maxPhoto = props.photos.length - 1;
      if (pointerHover) {
        if (currentPhoto > 0) {
          setLhsChevronStyle("swipeable-gallery-s13");
        } else {
          if (chevronsActive) {
            setLhsChevronStyle("swipeable-gallery-s13  swipeable-gallery-sqd");
          } else {
            setLhsChevronStyle("swipeable-gallery-s13 swipeable-gallery-s1t");
          }
        }

        if (currentPhoto < maxPhoto) {
          setRhsChevronStyle("swipeable-gallery-s13");
        } else {
          if (chevronsActive) {
            setRhsChevronStyle("swipeable-gallery-s13 swipeable-gallery-sqd");
          } else {
            setRhsChevronStyle("swipeable-gallery-s13 swipeable-gallery-s1t");
          }
        }
      } else {
        setLhsChevronStyle("swipeable-gallery-s13 swipeable-gallery-s1t");
        setRhsChevronStyle("swipeable-gallery-s13 swipeable-gallery-s1t");
      }
    };

    if (!touchScreen) {
      updateChevrons();
    }
  }, [currentPhoto, pointerHover, chevronsActive, touchScreen, props.photos.length]);

  // activates chevron styling and active item in reponse to mouse entering
  const handleMouseEnter = () => {
    setPointerHover(true);
  };

  // de-activates chevron styling and active item in reponse to mouse entering
  const handleMouseLeave = () => {
    setPointerHover(false);
  };


  if (touchScreen) {
    return (
      <div className="swipeable-gallery-c14d">
        <div className="swipeable-gallery-o1q">
          <div />

          <div className="swipeable-gallery-b1t">
            <div className="swipeable-gallery-byc"></div>
            <div className="swipeable-gallery-bal">
              <div role="img" className="swipeable-gallery-r75">
                <div className="swipeable-gallery-szn">
                  {dotsRender(currentPhoto)}
                </div>
              </div>
            </div>
            <div className="swipeable-gallery-b18"></div>
          </div>
        </div>

        <div className="swipeable-gallery-cw9">
          <div
            className="swipeable-gallery-c14w"
            onScroll={onGalleryScroll}
            ref={galleryRef}
          >
            {props.photos.map((x) => (
              <div className="swipeable-gallery-rfe">
                <div className="swipeable-gallery-tz4">
                  <img className="swipeable-gallery-uc3" alt="alt" src={x} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div
        className="swipeable-gallery-c14d"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >


        <div className="swipeable-gallery-o1q">
          <div />
          {props.itemLoading? null : <div className="swipeable-gallery-m1d">
            <div className="swipeable-gallery-m1t">
              <div class={lhsChevronStyle}>
                <button className="swipeable-gallery-1d3" onClick={scrollLeft}>
                  <svg
                    className="swipeable-gallery-cl1"
                    viewBox="0 0 32 32"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g>
                      <path d="m20 28-11.29289322-11.2928932c-.39052429-.3905243-.39052429-1.0236893 0-1.4142136l11.29289322-11.2928932"></path>
                    </g>
                  </svg>
                </button>
              </div>
            </div>
            <div className="swipeable-gallery-ms8">
              <div class={rhsChevronStyle}>
                <button className="swipeable-gallery-1d3" onClick={scrollRight}>
                  <svg
                    className="swipeable-gallery-cl1"
                    viewBox="0 0 32 32"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g>
                      <path d="m12 4 11.2928932 11.2928932c.3905243.3905243.3905243 1.0236893 0 1.4142136l-11.2928932 11.2928932"></path>
                    </g>
                  </svg>
                </button>
              </div>
            </div>
          </div> }
          {props.itemLoading? null : <div className="swipeable-gallery-b1t">
            <div className="swipeable-gallery-byc"></div>
            <div className="swipeable-gallery-bal">
              <div role="img" className="swipeable-gallery-r75">
                <div className="swipeable-gallery-szn">
                  {dotsRender(currentPhoto)}
                </div>
              </div>
            </div>
            <div className="swipeable-gallery-b18"></div>
          </div> }
        </div>
        <div className="swipeable-gallery-cw9">
          <div
            className="swipeable-gallery-c14w"
            onScroll={onGalleryScroll}
            ref={galleryRef}
          >
            {props.photos.map((x) => (
              <div className="swipeable-gallery-rfe">
                <div className="swipeable-gallery-tz4">
                  <img className="swipeable-gallery-uc3" alt="alt" src={x} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default SwipeableGallery;
