'use strict';

app.directive('errors', function () {
  return {
    restrict: "E",
    scope: {
      value: "@"
    },
    template: "<div class='alert alert-danger' ng-show='value'>{{value}}</div>",
  };
});
