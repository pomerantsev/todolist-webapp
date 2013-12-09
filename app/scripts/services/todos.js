'use strict';

app.factory('Todos', function($resource, backend, tokenHandler) {
  var Todos = $resource(backend + '/todos/:id', {}, {
    patch: {method: 'PATCH', params: {id: "@id"}}
  });

  tokenHandler.wrapActions(Todos, ["query", "save", "delete", "patch"]);
  return Todos;
});
