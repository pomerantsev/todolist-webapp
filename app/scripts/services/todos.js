'use strict';

app.factory('Todos', function($resource) {
  // return $resource('http://localhost:3000/todos/:id')
  return $resource('http://todolist-api.herokuapp.com/todos/:id')
});