'use strict';

angular.module('myTodolistWebfrontApp')
  .controller('MainCtrl', function ($scope, Todos) {
    $scope.todos = Todos.query();
  });
