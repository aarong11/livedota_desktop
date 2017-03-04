import './style/style.css';
require('file-loader!./index.html')

var sharedUtil = require('./lib/shared_util.js');
var dataStorage = require('./lib/data_storage.js');


var app = angular.module('App', [require('angular-route')]);

app.config(function($routeProvider) {
    $routeProvider

        // route for the home page
        .when('/', {
            templateUrl : 'templates/home.html',
            controller  : 'MainController'
        })

        .when('/party', {
            templateUrl : 'templates/party.html',
            controller  : 'PartyController'
        })
});
app.controller('MainController', ['$scope', function($scope) {

    $scope.init = function () {
        var data = sharedUtil.loadUserData();
        $scope.user = data;
    };

    $scope.updateCfg = function(user) {

      // We only want to try and save a CFG if they are using a desktop client.
      if(sharedUtil.isElectron())
      {

        sharedUtil.saveCFG(user.partyid, user.username);
      }

      sharedUtil.saveUserData(user);
    };
}]);

app.controller('PartyController', ['$scope', function($scope) {

}]);
