const direTeamMinimapColor  = 'rgba(255,0,0, 0.7)';
const radiantTeamMinimapColour = 'rgba(0,255,0, 0.7)';
const playerBackgroundHeight = 50;

function isElectron() {
  if (typeof require !== 'function') return false;
  if (typeof window !== 'object') return false;
  try {
    const electron = require('electron');
    if (typeof electron !== 'object') return false;
  } catch(e) {
    return false;
  }
  return true;
}

if(isElectron())
{
  var windows = require('windows');
  var fs = require('fs');
  var _ = require('lodash');
}

const remote = require('electron').remote;

const steamPath = windows.registry('HKEY_CURRENT_USER/Software/Valve/Steam').SteamPath;
const cfgPath = steamPath + "/steamapps/common/dota 2 beta/game/dota/cfg";
const liveDotaCFGName = "gamestate_integration_livedota.cfg";
const gsDir = "gamestate_integration";
const liveDotaCFGPath = cfgPath + "/" + gsDir + "/" + liveDotaCFGName;
const gamestateEndpoint = "http://molecular-creations.co.uk:443/";
const steamRegistry = windows.registry('HKEY_CURRENT_USER/Software/Valve/Steam');

var abilityData = null;
var heroData = null;

$.getJSON("./data/resources/abilities.json", function(json) {
  abilityData = json;
});

$.getJSON("./data/resources/heroes.json", function(json) {
  heroData = json;
});


function checkGameStateDir()
{
  if(isElectron())
  {
    const cfgContent = fs.readdirSync(cfgPath);

    // Check if the gamestate directory exists
    const gsDirExists = (cfgContent.indexOf(gsDir) != -1);

    if(!gsDirExists)
    {
      // If it doesn't, create it.
      fs.mkdirSync(cfgPath + "/" + gsDir);
    }

    // Now check if CFG exists.
    const gsDirContents = fs.readdirSync(cfgPath + "/" + gsDir);
    const cfgExists = (gsDirContents.indexOf(liveDotaCFGName) != -1);

    if(!cfgExists)
    {
      const sampleCfgContents = fs.readFileSync(__dirname + "/data/sample.cfg");

      const f = fs.openSync(liveDotaCFGPath, "w+");

      fs.writeFileSync(liveDotaCFGPath, sampleCfgContents);
    }
  }
}

function getSteamName()
{
  if(isElectron())
  {
    const username = steamRegistry.LastGameNameUsed.value;
    const sanitised = username.replace(" ", "-");
    return sanitised;
  }
}

function getHeroName(heroname)
{
  const sanitised = heroname.replace("npc_dota_hero_", "");
  return sanitised;
}

function getMapIcon(heroname)
{
  return "http://cdn.dota2.com/apps/dota2/images/miniheroes/" + heroname + ".png";
}

function getAbilityData(abilityName)
{

}

function getHeroImage(heroname)
{
  return "./data/assets/heroes/" + heroname + "_sb.png";
}


function getFriendlyHeroName(heroname)
{
  for(var i = 0; i < heroData.result.heroes.length; i++)
  {
    if(heroname == heroData.result.heroes[i].name)
    {
      return heroData.result.heroes[i].localized_name;
    }
  }

  return heroname;

}

function getItemImage(itemname)
{
  const sanitised = itemname.replace("item_", "");
  return "./data/assets/items/" + sanitised + "_lg.png";
}

function getSkillImage(skillname)
{
  return "./data/assets/abilities/" + skillname + "_lg.png";
}

function getAbilityClass(ability)
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
}

function reverse_lerp(minVal, maxVal, pos)
{
  return (pos - minVal) / (maxVal - minVal);
}

function getImageCoordinates(x, y)
{
  let mapHeight = 500;
  let mapWidth = 500;
  let iconRadius = 15;
  let map_x_boundaries = [-7200, 7100];
  let map_y_boundaries = [6600, -7300];

  x = reverse_lerp(map_x_boundaries[0], map_x_boundaries[1], x) * mapWidth;
  y = reverse_lerp(map_y_boundaries[0], map_y_boundaries[1], y) * mapHeight;

  return [x, y];
}


