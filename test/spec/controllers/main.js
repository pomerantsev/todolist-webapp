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
      scope.todos = [{id: 1, title: "First todo"}, {id: 2, title: "Second todo"}];
      $httpBackend.expect('DELETE', todosPath(1))
        .respond(200);
      scope.deleteTodo(scope.todos[0]);
      expect(scope.todos[0].submitting).toBeTruthy();
      $httpBackend.flush();
      expect(scope.todos[0].title).toEqual("Second todo");
      expect(scope.todos[0].submitting).toBeFalsy();
    });
  });

});
