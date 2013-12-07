'use strict';

app.factory('Todos', function($resource, ENV) {
  var backend;
  if (ENV === 'production') {
    backend = 'http://todolist-api.herokuapp.com'
  } else {
    backend = 'http://localhost:3000'
  }
  return $resource(backend + '/todos/:id')
});