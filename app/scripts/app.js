'use strict';

var app = angular.module('myTodolistWebfrontApp', [
  'ngRoute',
  'ngCookies',
  'ngResource',
  // Add a config module for using different backends
  // for development and production:
  // http://stackoverflow.com/questions/16339595/angular-js-configuration-for-different-enviroments
  'config'
])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        resolve: {
          token: ['tokenHandler', '$q', function (tokenHandler, $q) {
            var defer = $q.defer();
            if (tokenHandler.get()) {
              defer.resolve();
            }
            return defer.promise;
          }]
        }
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .config(function ($httpProvider, $provide) {
    $provide.factory('interceptor', function ($rootScope, $q) {
      return {
        responseError: function (rejection) {
          if (rejection.status == 401) {
            var d = $q.defer();
            $rootScope.$broadcast('event:unauthorized');
            return d.promise;
          }
          return $q.reject(rejection);
        }
      };
    });
    $httpProvider.interceptors.push('interceptor');
  })
  .run(function ($rootScope, $http, $location, tokenHandler) {
    $rootScope.$on('event:unauthorized', function () {
      $location.path('/login');
    })
  });
