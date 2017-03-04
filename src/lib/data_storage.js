var globalTableData = [];
var mapCanvas = null;
var mapCanvasContext = null;

var DataStore = {

  // Initialise the pointer with the canvas data.
  setMapCanvas : function(canvas) {
    mapCanvas = canvas;
  },

  // Returns a pointer to the canvas.
  getMapCanvas : function() {
    return mapCanvas;
  },

  setCanvasContext : function(context) {
    mapCanvasContext = context;
  },

  getCanvasContext : function() {
    return mapCanvasContext;
  },

  // Replaces the player data in the global table if it already exists, otherwise adds it.
  // Uses username as a unique key.
  setPlayerData: function(updatedData) {

    var found = false;

    for(i = 0; i < globalTableData.length; i++)
    {
      if(globalTableData[i].username == updatedData.username)
      {
        globalTableData[i] = updatedData;
        found = true;
        break;
      }
    }

    if(!found)
    {
      globalTableData.push(updatedData);
    }
  },

  // Returns the data for the specified player if it exists, otherwise an empty object.
  getPlayerData: function(playerName)
  {
    for(i = 0; i < globalTableData.length; i++)
    {
      if(globalTableData[i].username == updatedData.username)
      {
        return globalTableData[i];
      }
    }

    return {};
  }
};

export { DataStore };
