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

agegApp.controller('profileCtrl',['$http', '$route', '$routeParams', '$scope', function($http, $route, $routeParams, $scope) {
  $http({
    method: 'GET',
    url: '/user'
  }).then(function(response) {
    $scope.userInfo = response.data;
  });
  $scope.profileSubmit = function () {
    $http({
      data: $scope.userInfo,
      method: 'PUT',
      url: '/user/'
    }).then(function(data, status, headers, config) {
      $scope.refundInfo = data;
      $route.reload();
    },function(data, status, headers, config) {
      console.log('Oops and error', data);
    });
  };
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