// Create Angular
  var appBucket = angular.module('bucketList', ['ngRoute']);

  appBucket.config(function($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: '/partials/register.html'
    })
    .when('/login', {
      templateUrl: '/partials/login.html'
    })
    .when('/dashboard', {
      templateUrl: '/partials/dashboard.html'
    })
    .when('/user', {
      templateUrl: '/partials/user.html'
    })
    .when('/logout', {
      redirectTo: '/login'
    })
    .otherwise({
      redirectTo: '/'
    })
})