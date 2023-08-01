const navigateToProperty = () => {
  const href = getHref(props.hotelData.hotelDataKey)
   navigate(href);
   dispatch(updateNavigateAway(true))
}

()=>navigate("./../basket")
