'use strict';

app.controller('MainCtrl', function ($scope, Todos, $timeout) {
  $scope.newTodo = {
    title: "",
    completed: false,
    priority: 2
  };

  $scope.todos = Todos.query();

  $scope.predicate = 'created_at';

  $scope.setOrder = function (predicate) {
    $scope.predicate = predicate;
  };

  $scope.createTodo = function () {
    Todos.save($scope.newTodo, function (todo) {
      $scope.todos.push(todo);
      $scope.newTodo.title = "";
    });
  };

  $scope.saveTodo = function (todo) {
    todo.$patch();
  };

  $scope.editTodo = function (todo) {
    todo.editing = true;
    $scope.editedTodo = angular.copy(todo);
  };

  $scope.saveEditing = function (todo) {
    todo.title = $scope.editedTodo.title;
    todo.due_date = $scope.editedTodo.due_date;
    todo.priority = $scope.editedTodo.priority;
    $scope.saveTodo(todo);
    todo.editing = false;
  };

  $scope.cancelEditing = function (todo) {
    todo.editing = false;
  };

  $scope.deleteTodo = function (todo) {
    Todos.delete({id: todo.id}, function () {
      $scope.todos.splice($scope.todos.indexOf(todo), 1);
    });
  };
});
