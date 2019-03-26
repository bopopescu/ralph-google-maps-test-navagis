/**
 * Class for handling restaurant info
 * @implements MainApp
 */
class RestaurantEditHandler extends MainApp {
  /**
   * Class constructor
   */
  constructor() {
    super();
    this.orderAlerttObj = $("#restaurantAlert");
    this.objFormElem = $("#form-modal-restaurant");
    this.orderAlerttObj.hide();
    this.obj_google_map = null;

    this.initializeFormValidators();
  }

  /**
   * Set validators for the form fields
   */
  initializeFormValidators() {
    this.objFormElem.validate({
      rules: {
        restaurantName: "required",
        restaurantAddress: "required",
        restaurantMenuPrice: {
          required: true,
          number: true
        },
        restaurantMenuName: "required"
      },
      messages: {
        restaurantName: {
          required: "Restaurant name is required"
        },
        restaurantAddress: {
          required: "Restaurant address is required"
        },
        restaurantMenuPrice: {
          required: "Restaurant menu price is required",
          number: "Restaurant menu price be numeric"
        }
      }
    });
  }

  /**
   * Submit resturant details to the restaurant POST endpoint
   * @param {Object} post_data
   */
  submitRestaurantModalContents(post_data) {
    var submitRestaurantForm = this.restEndpoint + "restaurants";
    axios
      .post(submitRestaurantForm, post_data)
      .then(response => {
        this.orderAlerttObj.removeClass();
        this.orderAlerttObj.addClass("alert alert-success");
        this.orderAlerttObj.text(
          "A new restaurant has been successfuly added."
        );
        this.orderAlerttObj.show();
        this.populateStats();
        this.objFormElem.trigger("reset");
        if (this.obj_google_map) {
          var filterVal = PanelControls.getFilterValue();
          this.obj_google_map.loadMapData(filterVal);
        }
      })
      .catch(error => {
        console.log("test");
        this.orderAlerttObj.removeClass();
        this.orderAlerttObj.addClass("alert alert-danger");
        this.orderAlerttObj.text("Unable add new restaurant.");
        this.orderAlerttObj.show();
      });
    return false;
  }

  /**
   * Delete the restaurant along with its related information permanently
   * @param {Integer} restaurant_id
   * @param {Object} obj_google_map
   */
  delete(restaurant_id, obj_google_map) {
    var deleteRestaurant = this.restEndpoint + "restaurants/" + restaurant_id;
    axios.delete(deleteRestaurant, {}).then(response => {
      alert("Restaurant and its related informations has been deleted");
      if (obj_google_map) {
        var filterVal = PanelControls.getFilterValue();
        obj_google_map.loadMapData(filterVal);
      }
    });
  }

  /**
   * This method is used to initialize call for diplaying the modal interface
   * so that it will allow the users to add / edit restaurant details
   * @param {Object} obj_coordinates
   * @param {Object} obj_google_map
   */
  initializeRestaurantEditModal(obj_coordinates, obj_google_map) {
    let categoryEndpoint = this.restEndpoint + "categories";
    this.obj_google_map = obj_google_map;
    axios.get(categoryEndpoint).then(response => {
      this.orderAlerttObj.hide();
      this.orderAlerttObj.removeClass();

      var objRestaurantName = $("#restaurantName");
      var objRestaurantAddress = $("#restaurantAddress");
      var objRestaurantCategory = $("#restaurantCategory");
      var objRestaurantMenuName = $("#restaurantMenuName");
      var objRestaurantMenuPrice = $("#restaurantMenuPrice");
      var objRestaurantBtnSubmit = $("#restaurantBtnSubmit");

      objRestaurantCategory.children("option").remove();
      response.data.result.forEach(category_data => {
        objRestaurantCategory.append(
          $("<option>", {
            value: category_data.id,
            text: category_data.name
          })
        );
      });

      objRestaurantBtnSubmit.bind("click", event => {
        if (this.objFormElem.valid()) {
          var priceVal = parseFloat(objRestaurantMenuPrice.val());
          var post_data = {
            restaurant: {
              name: objRestaurantName.val(),
              address: objRestaurantAddress.val(),
              lng: obj_coordinates.lng,
              lat: obj_coordinates.lat,
              restaurant_category_id: parseInt(objRestaurantCategory.val())
            },
            menu: {
              name: objRestaurantMenuName.val(),
              price: priceVal.toFixed(2)
            }
          };
          this.submitRestaurantModalContents(post_data);
        }
        event.preventDefault();
        return false;
      });
    });
  }
}
