'use strict';

app.factory('tokenHandler', function($rootScope, $http, $q, $location) {
  var token = null,
      currentUser;

  var tokenHandler = {
    set: function (newToken, newUser) {
      token = value;
      currentUser = newUser;
    },
    get: function () {
      if (!token) {
        $rootScope.$broadcast('event:unauthorized');
      } else {
        return {
          token: token,
          currentUser: currentUser
        };
      }
    }
  };

  return tokenHandler;
});
