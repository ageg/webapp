var agegApp = angular.module('agegApp', ['ngRoute']);

agegApp.controller('agegHeader',['$scope', '$http', function($scope, $http) {
  $http({
    method: 'GET',
    url: '/user'
  }).then(function(response) {
    console.log(response);
    $scope.userInfo = response.data;
  });
  $scope.connected = function() {
    return $scope.userInfo !== undefined && $scope.userInfo.cip !== undefined;
  };
  $scope.fullName = function() {
    return $scope.userInfo.prenom + " " + $scope.userInfo.nom;
  };
}]);

agegApp.controller('profileCtrl',['$http', '$routeParams', '$scope', function($http, $routeParams, $scope) {
  $http({
    method: 'GET',
    url: '/user'
  }).then(function(response) {
    console.log(response);
    $scope.userInfo = response.data;
  });
}]);

agegApp.config(['$routeProvider', function ($routeProvider) {
  console.log($routeProvider);
  $routeProvider
  .when('/', {
    templateUrl: '/index.html',
    controller: 'profileCtrl'
  }).when('/profil', {
    templateUrl: '/profile.html',
    controller: 'profileCtrl'
  }).otherwise({
    redirectTo: '/'
  });
}]);