'use strict';

app.controller('LoginCtrl', function($scope, $rootScope, $location, $http, backend) {
  $scope.signup = function () {
    $http({
      url: backend + '/users',
      method: 'POST',
      data: {
        user: $scope.user
      }
    }).success(function () {
      $rootScope.$broadcast('event:authenticated');
      $location.path('/');
    }).error(function (reason) {
      $scope.user.errors = reason;
    });
  };
});