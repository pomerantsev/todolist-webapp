'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('myTodolistWebfrontApp'));

  var MainCtrl,
    scope;

  var mockTokenHandler = {
    get: function () {
      return { token: "random_token", email: "email@email.com"}
    },
    set: function () {}
  };

  var mockTodos = {
    query: function () { return [{id: 1, title: "First todo"}] },
    save: function (params, callback) { return callback(params) },
    delete: function (params, callback) { return callback(params) }
  };

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, _$rootScope_, _$timeout_) {
    scope = _$rootScope_.$new();
    MainCtrl = $controller('MainCtrl', {
      $scope: scope,
      $rootScope: scope,
      $timeout: _$timeout_,
      Todos: mockTodos,
      tokenHandler: mockTokenHandler
    });
  }));

  it('should initialize the todos with a query to the server', function () {
    expect(scope.todos).toEqual(mockTodos.query());
  });

  it('should use created_at as the initial sorting predicate', function () {
    expect(scope.predicate).toEqual('created_at');
  });

  describe('$scope.createTodo', function () {
    var newTodo;
    beforeEach(function () {
      newTodo = scope.newTodo = {id: 2, title: "New todo"};
      scope.createTodo();
    });
    it("adds the new todo to the todos array", function () {
      expect(scope.todos[1]).toEqual(newTodo);
    });
    it("sets scope.newTodo.title to an empty string", function () {
      expect(scope.newTodo.title).toEqual("");
    });
  });

  describe('$scope.editTodo', function () {
    var firstTodo, secondTodo;
    beforeEach(function () {
      scope.todos = [{title: "First"}, {title: "Second"}];
      firstTodo = scope.todos[0];
      secondTodo = scope.todos[1];
    });
    it("enables the editing mode for the selected todo", function () {
      scope.editTodo(secondTodo);
      expect(secondTodo.editing).toBeTruthy();
      expect(scope.editedTodo.title).toEqual("Second");
    });
    it("disables the editing mode for all other todos", function () {
      scope.editTodo(firstTodo);
      scope.editTodo(secondTodo);
      expect(secondTodo.editing).toBeTruthy();
      expect(firstTodo.editing).toBeFalsy();
    });
  });

  describe('$scope.deleteTodo', function () {
    it('deletes the todo', function () {
      scope.todos = [{title: "First todo"}, {title: "Second todo"}];
      scope.deleteTodo(scope.todos[0]);
      expect(scope.todos[0].title).toEqual("Second todo");
    });
  });

});
