'use strict';

app.controller('MainCtrl', function ($scope, Todos) {
  $scope.newTodo = {
    title: "",
    completed: false,
    priority: 2
  };

  $scope.todos = Todos.query();

  $scope.createTodo = function () {
    Todos.save({todo: $scope.newTodo}, function(todo) {
      $scope.todos.push(todo);
      $scope.newTodo.title = "";
    });
  };

});
