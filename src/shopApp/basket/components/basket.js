import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../header/components/header";
import Dropdown from "../../widgets/components/dropdown";
import ActionButton from "../../widgets/components/actionButton";
import RemoveItemModal from "../../modals/components/removeItemModal";
import EditItemModal from "../../modals/components/editItemModal";

import "../styles/basket.css";

const optionsArray = [
  { key: "a0", label: "1" },
  { key: "a1", label: "2" },
  { key: "a2", label: "3" },
  { key: "a3", label: "4" },
  { key: "a4", label: "5" },
];

const itemArray = [1, 2, 3];

function Basket() {
  // viewport width (stored in redux)
  const screenWidth = useSelector((state) => state.deviceData.screenWidth);
  // boolean controlling state of remove item modal
  const [removeItemModalActive, setRemoveItemModalActive] = useState();
  // boolean controlling state of remove item modal
  const [editItemModalActive, setEditItemModalActive] = useState();

  const updateQuantity = () => {
    console.log("updateQuantity");
  };

  const totalsTable = (mobileView) => {
    return [
      <div className={mobileView ? "basket-kd5" : "basket-kd4"} >
        <div>
          <table className="basket-xn6">
            <tbody className="basket-gt2">
              <tr>
                <th className="basket-ar6" >
                  Items (3)
                </th>
                <td className="basket-ar6 rhs">€9.88</td>
              </tr>
            {mobileView ?
              <tr>
                <th className="basket-ar6">Delivery <span className="basket-gw7">(To <button className="basket-pw1">Italy</button>)</span></th>
                <td className="basket-ar6 rhs">€9.88</td>
              </tr>
 :
               <>
              <tr>
                <th className="basket-ar6 reduced-padding">Delivery</th>
                <td className="basket-ar6 reduced-padding rhs">€9.88</td>
              </tr>
              <tr>
                <td className="basket-ar6" colspan="2"><span className="basket-gw7">(To <button className="basket-pw1">Italy</button>)</span></td>
            </tr>
            </> }
              <tr className="basket-nn1" />
              <tr>
                <th className="basket-ar6 total">Total</th>
                <td className="basket-ar6 rhs total">€9.88</td>
              </tr>
            </tbody>
          </table>
          <div className={mobileView ? "basket-ne9 mobile-view" : "basket-ne9"}>
            <ActionButton message="Checkout" navigate="../address-form" />
          </div>
        </div>
      </div>,
    ];
  };

  const editDeleteButtons =  [
      <div className="basket-hs3">
        <div className="basket-ha1">
          <button className="basket-hd4" onClick={() => setRemoveItemModalActive(true)}>
            <svg
              width="20px"
              height="20px"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 11V17"
                stroke="#000000"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M14 11V17"
                stroke="#000000"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M4 7H20"
                stroke="#000000"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M6 7H12H18V18C18 19.6569 16.6569 21 15 21H9C7.34315 21 6 19.6569 6 18V7Z"
                stroke="#000000"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z"
                stroke="#000000"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <span className="basket-bd6">remove</span>
          </button>
          <button className="basket-hd4" onClick={() => setEditItemModalActive(true)}>
            <svg
              width="18px"
              height="18px"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="m3.99 16.854-1.314 3.504a.75.75 0 0 0 .966.965l3.503-1.314a3 3 0 0 0 1.068-.687L18.36 9.175s-.354-1.061-1.414-2.122c-1.06-1.06-2.122-1.414-2.122-1.414L4.677 15.786a3 3 0 0 0-.687 1.068zm12.249-12.63 1.383-1.383c.248-.248.579-.406.925-.348.487.08 1.232.322 1.934 1.025.703.703.945 1.447 1.025 1.934.058.346-.1.677-.348.925L19.774 7.76s-.353-1.06-1.414-2.12c-1.06-1.062-2.121-1.415-2.121-1.415z"
                fill="#000000"
              />
            </svg>
            <span className="basket-bd6">edit</span>
          </button>
        </div>
      </div>,
    ];

  const productDetails = (smallView) => {
    const productDescription = [
      <h1 className="basket-zu7">
        Star mark stickers in dots and squares for planners and journals, matte
        transparent functional stickers, icon stickers, multi colours, UK
      </h1>,
    ];

    const priceQuantity = (smallView) => {
      return [
        <div className="basket-dp6">
          <div className="product-summary-dh2">£2.80</div>
          <div className={smallView ? "basket-fd2 small-view" : "basket-fd2"}>
            <span
              className={smallView ? "basket-hq1 small-view" : "basket-hq1"}
            >
              Quantity: 3
            </span>
          </div>
        </div>,
      ];
    };

    const selectedOptions = [
      <div className="basket-gh3">
        {[1, 2, 3].map((x) => (
          <div key={x} className="basket-mh4">
            size: A4 binder
          </div>
        ))}
      </div>,
    ];

    return [
      <div className={smallView ? "basket-vl2 small-view" : "basket-vl2"}>
        <div className={smallView ? "basket-cb5" : ""}>
          {productDescription}
          {selectedOptions}
        </div>
        <div className={smallView ? "basket-px2 small-view" : "basket-px2"}>
          {priceQuantity("smallView")}
          <div className={smallView ? "basket-dp6" : "basket-dp6 lhs-margin" }>{editDeleteButtons}</div>
        </div>
      </div>,
    ];
  };

  const getModalContent = (screenWidth) => {
    if (screenWidth < 650) {
      return (
          <main className="shop-app-te2">
            {totalsTable("mobileView")}
            <div className="basket-bs8 mobile-view">
              <div className="basket-lk5">
                {itemArray.map((x, i, itemArray) => (
                  <>
                    <div className="basket-js4">
                      <div className="basket-dj8">
                        <img
                          className="basket-ks9"
                          src="https://i.etsystatic.com/34623276/c/2303/1831/246/127/il/db2bf5/4065269795/il_340x270.4065269795_928b.jpg"
                        />
                      </div>
                      {productDetails("mobile")}
                    </div>
                    <div
                      className={
                        i !== itemArray.length - 1 ? "basket-nn1 small-view" : ""
                      }
                    />
                  </>
                ))}
              </div>
            </div>
          </main>
      );
    } else if (screenWidth < 900) {
      return (
          <main className="shop-app-te2">
            <div className="basket-bs8">
              <div className="basket-lk2">
                {itemArray.map((x, i, itemArray) => (
                  <>
                    <div className="basket-js4">
                      <div className="basket-dj8">
                        <img
                          className="basket-ks9"
                          src="https://i.etsystatic.com/34623276/c/2303/1831/246/127/il/db2bf5/4065269795/il_340x270.4065269795_928b.jpg"
                        />
                      </div>
                      {productDetails("small")}
                    </div>
                    <div
                      className={
                        i !== itemArray.length - 1 ? "basket-nn1 small-view" : ""
                      }
                    />
                  </>
                ))}
              </div>
              {totalsTable()}
            </div>
          </main>
      );
    } else {
      return (
          <main className="shop-app-te2">
            <div className="basket-bs8">
              <div className="basket-lk1">
                {itemArray.map((x, i, itemArray) => (
                  <>
                    <div className="basket-js3">
                      <div className="basket-dj9">
                        <img
                          className="basket-ks8"
                          src="https://i.etsystatic.com/34623276/c/2303/1831/246/127/il/db2bf5/4065269795/il_340x270.4065269795_928b.jpg"
                        />
                      </div>
                      {productDetails()}
                    </div>
                    <div className={
                      i !== itemArray.length - 1 ? "basket-nn1 small-view" : ""
                    } />
                  </>
                ))}
              </div>
              {totalsTable()}
            </div>
          </main>
      );
    }
  }


    return (
      <>
        <Header largeView={true} productPage={true} />
        {getModalContent(screenWidth)}
        { removeItemModalActive ?
        <RemoveItemModal setBasketModalActive={setRemoveItemModalActive} /> : null
        }
        { editItemModalActive ?
        <EditItemModal setBasketModalActive={setEditItemModalActive} /> : null
        }
      </>
    );

}

export default Basket;
