/**
 * Main App Base Class for the sample application
 */
class MainApp {
  /**
   * Class constructor
   */
  constructor() {}

  /**
   * Populate stats table from backend data
   */
  populateStats() {
    let ordersEndpoint = this.restEndpoint + "orders";
    axios.get(ordersEndpoint).then(response => {
      var objStatTotalRevenue = $("#stat_total_revenue");
      var objStatTotalRestaurants = $("#stat_total_restaurants");
      var objStatTopSeller = $("#stat_top_seller");
      var objStatTopSellerRevenue = $("#stat_top_seller_revenue");

      var response_data = response.data.result;

      objStatTotalRevenue.text(response_data.total_revenue.toFixed(2));
      objStatTotalRestaurants.text(response_data.total_restaurants);
      objStatTopSeller.text(response_data.top_seller);
      objStatTopSellerRevenue.text(response_data.total_revenue.toFixed(2));
    });
  }
}
