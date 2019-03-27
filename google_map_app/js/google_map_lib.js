/**
 * Class for handling google map API library
 * @implements MainApp
 */
class GoogleMapLib extends MainApp {
  constructor(
    objRestaurantOrderHandler = null,
    objRestaurantEditHandler = null
  ) {
    super();
    // google map additional services
    this.directionsService = new google.maps.DirectionsService();
    this.directionsDisplay = new google.maps.DirectionsRenderer();

    this.objRestaurantOrderHandler = objRestaurantOrderHandler;
    this.objRestaurantEditHandler = objRestaurantEditHandler;

    // Cebu City hall default location
    // this.cebuDefaultPos = {
    //   lat: 10.292876,
    //   lng: 123.8994493
    // };
    this.cebuDefaultPos = {
      lat: 10.318385,
      lng: 123.787827
    };

    this.markers = [];

    // Cebu reference LatLng object
    this.cebuCityLtLng = new google.maps.LatLng(
      this.cebuDefaultPos.lat,
      this.cebuDefaultPos.lng
    );

    // Create map object
    this._mapObj = new google.maps.Map(document.getElementById("map"), {
      center: new google.maps.LatLng(
        this.cebuDefaultPos.lat,
        this.cebuDefaultPos.lng
      ),
      zoom: 10
    });

    this.placesService = new google.maps.places.PlacesService(this._mapObj);
    // var searchRequest = {
    //   query: "restaurant",
    //   fields: ["name"],
    //   locationBias: {
    //     radius: 10000,
    //     center: {
    //       lat: 10.3790718,
    //       lng: 123.7062055
    //     }
    //   }
    // };

    /*
    this.currentPos = this.getCurrentPos();
    this.activeWindow = null;

    this.filterCategory = 0;

    this.markers = [];
    this.rectangle = null;

    this.map.addListener("click", event => {
      $("#restaurantModal").modal();

      var obj_coordinates = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng()
      };

      this.objRestaurantEditHandler.initializeRestaurantEditModal(
        obj_coordinates,
        this
      );
    });
    */

    this.loadMapData();
  }

  /**
   * Remove rectangle shape from map
   */
  removeRectangle() {
    if (this.rectangle) {
      this.rectangle.setMap(null);
      this.rectangle = null;
    }
  }

  /**
   * Render rectangle shape inside the map
   * @param {*} objClickCoordinates
   */
  renderRectangle(objClickCoordinates = null) {
    this.removeRectangle();

    if (!objClickCoordinates) {
      var objClickCoordinates = this.cebuDefaultPos;
    }

    var rectangleBounds = {
      north: objClickCoordinates.lat + 0.07,
      south: objClickCoordinates.lat - 0.07,
      east: objClickCoordinates.lng + 0.07,
      west: objClickCoordinates.lng - 0.07
    };

    this.rectangle = new google.maps.Rectangle({
      strokeColor: "#0038b8",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#0038b8",
      fillOpacity: 0.35,
      map: this.map,
      bounds: rectangleBounds,
      draggable: true,
      editable: true
    });

    this.renderMarkersInShape();

    google.maps.event.addListener(this.rectangle, "dragend", () => {
      this.renderMarkersInShape();
    });

    google.maps.event.addListener(this.rectangle, "bounds_changed", () => {
      this.renderMarkersInShape();
    });
  }

  /**
   * Displays the makers inside the rectangle shape inside the map
   */
  renderMarkersInShape() {
    var bounds = this.rectangle.getBounds();

    var flt_north = bounds.getNorthEast().lat();
    var flt_south = bounds.getSouthWest().lat();
    var flt_east = bounds.getNorthEast().lng();
    var flt_west = bounds.getSouthWest().lng();

    this.clearMarkers();

    this.markers.forEach((marker, idx) => {
      var marker_pos = marker.getPosition();
      if (idx >= 0) {
        if (
          marker_pos.lat() <= flt_north &&
          marker_pos.lat() >= flt_south &&
          (marker_pos.lng() >= flt_west && marker_pos.lng() <= flt_east)
        ) {
          marker.setMap(this.map);
        }
      }
    });
  }

