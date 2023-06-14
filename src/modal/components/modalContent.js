const modalContent = {
  hotelApp: {
    name: "Hotel App",
    description: ['Hotel app is a mock up search page and server for a hotel booking app. The search page displays a list of hotels and a map with corresponding markers. Users can search hotels by entering a location or by navigating the map and select them either by clicking on a result from a list or by clicking on a map marker. Over 4000 city and country options are available which can be filtered using a text input and dropdown menu.', 'The "server" component of the app uses a range of data (geographic, polulation and economic) to return an array of hotel data which includes location, prices, photos and map coordinates. Javascript promises are used to communcate between the front end and back end components.'],
      libraries: ['React', 'Redux', 'Google Maps Javascript API', 'turf (geospatial library)',],
      githubHref: "https://github.com/mhumphri/micsportfolio",
  },
  widgets: {
    name: "Widgets",
    description: ['Widgets contains a set of rangeslider inputs. The simple slider is a one-handled slider which returns values 0 to 100 when moving along a track. Further functionality has been added by restricting number selection to discrete intervals, adding a second handle which allows the user to select both ends of the range and adding a bar chart which can be used to show the underlying data distribution.'],
    libraries: ['React'],
    githubHref: "https://github.com/mhumphri/micsportfolio",
  },
  datepickers: {
    name: "Datepickers",
    description: ['Datepickers contains a set of responsive datepicker inputs. 3 different views are included: (1) vertical axis picker; (2) single-panel horizontal picker (best for mobile screens) and double-panel horizontal picker. Calendar data is generated internally within the component and manipulated and queried using Day.js.'],
    libraries: ['React', 'Day.js'],
    githubHref: "https://github.com/mhumphri/micsportfolio",
  },


}

export default modalContent;
