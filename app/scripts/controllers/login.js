'use strict';

app.controller('LoginCtrl', function($scope, $rootScope, $location,
                                     $http, backend, tokenHandler) {
  $scope.signup = function () {
    $http({
      url: backend + '/users',
      method: 'POST',
      data: {
        user: $scope.user
      }
    }).success(function (data) {
      $rootScope.$broadcast('event:authenticated');
      tokenHandler.set(data.auth_token);
      $location.path('/');
    }).error(function (reason) {
      $scope.user.errors = reason;
    });
  };
});