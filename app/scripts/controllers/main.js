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

  $scope.toggleCompleted = function (todo) {
    $timeout(function () {
      todo.$patch();
    }, 0);
  };

});
