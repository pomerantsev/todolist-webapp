'use strict';

app.controller('MainCtrl', function ($scope, Todos, $timeout) {
  $scope.newTodo = {
    title: "",
    completed: false,
    priority: 2
  };

  $scope.todos = Todos.query();

  $scope.createTodo = function () {
    Todos.save($scope.newTodo, function (todo) {
      $scope.todos.push(todo);
      $scope.newTodo.title = "";
    });
  };

  $scope.deleteTodo = function (todo) {
    Todos.delete({id: todo.id}, function () {
      $scope.todos.splice($scope.todos.indexOf(todo), 1);
    });
  };

  // TODO: only triggered by click, but should react to any toggling,
  // e.g. by pressing the Space key.
  $scope.toggleCompleted = function (todo) {
    $timeout(function () {
      todo.$patch();
    }, 0);
  };

});
