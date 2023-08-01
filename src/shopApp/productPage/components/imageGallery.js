import React, { useState, useRef } from "react";
import "../styles/imageGallery.css";

function ImageGallery(props) {
  const scrollDiv = useRef(null);
  const [activePhoto, setActivePhoto] = useState(1);

  // updates the number for current photo when user scrolls through gallery
  const handleScroll = () => {
    const currentPhoto =
      Math.round(scrollDiv.current.scrollLeft / scrollDiv.current.clientWidth) +
      1;
    if (currentPhoto !== activePhoto) {
      setActivePhoto(currentPhoto);
      console.log("currentPhoto: " + currentPhoto);
    }
  };

  const selectPhoto = (photoId) => {
    props.setActivePhoto(photoId);
    console.log("photoId: " + photoId);
  };

  const indImage = (imgData, index) => {
    return [
      <div class="photo-gallery-1em">
        <button
          type="button"
          class="photo-gallery-1xh"
          onClick={() => selectPhoto(index)}
        >
          <div class="photo-gallery-1h6">
            <picture>
              <img class="photo-gallery-6tb" src={imgData} />
            </picture>
          </div>
        </button>
      </div>,
    ];
  };

  if (props.largeView) {
    return (
      <div class="photo-gallery-z80">
        <div class="photo-gallery-9xg">
          <div class="photo-gallery-168">
            <div class="photo-gallery-skz">
              <div class="photo-gallery-5lt">
                <div class="photo-gallery-13s">
                  <div class="photo-gallery-100">
                    {indImage(props.images[0], 0)}
                  </div>
                </div>
              </div>

              <div class="photo-gallery-178">
                <div class="photo-gallery-13s">
                  <div class="photo-gallery-1l7">
                    <div class="photo-gallery-100">
                      {indImage(props.images[1], 1)}
                    </div>
                  </div>

                  <div class="photo-gallery-924">
                    <div class="photo-gallery-100">
                      {indImage(props.images[2], 2)}
                    </div>
                  </div>
                </div>
              </div>

              <div class="photo-gallery-182">
                <div class="photo-gallery-13s">
                  <div class="photo-gallery-1l7">
                    <div class="photo-gallery-100">
                      {indImage(props.images[3], 3)}
                    </div>
                  </div>

                  <div class="photo-gallery-924">
                    <div class="photo-gallery-100">
                      {indImage(props.images[4], 4)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div class="photo-gallery-v25">
        <div class="photo-gallery-1tr">
          <ul
            onScroll={handleScroll}
            ref={scrollDiv}
            class="photo-gallery-rxz"
            style={{ marginLeft: "0px", marginRight: "0px" }}
          >
            {props.images.map((x, index) => (
              <li
                aria-hidden="false"
                data-key={x.dataKey}
                class="photo-gallery-145"
              >
                <div data-key={x.dataKey} class="photo-gallery-1yf">
                  <button
                    type="button"
                    class="photo-gallery-11e"
                    onClick={() => selectPhoto(index)}
                  >
                    <div
                      class="photo-gallery-v0g"
                      role="img"
                      aria-busy="false"
                      aria-label="Show all photos"
                    >
                      <div class="photo-gallery-462">
                        <picture>
                          <img class="photo-gallery-oxz" src={x} />
                        </picture>
                      </div>
                    </div>
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div class="photo-gallery-thq">
            {/* shows current number of current visible photo and total number of photos on arracy */}
            <div class="photo-gallery-oab">
              {activePhoto} / {props.images.length}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ImageGallery;
