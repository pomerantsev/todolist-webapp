'use strict';

app.controller('MainCtrl', function ($scope, Todos, $timeout, tokenHandler, $rootScope) {
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
    }, function (response) {
      $scope.errors = response.data;
    });
  };

  $scope.$watch('newTodo', function () {
    $scope.errors = null;
  }, true);
  $scope.$watch('editedTodo', function () {
    $scope.errors = null;
  }, true);

  $scope.toggleCompleted = function (todo) {
    todo.$patch();
  };

  $scope.editTodo = function (todo) {
    todo.editing = true;
    $scope.editedTodo = angular.copy(todo);
  };

  $scope.saveEditing = function (todo) {
    $scope.editedTodo.$patch().then(function () {
      todo.title = $scope.editedTodo.title;
      todo.due_date = $scope.editedTodo.due_date;
      todo.priority = $scope.editedTodo.priority;
      todo.editing = false;
    }, function (response) {
      $scope.errors = response.data;
    });
  };

  $scope.cancelEditing = function (todo) {
    $scope.errors = null;
    todo.editing = false;
  };

  $scope.deleteTodo = function (todo) {
    Todos.delete({id: todo.id}, function () {
      $scope.todos.splice($scope.todos.indexOf(todo), 1);
    });
  };

  $scope.email = tokenHandler.get().email;

  $scope.logout = function () {
    tokenHandler.set(null, null);
    $rootScope.$broadcast('event:unauthorized');
  };
});
