'use strict';

app.factory('Todos', function($resource, backend) {
  return $resource(backend + '/todos/:id', {}, {
    patch: {method: 'PATCH', params: {id: "@id"}}
  });
});
