import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Dropdown from "../../widgets/components/dropdown";
import ActionButton from "../../widgets/components/actionButton";
import "../styles/addressForm.css";

const optionsArray = [
  { key: "a0", label: "select an option" },
  { key: "a1", label: "option 1" },
  { key: "a2", label: "option 2" },
  { key: "a3", label: "option 3" },
  { key: "a4", label: "option 4" },
  { key: "a5", label: "option 5" },
  { key: "a6", label: "option 6" },
];

const inputStateInit = {
  email_address: { required: true, clicked: false, warning: false, value: "" },
  email_confirm: { required: true, clicked: false, warning: false, value: "" },
  full_name: { required: true, clicked: false, warning: false, value: "" },
  address_line_1: { required: true, clicked: false, warning: false, value: "" },
  address_line_2: { required: true, clicked: false, warning: false, value: "" },
  address_line_3: { required: false, clicked: false, warning: false, value: ""},
  post_code: { required: true, clicked: false, warning: false, value: "" },
};

function AddressForm(props) {
  const [inputValue, setInputValue] = useState();

  const [inputState, setInputState] = useState(inputStateInit);

  const [activeOption1, setActiveOption1] = useState(optionsArray[0]);

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  function inputFocus(e) {
    let newInputState = { ...inputState };

    for (let key in newInputState) {
      if (newInputState[key]["clicked"]) {
        if (key === "email_address") {
          if (!validateEmail(e.target.value)) {
            newInputState[key]["warning"] = true;
          }
        } else if (key === "email_confirm") {
          if (
            newInputState.email_address.clicked &&
            newInputState.email_address.value !==
              newInputState.email_confirm.value
          ) {
            newInputState[key]["warning"] = true;
          }
        } else {
          if (newInputState[key]["value"] === "") {
            newInputState[key]["warning"] = true;
          }
        }
      }
    }

    newInputState[e.target.name]["clicked"] = true;
    setInputState(newInputState);

    console.log(e.target.name);
  }

  function updateFormValues(e) {
    let newInputState = { ...inputState };
    newInputState[e.target.name]["value"] = e.target.value;
    setInputState(newInputState);
  }

  return (
    <div className="address-form-le2">
      <h1>Please enter the delivery address</h1>
      <form>
        <div>
          <div className="form-input-ur2">
            <label for="email-input" className="dropdown-hq78">
              Email
              <span className="dropdown-mm33" />
            </label>
            <input
              id="email-input"
              type="email"
              className={
                inputState.email_address.warning
                  ? "form-input-e45 incomplete"
                  : "form-input-e45"
              }
              name="email_address"
              aria-label="Email"
              data-selector="email-address-field"
              inputmode="email"
              autocomplete="email"
              onFocus={inputFocus}
              value={inputState.email_address.value}
              onChange={updateFormValues}
            />
            <div
              className={
                inputState.email_address.warning
                  ? "form-input-fw9"
                  : "form-input-fw9 hidden"
              }
            >
              Please enter a valid email address.
            </div>
          </div>

          <div className="form-input-ur2">
            <label for="email-input" className="dropdown-hq78">
              Confirm email
              <span className="dropdown-mm33" />
            </label>
            <input
              id="email_confirm"
              type="email"
              className={
                inputState.email_confirm.warning
                  ? "form-input-e45 incomplete"
                  : "form-input-e45"
              }
              name="email_confirm"
              aria-label="Confirm email"
              data-selector="email-address-field"
              inputmode="email"
              onFocus={inputFocus}
              value={inputState.email_confirm.value}
              onChange={updateFormValues}
            />
            <div
              className={
                inputState.email_confirm.warning
                  ? "form-input-fw9"
                  : "form-input-fw9 hidden"
              }
            >
              Emails do not match.
            </div>
          </div>

          <Dropdown
            optionsArray={optionsArray}
            activeOption={activeOption1}
            selectOption={setActiveOption1}
          />

          <div className="form-input-ur2">
            <label for="email-input" className="dropdown-hq78">
              Full name
              <span className="dropdown-mm33" />
            </label>
            <input
              id="full-name-input"
              type="text"
              className={
                inputState.full_name.warning
                  ? "form-input-e45 incomplete"
                  : "form-input-e45"
              }
              name="full_name"
              aria-label="Full name"
              onFocus={inputFocus}
              value={inputState.full_name.value}
              onChange={updateFormValues}
            />
            <div
              className={
                inputState.full_name.warning
                  ? "form-input-fw9"
                  : "form-input-fw9 hidden"
              }
            >
              Please enter a name.
            </div>
          </div>

          <div className="form-input-ur2">
            <label for="email-input" className="dropdown-hq78">
              Address line 1
              <span className="dropdown-mm33" />
            </label>
            <input
              id="address-line-1"
              type="text"
              className={
                inputState.address_line_1.warning
                  ? "form-input-e45 incomplete"
                  : "form-input-e45"
              }
              name="address_line_1"
              aria-label="Street address"
              onFocus={inputFocus}
              onChange={updateFormValues}
            />
            <div
              className={
                inputState.address_line_1.warning
                  ? "form-input-fw9"
                  : "form-input-fw9 hidden"
              }
            >
              Please enter address line 1.
            </div>
          </div>

          <div className="form-input-ur2">
            <label for="email-input" className="dropdown-hq78">
              Address line 2
              <span className="dropdown-mm33" />
            </label>
            <input
              id="address-line-2"
              type="text"
              className={
                inputState.address_line_2.warning
                  ? "form-input-e45 incomplete"
                  : "form-input-e45"
              }
              name="address_line_2"
              aria-label="Street address"
              onFocus={inputFocus}
              onChange={updateFormValues}
            />
            <div
              className={
                inputState.address_line_2.warning
                  ? "form-input-fw9"
                  : "form-input-fw9 hidden"
              }
            >
              Please enter address line 2.
            </div>
          </div>

          <div className="form-input-ur2">
            <label for="email-input" className="dropdown-hq78">
              Address line 3
            </label>
            <input
              id="address-line-3"
              type="text"
              className="form-input-e45"
              name="address_line_3"
              aria-label="Street address"
              onFocus={inputFocus}
              onChange={updateFormValues}
            />
          </div>

          <div className="form-input-ur2">
            <label for="email-input" className="dropdown-hq78">
              Post code / zip code
              <span className="dropdown-mm33" />
            </label>
            <input
              id="post-code-input"
              type="text"
              className={
                inputState.post_code.warning
                  ? "form-input-e45 incomplete"
                  : "form-input-e45"
              }
              name="post_code"
              aria-label="Post code / zip code"
              onFocus={inputFocus}
              onChange={updateFormValues}
            />
            <div
              className={
                inputState.post_code.warning
                  ? "form-input-fw9"
                  : "form-input-fw9 hidden"
              }
            >
              Please enter a post code / zip code.
            </div>
          </div>
        </div>

        <div className="form-input-ur3">
          <ActionButton
            message={"proceed to payment"}
            clickFunction={() => props.setBasketModalActive(true)}
            focusable={true}
            navigate="../payment-form"
          />
        </div>
      </form>
    </div>
  );
}

export default AddressForm;
