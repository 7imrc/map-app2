import React, { Component } from 'react';
import escapeRegExp from 'escape-string-regexp';
import './App.css';
import Header from './components/Header';
import SearchList from './components/SearchList';
import Map from './components/Map';
import Footer from './components/Footer';


class App extends Component {

  // Set the states for the app.
  state = {
      venues: [],
      markers: [],
      filteredSearch: [],
      selectedMarkerIndex: '',
      zoom: 12,
      location: { lat: 50.8197675, lng: -1.0879769 },
      icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
      query: '',
      filteredVenues: []
  }

  componentDidMount() {
      // Get the external data.
      this.fourSquareLoad();
    }

    // Fetch the data from FourSquare to populate the map.
    fourSquareLoad = () => {
      fetch ("https://api.foursquare.com/v2/venues/search?ll=50.8197675,-1.0879769&intent=browse&radius=30000&query=museum&client_id=HAXM4EPTKFN0LVOHYTA312KBRVX1FXE0SXVFUYCJJKTCYL0J&client_secret=IJC5CLYWJ4R4GDYSUGH3TJ24DP4JAWBKSC2A0GNXJSBVDVCO&v=20180824")
          .then( (response) => response.json())
          .then( (response) => {
            // Error checking to see if received data is in correct format
            //console.log(response.response.venues)
            return response
          })
          // Pass the received data in the correct format to be stored in the empty
          // venues array in state.
          .then( (data) => {
            this.setState({
              venues: data.response.venues,
              markers: data.response.venues,
              filteredVenues: data.response.venues
            })
          })
          // Error checking, log the contents of the venues array, to compare.
          .then( () => {
            //console.log(this.state.venues)
          })
          // If unable to obtain data from Foursquare, alert the user.
          .catch ( (error) => {
            alert("There has been a problem trying to get the locations data from Foursquare......please try again");
          })
    }

//--- Mouse events in map ---//

    // Action to take on clicking a marker
    whenMarkerClicked = (index, latitude, longitude, e) => {
      //console.log("This marker has been clicked.....", index);


      this.setState({
        selectedMarkerIndex: index,
        zoom: 18,
        location: { lat: latitude, lng: longitude },
        //icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
      })
      //console.log(latitude,'     ',longitude);
      //console.log('selectedMarkerIndex......', this.state.selectedMarkerIndex);
      //window.map.setZoom(this.state.zoom);
    }

    // Action to take when the infowindow is closed.
    whenInfoWindowClosed = () => {
      this.setState({
        zoom: 12,
        location: { lat: 50.8197675, lng: -1.0879769 },
        //icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
        selectedMarkerIndex: ''
      })
    }


    // Update the query state as user enters text in input field.
    updateQuery = (query) => {
      this.setState({
        query: query
      })
      this.filterMarkers(query);
    }


    // Filter the markers in the search list to those matching locations for
    // text entered in the input field.  Code based on that in Udacity lessons.

    // The bug of a lag with markers, was caused by me using this.state.query
    // within the if statement below. It needs to just be 'query' as passed in!
    // Many hours of trying many methods to fix setState asynchronisity, and
    // it was this simple fix!
    filterMarkers = (query) => {
      let showingMarkers;
      if (query) {
        const match = new RegExp(escapeRegExp(query),'i');
        showingMarkers = this.state.markers.filter( (venue) => match.test(venue.name));
        console.log('filtered.......',showingMarkers);

      } else {
        showingMarkers = this.state.markers;
        console.log('unfiltered.......',showingMarkers);
      }
      // Put the filtered markers into an array.
      this.setState({
        filteredVenues: showingMarkers
        //filteredVenues: this.fixAsync(showingMarkers)
      }), () => this.forceUpdate();
      // From https://stackoverflow.com/questions/36071350/update-state-with-onchange-event-have-a-delay-character
      // This answer does not fix the lag
      //this.state.filteredVenues = showingMarkers; this.forceUpdate();
    }

    // This is a test to see if I can fix the async issue with the delay in
    // the markers updating.
    fixAsync = (showingMarkers) => {
      return(prevState, currProps) => {
        return {
          ...prevState, filteredVenues: showingMarkers
        };
      };
    }
      //this.setState({ filteredSearch: showingVenues});
      //console.log('this is filterMarkers');
      //console.log('showingVenues.....', showingVenues);
      //if(query) {
      //  this.setState({
      //    markers: showingVenues
      //  })
      //}
    //  {/*if (query) {
    //    this.setState(prevState => ({
    //      markers: [...prevState.markers, showingVenues]
    //    }))
    //  }
    //  console.log(this.state.markers);
    //  */}
      //this.setState({
      //  filteredVenues: showingVenues
      //})
    //}
    // Update the filteredVenues array in this state, from the local one in
    // Searchlist.  Code based on watching NetNinja web tutorial at:
    //
    //addFilteredVenues = (filteredVenues) => {
    //  let updateFilteredVenues = [...this.state.filteredVenues, filteredVenues];
    //  this.setState({
    //    filteredVenues: filteredVenues
    //  })
    //}

  render() {
    //console.log('markers array....',this.state.markers);
    //this.filterMarkers();
    return (
      <div className="App">
        <Header />
        <SearchList
          venues = {this.state.venues}
          markers = {this.state.markers}
          whenMarkerClicked = {this.whenMarkerClicked}
          //filterMarkers = {this.filterMarkers}
          //addFilteredVenues = {this.addFilteredVenues}
          query = {this.state.query}
          updateQuery = {this.updateQuery}
        />
        <Map
          googleMapURL = "https://maps.googleapis.com/maps/api/js?key=AIzaSyBRBUF2UVab_IvfyF7rJPQNzWaF8fs-dN8&v=3.exp&libraries=geometry,drawing,places"
          loadingElement = {<div style={{ height: `100%` }} />}
          containerElement = {<div style={{ height: 100+`%`, width: `400px`, float: 'right' }} />}
          mapElement = {<div style={{ height: `100%` }} />}
          venues = {this.state.venues}
          markers = {this.state.markers}
          whenMarkerClicked = {this.whenMarkerClicked}
          selectedMarkerIndex = {this.state.selectedMarkerIndex}
          zoom = {this.state.zoom}
          location = {this.state.location}
          whenInfoWindowClosed = {this.whenInfoWindowClosed}
          icon = {this.state.icon}
          filteredVenues = {this.state.filteredVenues}
        />
        <Footer />
      </div>
    );
  }
}

export default App;
