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
    this.populateStats();
  }

  /**
   * Initializes filter behavior
   */
  initializeFormFilterControl() {
    this.objFrmFilter.bind("change", obj => {
      var sel_category_id = parseInt(obj.target.value);
      this.objGoogleMapLib.filterCategory = sel_category_id;
      this.objGoogleMapLib.loadMapData(sel_category_id);
    });
  }

  initializeDrawRectangleButton() {
    this.objBtnRenderRectangle.bind("click", obj => {
      this.objGoogleMapLib.renderRectangle();
    });
    this.objBtnRemoveRectangle.bind("click", obj => {
      this.objGoogleMapLib.removeRectangle();
    });
  }
}
