'use strict';

app.factory('Todos', function($resource, ENV) {
  var backend;
  if (ENV === 'production') {
    backend = 'http://todolist-api.herokuapp.com'
  } else if (ENV === 'development') {
    backend = 'http://localhost:3000'
  }
  return $resource(backend + '/todos/:id', {}, {
    patch: {method: 'PATCH', params: {id: "@id"}}
  });
});