  /**
   * Map mapp object getter
   */
  get map() {
    return this._mapObj;
  }

  /**
   * Gets the location of the device using the navigator geolocation.
   * If the navigator has problem locating the device coordinates, then it will return
   * the coordinate from the cebu city hall
   *
   * @return {Object} location
   */
  getCurrentPos() {
    if (navigator.geolocation) {
      var currentPos = navigator.geolocation.getCurrentPosition(
        function(position) {
          var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          return pos;
        },
        () => {
          // return pre-set position if geolocation was unable to get the current coordinates
          return this.cebuDefaultPos;
        }
      );
    }
    return this.cebuDefaultPos;
  }

  /**
   * This will render the routes in the map from point A to point B using the google map API's
   * directions service and diretions display services
   * @param {*} objCoordinates
   */
  getDirections(objCoordinates) {
    var directionsService = this.directionsService;
    var directionsDisplay = this.directionsDisplay;

    directionsDisplay.setMap(null);
    directionsDisplay.setMap(this._mapObj);
    directionsDisplay.setDirections({ routes: [] });

    var obj_current_pos = this.getCurrentPos();
    var str_origin = obj_current_pos.lat + ", " + obj_current_pos.lng;
    var str_dest = objCoordinates.lat + ", " + objCoordinates.lng;

    directionsService.route(
      {
        origin: str_origin,
        destination: str_dest,
        travelMode: "DRIVING"
      },
      function(response, status) {
        if (status === "OK") {
          directionsDisplay.setDirections(response);
        } else {
          window.alert("Directions request failed due to " + status);
        }
      }
    );
    return true;
  }

  /**
   * Wrap info object inside a div col with md-12 class
   * @param {Object} objToWrap
   */
  wrapDivInfoContainer(objToWrap) {
    var objContainerDiv = document.createElement("div");
    objContainerDiv.className = "col-md-12";
    objContainerDiv.append(objToWrap);
    return objContainerDiv;
  }

  /**
   * Create contents inside the marker's info balloon object which will be shown
   * when a marke is clicked
   * @param {*} markerData
   * @return {!Object} InfoWindow
   */
  createInfoWindow(markerData, category = "n/a") {
    console.log(markerData);

    var requestDetails = {
      placeId: markerData.place_id,
      fields: ["name", "formatted_address", "types"]
    };

    var infoWindow = new google.maps.InfoWindow();

    this.placesService.getDetails(requestDetails, response => {
      var infoDialog = document.createElement("div");
      infoDialog.className = "row";

      // create name elem and append
      var mapLabel = document.createElement("h3");
      mapLabel.textContent = response.name;
      infoDialog.append(this.wrapDivInfoContainer(mapLabel));

      // create address elem and append
      var addressElem = document.createElement("p");
      addressElem.className = "mt-4";
      addressElem.textContent = response.formatted_address;
      infoDialog.append(this.wrapDivInfoContainer(addressElem));

      // create category name elem and append
      var categoryNameElem = document.createElement("span");
      addressElem.className = "mt-4";
      categoryNameElem.textContent = "Category:  " + category;
      infoDialog.append(this.wrapDivInfoContainer(categoryNameElem));

      // create rating elem elem and append
      var userRating = document.createElement("div");
      userRating.className = "mt-4 font-weight-bold";
      userRating.textContent = "Rating: " + markerData.rating;
      infoDialog.append(this.wrapDivInfoContainer(userRating));

      // create total visit elem and append
      var totalVisitElem = document.createElement("div");
      totalVisitElem.className = "mt-4 font-weight-bold";
      totalVisitElem.textContent =
        "Total Visit: " + markerData.user_ratings_total;
      infoDialog.append(this.wrapDivInfoContainer(totalVisitElem));

      // create control footer
      var footerElemContainer = document.createElement("div");
      footerElemContainer.className = "mt-3";

      // Create get directions button for info window
      var btnGetDirections = document.createElement("button");
      btnGetDirections.textContent = "Get Directions";
      btnGetDirections.setAttribute("class", "btn btn-primary btn-sm mr-3");

      btnGetDirections.addEventListener("click", () => {
        this.getDirections({
          lat: markerData.geometry.location.lat(),
          lng: markerData.geometry.location.lng()
        });
        this.activeWindow.close();
      });

      footerElemContainer.appendChild(btnGetDirections);

      infoDialog.append(this.wrapDivInfoContainer(footerElemContainer));

      // set the dialog contents to info window
      infoWindow.setContent(infoDialog);
    });
    return infoWindow;
  }

