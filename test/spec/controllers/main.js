'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('myTodolistWebfrontApp'));

  var MainCtrl,
    scope;

  var mockTokenHandler = {
    get: function () { return { token: "random_token", email: "email@email.com"} },
    set: function () {}
  };

  var mockTodos = {
    query: function () { return [{id: 1}] }
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

  it("should do something", function () {
    expect(true).toBe(true);
  });

});
