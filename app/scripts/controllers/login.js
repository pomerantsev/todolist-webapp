'use strict';

app.controller('LoginCtrl', function($scope, $location, $http, backend) {
  $scope.signup = function () {
    $http({
      url: backend + '/users',
      method: 'POST',
      data: {
        user: $scope.user
      }
    });
  };
});