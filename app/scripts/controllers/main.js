'use strict';

angular.module('myTodolistWebfrontApp')
  .controller('MainCtrl', function ($scope, Todos) {
    $scope.todos = Todos.query();

    $scope.create = function(title) {
      Todos.save(
        {todo:
          {title: title, completed: false, priority: 2}
        }, function(todo) {
          $scope.todos.push(todo);
          $scope.title = "";
        });
    }
  });
