'use strict';

app.controller('MainCtrl', function ($scope, Todos, $timeout, tokenHandler, $rootScope) {
  $scope.newTodo = {
    title: "",
    completed: false,
    priority: 2
  };

  $scope.submittingNew = false;

  $scope.todos = Todos.query();

  $scope.predicate = 'created_at';

  $scope.setOrder = function (predicate) {
    $scope.predicate = predicate;
  };

  $scope.createTodo = function () {
    $scope.submittingNew = true;
    Todos.save($scope.newTodo, function (todo) {
      $scope.submittingNew = false;
      $scope.todos.push(todo);
      $scope.newTodo.title = "";
    }, function (response) {
      $scope.submittingNew = false;
      $scope.errors = response.data;
    });
  };

  $scope.$watch('newTodo', function () {
    $scope.errors = null;
  }, true);

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

  $scope.email = tokenHandler.get().email;

  $scope.logout = function () {
    tokenHandler.set(null, null);
    $rootScope.$broadcast('event:unauthorized');
  };
});
