/**
 * Class for handling orders from a restaurant
 * @implements MainApp
 */
class RestaurantOrderHandler extends MainApp {
  /**
   * Class constructor
   */
  constructor() {
    super();
    this.orderAlerttObj = $("#orderAlert");
    this.objFormElem = $("#form-modal-order");
    this.orderAlerttObj.hide();

    this.initializeFormValidators();
  }

  /**
   * Set validators for the form fields
   */
  initializeFormValidators() {
    this.objFormElem.validate({
      rules: {
        orderQuantity: {
          required: true,
          digits: true
        }
      },
      messages: {
        orderQuantity: {
          required: "Quantity is required",
          digits: "Quantity must be a whole number"
        }
      }
    });
  }

  /**
   * Submit resturant orders to the order POST endpoint
   * @param {Object} post_data
   */
  submitOrderModalContents(post_data) {
    var submitOrderForm = this.restEndpoint + "orders";
    axios
      .post(submitOrderForm, post_data)
      .then(response => {
        this.orderAlerttObj.removeClass();
        this.orderAlerttObj.addClass("alert alert-success");
        this.orderAlerttObj.text("Order has been successfuly made.");
        this.orderAlerttObj.show();
        this.populateStats();
        if (this.obj_google_map) {
          var filterVal = PanelControls.getFilterValue();
          this.obj_google_map.loadMapData(filterVal);
        }
      })
      .catch(error => {
        this.orderAlerttObj.removeClass();
        this.orderAlerttObj.addClass("alert alert-danger");
        this.orderAlerttObj.text("Unable to place order.");
        this.orderAlerttObj.show();
      });
    return false;
  }

  /**
   * This method is used to initialize call for diplaying the modal interface
   * so that it will allow the users to place orders
   * @param {Int} restaurant_id
   * @param {Object} obj_google_map
   */
  initializeOrderModal(restaurant_id, obj_google_map) {
    let orderForm = this.restEndpoint + "restaurant_form/" + restaurant_id;
    this.obj_google_map = obj_google_map;

    axios.get(orderForm).then(response => {
      let obj_response_data = response.data.result;

      var orderModalWindow = $("#orderModal");

      var orderRestaurantObj = $("#orderRestaurant");

      var orderProductObj = $("#orderProduct");
      var orderCategoryObj = $("#orderCategory");
      var orderPriceObj = $("#orderPrice");
      var orderQuantityObj = $("#orderQuantity");

      var orderSubmitBtnObj = $("#orderBtnSubmit");

      orderModalWindow.modal();

      this.orderAlerttObj.hide();
      this.orderAlerttObj.removeClass();

      orderRestaurantObj.text(obj_response_data.restaurant.name);

      orderProductObj.val(obj_response_data.menu.name);
      orderCategoryObj.val(obj_response_data.category.name);
      orderPriceObj.val(obj_response_data.menu.price);

      orderSubmitBtnObj.bind("click", event => {
        var order_qty = parseInt(orderQuantityObj.val());

        if (this.objFormElem.valid()) {
          var post_data = {
            restaurant_id: obj_response_data.restaurant.id,
            menu_id: obj_response_data.menu.id,
            menu_last_price: obj_response_data.menu.price.toFixed(2),
            total_quantity: order_qty
          };
          this.submitOrderModalContents(post_data);
          orderQuantityObj.val(0);
        }
        event.preventDefault();
        return false;
      });
    });
  }
}
