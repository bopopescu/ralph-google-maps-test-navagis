/**
 * Class for handling app panel controls
 * @implements MainApp
 */
class PanelControls extends MainApp {
  /**
   * Class constructor
   */
  constructor(objGoogleMapLib = null) {
    super();
    this.objGoogleMapLib = objGoogleMapLib;
    this.objFrmFilter = $("#frmSelFoodCategory");
    this.objBtnRenderRectangle = $("#btnRenderRectangle");
    this.objBtnRemoveRectangle = $("#btnRemoveRectangle");

    this.initializeFormFilterControl();
    this.initializeDrawRectangleButton();
  }

  /**
   * Initializes filter behavior
   */
  initializeFormFilterControl() {
    $(".specialty-filter").bind("click", obj => {
      var filterList = [];
      $.each(
        $(".specialty-filter:checkbox:checked"),
        (idx, objCheckedFilter) => {
          filterList.push($(objCheckedFilter).val());
        }
      );
      this.objGoogleMapLib.renderMarkersPerSpecialty(filterList);
      this.updateStatistics();
    });
  }

  /**
   * Initializes render rectangle behavior
   */
  initializeDrawRectangleButton() {
    this.objBtnRenderRectangle.bind("click", obj => {
      this.objGoogleMapLib.renderRectangle();
    });
    this.objBtnRemoveRectangle.bind("click", obj => {
      this.objGoogleMapLib.removeRectangle();
    });
  }

  /**
   * Update statistics table
   */
  updateStatistics() {
    var total_restaurants = 0;
    var total_visits = 0;
    var top_restaurant_rating = 0;
    var top_restaurant_visit = 0;
    var top_restaurant = "n/a";
    var visit_average = 0;

    var objTotalRestaurants = $("#stat_total_restaurants");
    var objTotalVisits = $("#stat_total_visits");
    var objTopRestaurant = $("#stat_top_retaurant");
    var objTopRestaurantRating = $("#stat_top_restaurant_rating");
    var objAverageVisit = $("#stat_visit_average");

    this.objGoogleMapLib.activeMarkers.forEach((markerObj, idx) => {
      if (idx == 0) {
        top_restaurant_rating = parseFloat(markerObj.rating);
        top_restaurant = markerObj.name;
      }

      total_visits += parseInt(markerObj.visits);

      if (markerObj.visits > top_restaurant_visit) {
        top_restaurant_visit = markerObj.visits;
      }

      if (parseFloat(markerObj.rating) > top_restaurant_rating) {
        top_restaurant = markerObj.name;
        top_restaurant_rating = parseFloat(markerObj.rating);
      }
      total_restaurants += 1;
    });

    visit_average = total_visits / total_restaurants;

    objTotalRestaurants.text(total_restaurants);
    objTotalVisits.text(total_visits.toLocaleString());
    objTopRestaurant.text(top_restaurant);
    objTopRestaurantRating.text(top_restaurant_rating);
    objAverageVisit.text(visit_average.toFixed(2));
  }
}
