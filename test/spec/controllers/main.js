'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('myTodolistWebfrontApp'));

  var backend = 'http://localhost:3000';
  var resource = '/todos';
  var todosPath = function (id) {
    if (id) {
      return backend + resource + '/' + id;
    } else {
      return backend + resource;
    }
  };

  var MainCtrl,
    scope,
    $httpBackend;

  var mockTokenHandler = {
    get: function () {
      return { token: "random_token", email: "email@email.com"}
    },
    set: function () {}
  };

  var initialTodos = [{ id: 1, title: 'First todo'}];

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, _$rootScope_, _$timeout_, _$httpBackend_, $resource) {
    scope = _$rootScope_.$new();
    var Todos = $resource(todosPath() + '/:id', {}, {
      patch: {method: 'PATCH', params: {id: "@id"}}
    });
    $httpBackend = _$httpBackend_;
    $httpBackend.expectGET(todosPath())
      .respond(200, initialTodos);
    MainCtrl = $controller('MainCtrl', {
      $scope: scope,
      $rootScope: scope,
      $timeout: _$timeout_,
      Todos: Todos,
      tokenHandler: mockTokenHandler
    });
    $httpBackend.flush();
  }));

  it('initializes the todos with a query to the server', function () {
    expect(scope.todos[0].id).toEqual(initialTodos[0].id);
    expect(scope.todos[0].title).toEqual(initialTodos[0].title);
  });

  it('uses created_at as the initial sorting predicate', function () {
    expect(scope.predicate).toEqual('created_at');
  });

  it('nullifies $scope.errors when changes to newTodo are made', function () {
    scope.errors = 'An error message';
    scope.$apply(function () {
      scope.newTodo = 'A new todo title';
    });
    expect(scope.errors).toBeNull();
  });

  it('nullifies $scope.errors when changes to editedTodo are made', function () {
    scope.errors = 'An error message';
    scope.$apply(function () {
      scope.editedTodo = 'An edited todo title';
    });
    expect(scope.errors).toBeNull();
  });


  describe('$scope.createTodo', function () {
    var newTodo,
      invalidTitle = Array(150).join('a'); // Long string
    describe('with a valid todo', function () {
      beforeEach(function () {
        newTodo = scope.newTodo = {id: 2, title: "New todo"};
        $httpBackend.expect('POST', todosPath())
          .respond(200, newTodo);
        scope.createTodo();
      });
      it("adds the new todo to the todos array", function () {
        $httpBackend.flush();
        expect(scope.todos[1].title).toBe('New todo');
      });
      it("sets 'submittingNew' back to false", function () {
        expect(scope.submittingNew).toBeTruthy();
        $httpBackend.flush();
        expect(scope.submittingNew).toBeFalsy();
      });
      it("sets scope.newTodo.title to an empty string after the server response", function () {
        expect(scope.newTodo.title).toBe('New todo');
        $httpBackend.flush();
        expect(scope.newTodo.title).toBe('');
      });
    });
    describe('with an invalid todo', function () {
      beforeEach(function () {
        newTodo = scope.newTodo = {id: 2, title: invalidTitle};
        $httpBackend.expect('POST', todosPath())
          .respond(422, {title: ["is too long (maximum is 140 characters)"]});
        scope.createTodo();
      });
      it("doesn't add the todo to the todos array", function () {
        $httpBackend.flush();
        expect(scope.todos[1]).toBeUndefined();
      });
      it("sets 'submittingNew' back to false", function () {
        expect(scope.submittingNew).toBeTruthy();
        $httpBackend.flush();
        expect(scope.submittingNew).toBeFalsy();
      });
      it("leaves 'newTodo' intact", function () {
        expect(scope.newTodo.title).toBe(invalidTitle);
        $httpBackend.flush();
        expect(scope.newTodo.title).toBe(invalidTitle);
      });
    });
  });

  describe('$scope.toggleCompleted', function () {
    var todo;
    beforeEach(function () {
      todo = scope.todos[0];
    });
    describe('when the todo exists', function () {
      beforeEach(function () {
        $httpBackend.expectPATCH(todosPath(1))
          .respond(201);
        scope.toggleCompleted(todo);
      });
      it("toggles the todo's 'completed' attribute immediately", function () {
        expect(todo.completed).toBe(true);
        $httpBackend.flush();
        expect(todo.completed).toBe(true);
      });
      it("sets todo.submitting to true and then back to false", function () {
        expect(todo.submitting).toBe(true);
        $httpBackend.flush();
        expect(todo.submitting).toBe(false);
      });
    });
    describe("when the todo doesn't exist", function () {
      it("removes the todo from $scope.todos", function () {
        $httpBackend.expectPATCH(todosPath(1))
          .respond(404);
        scope.toggleCompleted(todo);
        $httpBackend.flush();
        expect(scope.todos.length).toBe(0);
      });
    });
  });

  describe('$scope.editTodo', function () {
    var firstTodo = {title: "First"},
      secondTodo = {title: "Second"};
    beforeEach(function () {
      scope.todos = [firstTodo, secondTodo];
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
      expect(scope.editedTodo.title).toEqual("Second");
    });
    it("nullifies $scope.errors", function () {
      scope.errors = 'An error message';
      scope.editTodo(secondTodo);
      expect(scope.errors).toBeNull();
    });
  });

  describe('$scope.cancelEditing', function () {
    var todo;
    beforeEach(function () {
      todo = scope.todos[0];
      todo.editing = true;
    });
    it('sets todo.editing to false', function () {
      scope.cancelEditing(todo);
      expect(todo.editing).toBeFalsy();
    });
    it('nullifies $scope.errors', function () {
      scope.errors = 'An error message';
      scope.cancelEditing(todo);
      expect(scope.errors).toBeNull();
    });
  });

  describe('$scope.deleteTodo', function () {
    beforeEach(function () {
      scope.todos = [{id: 1, title: "First todo"}, {id: 2, title: "Second todo"}];
    });
    describe('when deleting an existing todo', function () {
      beforeEach(function () {
        $httpBackend.expect('DELETE', todosPath(1)).respond(201);
        scope.deleteTodo(scope.todos[0]);
      });
      it('deletes the todo', function () {
        $httpBackend.flush();
        expect(scope.todos[0].title).toEqual("Second todo");
        expect(scope.todos[1]).toBeUndefined();
      });
      it('sets $scope.submitting to true prior to deleting', function () {
        expect(scope.todos[0].submitting).toBeTruthy();
        $httpBackend.flush();
      });
    });
    describe("when the todo doesn't exist anymore", function () {
      beforeEach(function () {
        $httpBackend.expect('DELETE', todosPath(1)).respond(404);
        scope.deleteTodo(scope.todos[0]);
      });
      it('deletes the todo anyway', function () {
        $httpBackend.flush();
        expect(scope.todos[0].title).toEqual("Second todo");
        expect(scope.todos[1]).toBeUndefined();
      });
      it('sets $scope.submitting to true prior to deleting', function () {
        expect(scope.todos[0].submitting).toBeTruthy();
        $httpBackend.flush();
      });
    });
  });
});
