'use strict';

app.controller('LoginCtrl', function($scope, $rootScope, $location,
                                     $http, backend, tokenHandler) {
  $scope.submitting = false;

  $scope.login = function () {
    $scope.submitting = true;
    $http({
      url: backend + '/users/sign_in',
      method: 'POST',
      data: {
        user: $scope.user
      }
    }).success(function (data) {
      $scope.submitting = false;
      if (data.success) {
        $rootScope.$broadcast('event:authenticated');
        tokenHandler.set(data.auth_token, data.user.email);
        $location.path('/');
      } else {
        $scope.user.errors = data.info;
      }
    });
  };

  $scope.signup = function () {
    $scope.submitting = true;
    $http({
      url: backend + '/users',
      method: 'POST',
      data: {
        user: $scope.user
      }
    }).success(function (data) {
      $scope.submitting = false;
      $rootScope.$broadcast('event:authenticated');
      tokenHandler.set(data.auth_token, data.user.email);
      $location.path('/');
    }).error(function (reason) {
      $scope.submitting = false;
      $scope.user.errors = reason;
    });
  };
});
