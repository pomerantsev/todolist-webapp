'use strict';

app.directive("logout", function (tokenHandler, $rootScope) {
  return {
    restrict: "A",
    replace: true,
    transclude: true,
    scope: {},
    template: "<a href ng-click='logout()' ng-transclude></a>",
    controller: function ($scope) {
      $scope.logout = function () {
        tokenHandler.set(null, null);
        $rootScope.$broadcast('event:unauthorized');
      };
    }
  };
});