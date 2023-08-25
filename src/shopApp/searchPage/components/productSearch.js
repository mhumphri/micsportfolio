import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { categoryArray, itemsArray } from "./data";
import ActionButton from "../../widgets/components/actionButton";
import BasketButton from "../../widgets/components/basketButton";
import ContactButton from "../../widgets/components/contactButton";
import "../styles/productSearch.css";

function ProductSearch(props) {
  // viewport width (stored in redux)
  const screenWidth = useSelector((state) => state.deviceData.screenWidth);

  // stors width and height of category menu button - used to style category dropdown
  const [categoryMenuWidth, setCategoryMenuWidth] = useState();
  const [categoryMenuHeight, setCategoryMenuHeight] = useState();

  // ref for category menu button - dimensions used to style category dropdown
  const categoryMenuRef = useRef();
  // ref for category menu dropdown - used for closing it when clicks are detected outside
  const categoryDropdownRef = useRef();

  // boolean which controls category menu state (i.e. open or closed)
  const [categoryMenuOpen, setCategoryMenuOpen] = useState();
  // currently selected item category - used for formatting category menu dropdown and controlling displayed items
  const [activeCategory, setActiveCategory] = useState({
    name: "All",
    numberItems: 27,
  });
  const [activeItemsArray, setActiveItemsArray] = useState(itemsArray);



  //
  useEffect(() => {
    if (categoryMenuRef.current) {
      setCategoryMenuWidth(
        categoryMenuRef.current.getBoundingClientRect().width
      );
      setCategoryMenuHeight(
        categoryMenuRef.current.getBoundingClientRect().height
      );
    }
  }, [screenWidth]);

  const openMenu = () => {
    setCategoryMenuOpen(true);
  };

  const selectItemCategory = (newCategory) => {
    setActiveCategory(newCategory);
    setCategoryMenuOpen(false);

    let newItemsArray = [];
    if (newCategory.name === "All") {
      newItemsArray = itemsArray;
    } else {
      for (let i = 0; i < itemsArray.length; i++) {
        if (itemsArray[i].category === newCategory.name) {
          newItemsArray.push(itemsArray[i]);
        }
      }
    }
    setActiveItemsArray(newItemsArray);
  };

  // click event listener which closes dropdown menu if user clicks outside searchnav / dropdown list (large view only)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target)
      ) {
        setCategoryMenuOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  });

  if (props.largeView) {
    return (
      <section>
        <div className="product-search-pa1">
          <div className="product-search-bs8">
            <div className="product-search-kd4">
              <div className="product-search-dw6">
              <ul className="product-search-kj3">
                {categoryArray.map((x) => (
                  <button
                    className={
                      activeCategory.name === x.name
                        ? "product-search-nd3"
                        : "product-search-nd2"
                    }
                    onClick={() => selectItemCategory(x)}
                  >
                    <span className="product-search-js2">{x.name}</span>
                    <span className="product-search-ms6">{x.numberItems}</span>
                  </button>
                ))}
              </ul>
              <div>

                <p className="product-search-jw5">Can't find what you're looking for?</p>
                <div className="product-search-uw7">
                <ContactButton />
                </div>
              </div>
            </div>
            </div>
            <div className="product-search-lk1">
              <div className="product-search-ty1">
                {activeItemsArray.map((x, index) => (
                  <div key={x.name} className="product-search-wq4">
                    <Link
                      to={"/shop-app/product/" + index}
                      className="product-search-us2"
                    >
                      <div className="product-search-uu4">
                        <div className="product-search-dj9">
                          <div className="product-search-zq1">
                            <div className="product-search-ry4">
                              <img
                                className="product-search-ks8"
                                src={x.imageUrl}
                                /*srcset="https://i.etsystatic.com/34623276/c/2442/1941/250/125/il/400df9/4712972989/il_340x270.4712972989_krpc.jpg 340w,https://i.etsystatic.com/34623276/c/2442/1941/250/125/il/400df9/4712972989/il_680x540.4712972989_krpc.jpg 680w"
                          sizes="(max-width: 9223372036854775807px) 15vw, (max-width: 1679px) 20vw, (max-width: 1199px) 25vw, (max-width: 899px) 33vw, 50vw"*/
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="product-search-fg6">
                        <h3 className="product-search-nh2">{x.name}</h3>
                        <div className="product-search-iu4">£{x.price}</div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  } else {
    return (
      <section>
        <div className="product-search-xd3">
          <div className="product-search-sm4">
            <button
              className={
                categoryMenuOpen
                  ? "product-search-ke7 menu-active"
                  : "product-search-ke7"
              }
              ref={categoryMenuRef}
              onClick={openMenu}
            >
              <div className="product-search-ll2">
                {activeCategory.name} ({activeCategory.numberItems})
              </div>
              <span className="product-search-fr8">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  focusable="false"
                >
                  <polygon points="16.5 10 12 16 7.5 10 16.5 10"></polygon>
                </svg>
              </span>
            </button>
            <div
              ref={categoryDropdownRef}
              className={
                categoryMenuOpen
                  ? "product-search-vs5 menu-open"
                  : "product-search-vs5"
              }
              style={{
                minWidth: categoryMenuWidth + "px",
                paddingTop: categoryMenuHeight + "px",
              }}
            >
              {categoryArray.map((x) => (
                <button
                  key={x.name}
                  className={
                    activeCategory.name === x.name
                      ? "product-search-lx7 selected"
                      : "product-search-lx7"
                  }
                  onClick={() => selectItemCategory(x)}
                >
                  {x.name} ({x.numberItems})
                </button>
              ))}
            </div>
          </div>
          <div className="product-search-hd5">
            <BasketButton />
          </div>
        </div>
        <div className="product-search-cv2">
          <div className="product-search-ty1">
            {activeItemsArray.map((x, index) => (
              <div key={x.name} className="product-search-wq3">
                <Link
                  to={"/shop-app/product/" + index}
                  className="product-search-us2"
                >
                  <div className="product-search-uu4">
                    <div className="product-search-dj9">
                      <div className="product-search-zq1">
                        <div className="product-search-ry4">
                          <img
                            className="product-search-ks8"
                            src={x.imageUrl}
                            /*srcset="https://i.etsystatic.com/34623276/c/2442/1941/250/125/il/400df9/4712972989/il_340x270.4712972989_krpc.jpg 340w,https://i.etsystatic.com/34623276/c/2442/1941/250/125/il/400df9/4712972989/il_680x540.4712972989_krpc.jpg 680w"
                        sizes="(max-width: 9223372036854775807px) 15vw, (max-width: 1679px) 20vw, (max-width: 1199px) 25vw, (max-width: 899px) 33vw, 50vw"*/
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="product-search-fg6">
                    <h3 className="product-search-nh2">{x.name}</h3>
                    <div className="product-search-iu4">£{x.price}</div>
                  </div>
                </Link>
              </div>
            ))}
            <div className="product-search-ke9">

              <p className="product-search-jw5">Can't find what you're looking for?</p>
              <div className="product-search-uw7">
              <ContactButton />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default ProductSearch;
