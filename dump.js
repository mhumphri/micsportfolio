style={{display: block; height: 18px; width: 18px; fill: currentcolor;"



<svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="style=linear">
<g id="warning-circle">
<path id="vector" d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="#000000" stroke-width="1.5"/>
<path id="vector_2" d="M12 7V14.1047" stroke="#000000" stroke-width="1.5" stroke-linecap="round"/>
<path id="ellipse" d="M12 17H12.01" stroke="#000000" stroke-width="2" stroke-linecap="round"/>
</g>
</g>
</svg>


return (
  <>
  {if (screenWidth < 650) {
    <>
    <Header largeView={true}/>
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
    </>
  }
  else if (screenWidth < 900) {
    <>
      <Header largeView={true} productPage={true} />
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
    </>
  }
  else {
    <>
      <Header largeView={true} productPage={true} />
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
    </>
}}

  </>

);


////////////

if (screenWidth < 650) {
  return (
    <>
      <Header largeView={true}/>
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
    </>
  );
} else if (screenWidth < 900) {
  return (
    <>
      <Header largeView={true} productPage={true} />
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
    </>
  );
} else {
  return (
    <>
      <Header largeView={true} productPage={true} />
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
    </>
  );
}
