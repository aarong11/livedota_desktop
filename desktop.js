var windows = require('windows');
var fs = require('fs');
var _ = require('lodash');

const remote = require('electron').remote;
const steamPath = windows.registry('HKEY_CURRENT_USER/Software/Valve/Steam').SteamPath;
const cfgPath = steamPath + "/steamapps/common/dota 2 beta/game/dota/cfg";
const liveDotaCFGName = "gamestate_integration_livedota.cfg";
const gsDir = "gamestate_integration";
const liveDotaCFGPath = cfgPath + "/" + gsDir + "/" + liveDotaCFGName;
const gamestateEndpoint = "http://molecular-creations.co.uk:443/";
const steamRegistry = windows.registry('HKEY_CURRENT_USER/Software/Valve/Steam');
