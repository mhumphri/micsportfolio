import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../styles/dropdown.css";


function Dropdown(props) {



  // ref for category menu button - dimensions used to style category dropdown
  const categoryMenuRef = useRef();
  // ref for category menu dropdown - used for closing it when clicks are detected outside
  const categoryDropdownRef = useRef();

  // stors width and height of category menu button - used to style category dropdown
  const [categoryMenuWidth, setCategoryMenuWidth] = useState();
  const [categoryMenuHeight, setCategoryMenuHeight] = useState();

  // boolean which controls category menu state (i.e. open or closed)
  const [categoryMenuOpen, setCategoryMenuOpen] = useState();

  const openMenu = () => {
    setCategoryMenuOpen(true);
  };

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
  }, []);

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

  // xyz
  const selectOption = (selectedOption) => {
    console.log("selectOption1: " + JSON.stringify(selectedOption))
    props.selectOption(selectedOption)
    setCategoryMenuOpen(false)
  }

  const getButtonStyle = () => {
    let newButtonStyle
    if (props.numberSelector) {
      newButtonStyle = "dropdown-ke7 number-selector"
    }
    else {
      newButtonStyle = "dropdown-ke7"
    }
    return newButtonStyle
  }



    return (
      <div className="dropdown-sm4">
        <button
          className={
            categoryMenuOpen
              ? getButtonStyle() + " menu-active"
              : getButtonStyle()
          }
          ref={categoryMenuRef}
          onClick={openMenu}
        >
          <div className="dropdown-ll2">
            {props.activeOption.label}
          </div>
          <span className="dropdown-fr8">
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
              ? "dropdown-vs5 menu-open"
              : "dropdown-vs5"
          }
          style={{
            minWidth: categoryMenuWidth + "px",
            paddingTop: categoryMenuHeight + "px",
          }}
        >
          {props.optionsArray.map((x) => (
            <button
              key={x.name}
              className={
                props.activeOption.key === x.key
                  ? "dropdown-lx7 selected"
                  : "dropdown-lx7"
              }
              onClick={() => selectOption(x)}
            >
              {x.label}
            </button>
          ))}
        </div>
      </div>
    );

  }

export default Dropdown;
