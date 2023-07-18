import mapSearch from "./mapSearch";
import locationSearch from "./locationSearch";


// updates search results in response to the map moving (either when there is a drag or zoom event )
const updatePageSearch = () => {



let searchResults



    searchResults = locationSearch(false, "London, United Kingdom", false, false, false)


return searchResults

}

export default updatePageSearch
