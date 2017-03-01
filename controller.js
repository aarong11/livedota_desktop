angular.module('App', [])
  .controller('MainController', ['$scope', function($scope) {

    $scope.init = function () {
        const data = loadUserData();
        $scope.user = data;
    };


    $scope.updateCfg = function(user) {
      checkGameStateDir();
      modifyCFG(user.partyid, user.username);
      saveUserData(user);
    };

  }]);

  angular.module('ngAppDemo', ['ultimateDataTableServices']).controller('ngAppDemoController', ['$scope','datatable',function($scope,datatable) {

    //Simple example of configuration
        var datatableConfig = {
            "name":"rankings",
            "compact":true,
            "columns":[
                {
                    "header":"Username",
                    "property":"username",
                    "order":true,
                    "type":"text",
                    "edit":false
                },
                {
                    "header":"Hero",
                    "property":"hero",
                    "order":true,
                    "type":"text",
                    "edit":false,
                    "render" : function(value, line){
                      return '<span>' + getFriendlyHeroName(value.hero) + '</span>';
                    }
                },
                {
                    "header":"",
                    "property":"hero",
                    "order":false,
                    "type":"text",
                    "edit":false,
                    "render" : function(value, line){
                      return '<img class="inventory" src=' + getHeroImage(getHeroName(value.hero)) + ' height="40" width="70"></img>';
                    }
                },
                {
                    "header":"Kills",
                    "property":"kills",
                    "order":true,
                    "type":"number",
                    "edit":false
                },
                {
                    "header":"Deaths",
                    "property":"deaths",
                    "order":true,
                    "type":"number",
                    "edit":false
                },
                {
                    "header":"Assists",
                    "property":"assists",
                    "order":true,
                    "type":"number",
                    "edit":false
                },
                {
                    "header":"LH",
                    "property":"lasthits",
                    "order":true,
                    "type":"number",
                    "edit":false
                },
                {
                    "header":"DN",
                    "property":"denies",
                    "order":true,
                    "type":"number",
                    "edit":false
                },
                {
                    "header":"GPM",
                    "property":"gpm",
                    "order":true,
                    "type":"number",
                    "edit":false
                },
                {
                    "header":"XPM",
                    "property":"xpm",
                    "order":true,
                    "type":"number",
                    "edit":false
                },
                {
                    "header":"Items",
                    "property": "",
                    "order":false,
                    "edit":false,
                    "type": "img",
                    "render" : function(value, line){
                      return '<img class="inventory" src=' + getItemImage(value.items.slot0.name) + ' height="40" width="40"></img>'
                           + '<img class="inventory" src=' + getItemImage(value.items.slot1.name) + ' height="40" width="40"></img>'
                           + '<img class="inventory" src=' + getItemImage(value.items.slot2.name) + ' height="40" width="40"></img>'
                           + '<img class="inventory" src=' + getItemImage(value.items.slot3.name) + ' height="40" width="40"></img>'
                           + '<img class="inventory" src=' + getItemImage(value.items.slot4.name) + ' height="40" width="40"></img>'
                           + '<img class="inventory"  src=' + getItemImage(value.items.slot5.name) + ' height="40" width="40"></img>'
                    }
                },
                {
                    "header":"",
                    "property":"abilities",
                    "order":false,
                    "type":"text",
                    "edit":false,
                    "render" : function(value, line){
                      return '<div class="' + getAbilityClass(value.abilities.ability0) + '" id="' + value.steamid + '_ability0" class="ability"><div class="ability-overlay"><div class="ability-countdown">' + value.abilities.ability0.cooldown + '</div></div><img class="ability-img" src=' + getSkillImage(value.abilities.ability0.name) + '></img></div>'
                           + '<div class="' + getAbilityClass(value.abilities.ability1) + '" id="' + value.steamid + '_ability1" class="ability"><div class="ability-overlay"><div class="ability-countdown">' + value.abilities.ability1.cooldown + '</div></div><img class="ability-img" src=' + getSkillImage(value.abilities.ability1.name) + '></img></div>'
                           + '<div class="' + getAbilityClass(value.abilities.ability2) + '" id="' + value.steamid + '_ability2" class="ability"><div class="ability-overlay"><div class="ability-countdown">' + value.abilities.ability2.cooldown + '</div></div><img class="ability-img" src=' + getSkillImage(value.abilities.ability2.name) + '></img></div>'
                           + '<div class="' + getAbilityClass(value.abilities.ability3) + '" id="' + value.steamid + '_ability3" class="ability"><div class="ability-overlay"><div class="ability-countdown">' + value.abilities.ability3.cooldown + '</div></div><img class="ability-img" src=' + getSkillImage(value.abilities.ability3.name) + '></img></div>'
                    }
                },
                {
                    "header":"LVL",
                    "property":"herodata.level",
                    "order":true,
                    "type":"number",
                    "edit":false
                },
                {
                    "header":"HP%",
                    "property":"herodata.health_percent",
                    "order":true,
                    "type":"number",
                    "edit":false
                },
                {
                    "header":"MP%",
                    "property":"herodata.mana_percent",
                    "order":true,
                    "type":"number",
                    "edit":false
                },
                {
                    "header":"Gold",
                    "property":"playerdata.gold",
                    "order":true,
                    "type":"number",
                    "edit":false
                }
            ],
            "edit":{
                "active":false,
                "columnMode":true
            },
            "pagination":{
              mode:'local'
            },
            "order":{
                "mode":'local'
            },
            "remove":{
                "active":false,
                "mode":'local'
            },
            "extraHeaders":{
              number:0,//Number of extra headers
              list:{},//If dynamic:false
              dynamic:true //If dynamic:true, the headers will be auto generated
            }
        };


        //Init the datatable with his configuration
        $scope.datatable = datatable(datatableConfig);
        //Set the data to the datatable
        $scope.datatable.setData(globalTableData);

        setInterval( function () {

          $scope.datatable.setData(globalTableData);
        }, 1000 );

        tableObject = $scope.datatable;

  }]);
