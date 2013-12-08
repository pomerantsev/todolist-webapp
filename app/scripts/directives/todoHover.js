'use strict';

app.directive('todoHover', function () {
  return {
    restrict: "A",
    scope: {},
    transclude: true,
    template: "<div ng-mouseenter='toggleHiddenContent()' ng-mouseleave='toggleHiddenContent()' ng-transclude></div>",
    controller: function ($scope) {
      $scope.elementsToShowOnHover = [];
      $scope.toggleHiddenContent = function () {
        angular.forEach($scope.elementsToShowOnHover, function (element) {
          element.shown = !element.shown;
        });
      };
      this.addElementToShowOnHover = function (element) {
        element.shown = false;
        $scope.elementsToShowOnHover.push(element);
      }
    }
  };
})
.directive('todoShowOnHover', function () {
  return {
    require: "^todoHover",
    restrict: "A",
    transclude: true,
    template: "<span ng-show='shown' ng-transclude></span>",
    link: function(scope, element, attrs, todoHoverCtrl) {
      todoHoverCtrl.addElementToShowOnHover(scope);
    }
  };
});
