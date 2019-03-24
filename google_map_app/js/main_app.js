/**
 * Main App Base Class for the sample application
 */
class MainApp {
  /**
   * Class constructor
   */
  constructor() {
    this.restEndpoint = "http://127.0.0.1:5000/api/";
    //this.restEndpoint = "http://192.168.99.100:5000/api/";
  }

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
