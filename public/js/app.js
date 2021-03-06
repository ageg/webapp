﻿var app = angular.module('agegApp', ['ngRoute']);
app.config(function ($routeProvider, $locationProvider) {
  $routeProvider
    .when('/', {
      controller: 'HomeController', 
      templateUrl: 'views/home.html'
    })
    .when('/rights', {
      controller: 'AdminController',
      templateUrl: 'views/adminrights.html'
    })
    .when('/profile', {
      controller: 'ProfileController',
      templateUrl: 'views/profile.html'
    })
    .otherwise({
      redirectTo: '/'
    });

  if(window.history && window.history.pushState){
    $locationProvider.html5Mode(true);
  }
});