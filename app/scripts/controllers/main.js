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
    $scope.submittingNew = true;
    Todos.save($scope.newTodo, function (todo) {
      $scope.todos.push(todo);
      $scope.newTodo.title = "";
    }, function (response) {
      ($scope.errors = response.data) || outputBackendError();
    }).$promise.finally(function () {
      $scope.submittingNew = false;
    });
  };

  $scope.$watch('newTodo', function () {
    $scope.errors = null;
  }, true);
  $scope.$watch('editedTodo', function () {
    $scope.errors = null;
  }, true);

  $scope.toggleCompleted = function (todo) {
    todo.submitting = true;
    todo.$patch().finally(function () {
      todo.submitting = false;
    });
  };

  $scope.editTodo = function (todo) {
    $scope.errors = null;
    angular.forEach($scope.todos, function (todo) {
      todo.editing = false;
    });
    todo.editing = true;
    $scope.editedTodo = angular.copy(todo);
  };

  $scope.saveEditing = function (todo) {
    todo.submitting = true;
    $scope.editedTodo.$patch().then(function () {
      todo.title = $scope.editedTodo.title;
      todo.due_date = $scope.editedTodo.due_date;
      todo.priority = $scope.editedTodo.priority;
      todo.editing = false;
    }, function (response) {
      $scope.errors = response.data;
    }).finally(function () {
      todo.submitting = false;
    });
  };

  $scope.cancelEditing = function (todo) {
    $scope.errors = null;
    todo.editing = false;
  };

  $scope.deleteTodo = function (todo) {
    todo.submitting = true;
    Todos.delete({id: todo.id}, function () {
      $scope.todos.splice($scope.todos.indexOf(todo), 1);
    }, function () {
      todo.submitting = false;
      outputBackendError();
    });
  };

  $scope.email = tokenHandler.get().email;

  $scope.logout = function () {
    tokenHandler.set(null, null);
    $rootScope.$broadcast('event:unauthorized');
  };

  var outputBackendError = function () {
    $scope.errors = "There seems to be a problem with the backend.";
  };
});
