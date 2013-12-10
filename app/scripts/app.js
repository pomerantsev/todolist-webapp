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
          token: ['tokenHandler', function (tokenHandler) {
            return tokenHandler.get();
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
  .config(function ($httpProvider) {
    var interceptor = ['$rootScope', '$location', '$q',
      function ($rootScope, $location, $q) {
        var success = function (resp) {
          return resp;
        };
        var err = function (resp) {
          if (resp.status == 401) {
            var d = $q.defer();
            $rootScope.$broadcast('event:unauthorized');
            return d.promise;
          }
          return $q.reject(resp);
        };

        return function (promise) {
          return promise.then(success, err);
        };
      }];
    $httpProvider.responseInterceptors.push(interceptor);
  })
  .run(function ($rootScope, $http, $location, tokenHandler) {
    $rootScope.$on('event:unauthorized', function () {
      $location.path('/login');
    })
  });
