'use strict';

app.controller('MainCtrl', function (
    $scope, Todos, $timeout, tokenHandler, $location, backendErrorMessage) {
  var outputBackendError = function () {
    $scope.errors = backendErrorMessage;
  };
  var remove = function (todo) {
    $scope.todos.splice($scope.todos.indexOf(todo), 1);
  };

  $scope.newTodo = {
    title: "",
    completed: false,
    priority: 2
  };

  $scope.todos = Todos.query();
  $scope.todos.$promise.catch(function () {
    $timeout(function () {
      outputBackendError();
    }, 0)
  });

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

  $scope.toggleCompleted = function (todo, $event) {
    todo.completed = !todo.completed;
    todo.submitting = true;
    todo.$patch().catch(function (response) {
      if (response.status === 404) {
        remove(todo);
      } else {
        todo.completed = !todo.completed;
        outputBackendError();
      }
    }).finally(function () {
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

  $scope.updateTodo = function (todo) {
    todo.submitting = true;
    $scope.editedTodo.$patch().then(function () {
      todo.title = $scope.editedTodo.title;
      todo.due_date = $scope.editedTodo.due_date;
      todo.priority = $scope.editedTodo.priority;
      todo.editing = false;
    }, function (response) {
      if (response.status === 404) {
        remove(todo);
      } else {
        ($scope.errors = response.data) || outputBackendError();
      }
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
      remove(todo);
    }, function (response) {
      todo.submitting = false;
      if (response.status === 404) {
        remove(todo);
      } else {
        outputBackendError();
      }
    });
  };

  $scope.email = tokenHandler.get().email;

  $scope.logout = function () {
    tokenHandler.delete();
    $location.path('/login');
  };
});