  /**
   * Clear all markers from the map.
   * If deletePermanenty is set to true, then it will completely delete all the markers from the
   * memory
   * @param {*} deletePermanently
   */
  clearMarkers(deletePermanently = false) {
    if (this.markers.length > 0) {
      this.markers.forEach(function(markerObj) {
        markerObj.setMap(null);
      });
    }

    if (deletePermanently) {
      this.markers = [];
    }

    return true;
  }

  /**
   * Show all markers that where hidden temporarily from the map
   */
  showAllMarkers() {
    if (this.markers.length > 0) {
      this.markers.forEach(markerObj => {
        markerObj.setMap(this.map);
      });
    }
  }

  /**
   * Load all marker data from the backend which will be rendered in the map object
   * @param {*} passedCategory
   */
  loadMapData(passedCategory = 0) {
    var keywords = ["cafe", "japanese", "italian"];

    var searchRequest = {
      location: this.cebuCityLtLng,
      radius: 10000,
      keyword: "steak",
      type: ["restaurant"]
    };

    this.clearMarkers(true);
    this.markers.forEach(function(markerObj, markerId) {
      markerObj.setMap(null);
    });

    this.placesService.nearbySearch(searchRequest, (results, status) => {
      console.log(results.length);

      results.forEach((restaurantRes, restaurantIdx) => {
        // Delete Previous Markers

        if (this.rectangle) {
          this.removeRectangle();
        }

        var marker = new google.maps.Marker({
          map: this.map,
          position: restaurantRes.geometry.location
        });

        this.markers.push(marker);
        this.markers.forEach(markerObj => {
          markerObj.setMap(this.map);
        });

        var infoWindow = this.createInfoWindow(restaurantRes);

        marker.addListener("click", () => {
          if (this.activeWindow) {
            this.directionsDisplay.setMap(null);
            this.activeWindow.close();
          }
          infoWindow.open(this.map, marker);
          this.activeWindow = infoWindow;
        });
      });
    });
  }
}

/**
 * This method is called when initalizing the google map
 */
function initializeCustomLib() {
  // var restaurantsEndpoint =
  //   "https://maps.googleapis.com/maps/api/place/textsearch/json?";
  // restaurantsEndpoint +=
  //   "query=restaurants&location=10.3790718,123.7062055&radius=10000&key=AIzaSyBkmsHwd8Z0bdIDg1Q41qBS9hE1tl3kNek";
  // var restRequest = gapi.client.request({
  //   path: restaurantsEndpoint
  //   //'params': {'sortOrder': 'LAST_NAME_ASCENDING'}
  // });
  // console.log(restRequest);
  //alert("callback");
  // gapi.load("auth2", function() {
  //   // Library loaded.
  // });
  // var restRequest = gapi.client.request({
  //   path: "https://people.googleapis.com/v1/people/me/connections",
  //   params: { sortOrder: "LAST_NAME_ASCENDING" }
  // });
  // alert(restRequest);
  // var objRestaurantOrderHandler = new RestaurantOrderHandler();
  // var objRestaurantEditHandler = new RestaurantEditHandler();
  var objGoogleMapLib = new GoogleMapLib();
  // var objPanelControls = new PanelControls(objGoogleMapLib);
  // objPanelControls.initializeDrawRectangleButton();
}
