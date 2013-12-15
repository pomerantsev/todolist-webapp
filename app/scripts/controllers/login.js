'use strict';

app.controller('LoginCtrl', function($scope, $rootScope, $location,
                                     $http, backend, tokenHandler) {
  $scope.submitting = false;

  $scope.login = function () {
    $scope.submitting = true;
    $http.post(backend + '/users/sign_in', { user: $scope.user })
    .success(function (data) {
      if (data.success) {
        $rootScope.$broadcast('event:authenticated');
        tokenHandler.set(data.auth_token, data.user.email);
        $location.path('/');
      } else {
        $scope.user.errors = data.info;
      }
    }).finally(function () {
      $scope.submitting = false;
    });
  };

  $scope.signup = function () {
    $scope.submitting = true;
    $http.post(backend + '/users', { user: $scope.user })
    .success(function (data) {
      $rootScope.$broadcast('event:authenticated');
      tokenHandler.set(data.auth_token, data.user.email);
      $location.path('/');
    }).error(function (reason) {
      $scope.user.errors = reason;
    }).finally(function () {
      $scope.submitting = false;
    });
  };
});
