'use strict';

app.factory('Todos', function() {
  return {
    query: function() {
      return [
        {
          title: "Do something on the webfront",
          completed: false,
          priority: 1
        }
      ];
    }
  };
});