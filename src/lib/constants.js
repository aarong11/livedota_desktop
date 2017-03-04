export const steamRegistryKey = 'HKEY_CURRENT_USER/Software/Valve/Steam';

export const steamDefaultDataDirectories = {
    "win32": "C:/Program Files/Steam",
    "win64": "C:/Program Files (x86)/Steam",
    "darwin": "~/Library/Application Support/Steam",
    "linux": "~/.steam/steam"
};

export const sampleCFGLocation = "/data/sample.cfg";
export const dotaInstallationSubDirectory = "/steamapps/common/dota 2 beta/game/dota";
export const gameStateSubDirectory = "/cfg/gamestate_integration";
export const liveDotaCFG = "/gamestate_integration_livedota.cfg";

export const direTeamMinimapColor = 'rgba(255,0,0, 0.7)';
export const radiantTeamMinimapColour = 'rgba(0,255,0, 0.7)';
export const playerBackgroundHeight = 50;
export const dataAssetPath = "./data/assets/";
export const resourcePath = "./data/resources/";
export const gsiEndpoint = "http://gsi.dota.watch:443/";
export const socketEndpoint = "http://gsi.dota.watch:3000";
export const miniHeroIconEndpoint = "http://cdn.dota2.com/apps/dota2/images/miniheroes/";
export const mapHeight = 500;
export const mapWidth = 500;
export const iconRadius = 15;
export const map_x_boundaries = [-7200, 7100];
export const map_y_boundaries = [6600, -7300];