function modifyCFG(partyId, username)
{
  if(isElectron())
  {
    const sampleCfgContents = fs.readFileSync(__dirname + "/data/sample.cfg").toString();
    const newCfgContents = sampleCfgContents.replace('{uri}', gamestateEndpoint)
                                          .replace('{auth}', partyId + '_' + username);
    fs.writeFileSync(liveDotaCFGPath, newCfgContents);
  }
}

function reverse_lerp(minVal, maxVal, pos)
{
  return (pos - minVal) / (maxVal - minVal);
}


function drawBar(context, position, percent, outerColour, innerColour, barWidth, barHeight)
{
  canvas.fillStyle = outerColour;
  context.strokeRect(position[0], position[1], barWidth, barHeight);

  context.fillStyle = innerColour;
  var fillWidth = (barWidth * (percent / 100));
  context.fillRect(position[0], position[1], fillWidth, barHeight);

}


function drawBuilding(context, buildingName, buildings, radius, buildingData)
{
  const building = buildings[buildingName];


  if(building)
  {
    const coordinates = getImageCoordinates(building.xPos, building.yPos);
    const xPos = coordinates[0];
    const yPos = coordinates[1];
    var barWidth = 15;
    var barHeight = 5;
    var teamColor = building.team === "dire" ? direTeamMinimapColor : radiantTeamMinimapColour;

    fetchImage("./data/assets/" + building.type + ".png", ((image) => {
      var towerPercent = (buildingData['health'] / buildingData['max_health']) * 100;
      context.drawImage(image, coordinates[0], coordinates[1], radius, radius);

      if(building.type == "tower")
      {
        drawBar(c, [xPos, yPos + radius], towerPercent, teamColor, teamColor, barWidth, barHeight);
      }
    }));

  }

}

function drawHeroOnMap(context, playerData, radius)
{

  const heroIcon = getMapIcon(getHeroName(playerData.hero));
  const coordinates = getImageCoordinates(playerData.herodata.xpos, playerData.herodata.ypos);

  const xPos = coordinates[0];
  const yPos = coordinates[1];

  let barHeight = 5;
  let barWidth = 25;

  var teamTextColour = playerData.playerdata['team_name'] === "dire" ? "#330000" : " #001a00";

  var teamColor = playerData.playerdata['team_name'] === "dire" ? direTeamMinimapColor : radiantTeamMinimapColour;

  context.font = "10px Verdana";
  context.fillStyle = 'rgba(255, 255, 255, 1)';
  context.textBaseline = 'middle';
  context.textAlign = 'center';

  var width = context.measureText(playerData.username).width;
  var height = context.measureText(playerData.username).height;

  const textCenterPoint = [xPos + (width / 2) + (radius / 2), yPos];

  // HP
  drawBar(c, [textCenterPoint[0] - (barWidth / 4), yPos + (radius)], playerData.herodata['health_percent'], "rgb(255,255,255)", teamColor, barWidth, barHeight);

  // MP
  drawBar(c, [textCenterPoint[0] - (barWidth / 4),  yPos + radius + barHeight], playerData.herodata['mana_percent'], "rgb(255,255,255)", "rgba(0,255,255, 1.0)", barWidth, barHeight);

  fetchImage(heroIcon, (drawing) => {
     context.fillStyle = teamTextColour;

     context.fillText(playerData.username, textCenterPoint[0] + (radius / 2), yPos - barHeight * 1.5);
     context.drawImage(drawing, textCenterPoint[0], yPos, radius, radius);
  });


}

function loadUserData()
{
  return JSON.parse(localStorage.getItem('user'));
}

function saveUserData(user)
{
  localStorage.setItem('user', JSON.stringify(user));
}
