var jQuery = require("jquery");
var CONSTANTS = require('./constants.js');
var path = require('path');
var isElectronRenderer = require('is-electron-renderer');
var abilityData = {};
var heroData = {};

var fs = null;
var windows = null;
var electron = null;
var remote = null;

if(isElectronRenderer)
{
  electron = require('electron');
  remote = electron.remote;
  fs = remote.require('fs');
  windows = remote.require('windows');
}

jQuery.getJSON(CONSTANTS.resourcePath + "abilities.json", function(json) {
  abilityData = json;
});

jQuery.getJSON(CONSTANTS.resourcePath + "heroes.json", function(json) {
  heroData = json;
});

var self = module.exports = {

  isElectron:function() {
    return isElectronRenderer;
  },


  getHeroPortraitImage:function(heroname){
    return CONSTANTS.dataAssetPath + "heroes/" +  CONSTANTS.heroname + "_sb.png";
  },

  getHeroMapIcon:function(heroname)
  {
    return CONSTANTS.miniHeroIconEndpoint + CONSTANTS.heroname + ".png";
  },

  getFriendlyHeroName:function(heroname)
  {

    for(var i = 0; i < heroData.result.heroes.length; i++)
    {
      if(heroname == heroData.result.heroes[i].name)
      {
        return heroData.result.heroes[i].localized_name;
      }
    }
    return heroname;
  },

  getItemImage:function(itemname)
  {
    const sanitised = itemname.replace("item_", "");
    return CONSTANTS.dataAssetPath + "items/" + CONSTANTS.sanitised + "_lg.png";
  },

  getSkillImage:function(skillname)
  {
    return CONSTANTS.dataAssetPath + "abilities/" + skillname + "_lg.png";
  },

  getAbilityClass:function(ability)
  {
    const canCast = (ability.can_cast === true);

    var className = "ability";

    if(ability.level === 0)
    {
      className += " ability-unlevelled";
    }
    else {
      className += " ability-levelled";
    }

    if(ability.can_cast === true)
    {
      className += " ability-ready";
    }

    else {
      className += " ability-cooldown";
    }

    return className;
  },

  reverse_lerp:function(minVal, maxVal, pos)
  {
    return (pos - minVal) / (maxVal - minVal);
  },

  getImageCoordinates:function(x, y)
  {
    x = reverse_lerp(CONSTANTS.map_x_boundaries[0], CONSTANTS.map_x_boundaries[1], x) * CONSTANTS.mapWidth;
    y = reverse_lerp(CONSTANTS.map_y_boundaries[0], CONSTANTS.map_y_boundaries[1], y) * CONSTANTS.mapHeight;
    return [x, y];
  },

  loadUserData:function()
  {
    return JSON.parse(localStorage.getItem('user'));
  },

  saveUserData:function(user)
  {
    localStorage.setItem('user', JSON.stringify(user));
  },

  checkCFGFolder:function(){
    const cfgFolderContent = fs.readdirSync(self.getInstallLocation() + CONSTANTS.gameStateSubDirectory);
    return cfgFolderContent != null;
  },

  getCFGFileLocation:function(){
    return self.getInstallLocation() + "/" + CONSTANTS.gameStateSubDirectory + CONSTANTS.liveDotaCFG;
  },

  modifyOrCreateCFGFile:function(data)
  {
    // First check the folder exists. If not, create it.

    if(!self.checkCFGFolder())
    {
      fs.mkdirSync(self.getInstallLocation() + "/" + CONSTANTS.gameStateSubDirectory);
    }

    // Attempt to open it with +w - this creates if it doesn't already exist.
    var cfgHandle = fs.openSync(self.getCFGFileLocation(), "w+");

    if(!cfgHandle)
    {
      return false;
    }

    var result = fs.writeSync(cfgHandle, data);
    return (result != 0);
  },

  saveCFG:function(partyId, username)
  {
    const sampleCfgContents = fs.readFileSync($dirname + CONSTANTS.sampleCFGLocation).toString();
    const newCFGContents = sampleCfgContents.replace('{uri}', CONSTANTS.gsiEndpoint)
                                            .replace('{auth}', partyId + '_' + username);

    var success = self.modifyOrCreateCFGFile(newCFGContents);
  },

  getInstallLocation:function()
  {

    if(!self.isElectron())
    {
      return "web";
    }
    // This is the case for both 32 and 64 bit versions of windows.
    if(process.platform === "win32")
    {
      // Try to find it in the registry.

      var electron = require('electron');
      var remote = electron.remote;
      var windows = remote.require('windows');
      var path = windows.registry(CONSTANTS.steamRegistryKey).SteamPath;

      // Guess the defaults
      if(!path)
      {
        path = (process.arch === "x64" ? CONSTANTS.steamDefaultDataDirectories['win64'] : CONSTANTS.steamDefaultDataDirectories['win32']);
      }
    }

    // If it's darwin/linux we just gotta assume it's in the default.
    else {
      path = CONSTANTS.steamDefaultDataDirectories[process.platform];
    }

    return path + CONSTANTS.dotaInstallationSubDirectory;
  }
}
