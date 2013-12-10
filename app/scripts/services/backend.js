'use strict';

app.factory('backend', function(ENV) {
  var backend;
  if (ENV === 'production') {
    backend = 'https://todolist-api.herokuapp.com'
  } else if (ENV === 'development') {
    backend = 'http://localhost:3000'
  }
  return backend;
});
