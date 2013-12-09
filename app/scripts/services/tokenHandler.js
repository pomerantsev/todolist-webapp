'use strict';

app.factory('tokenHandler', function($rootScope, $http, $q, $location, $cookies) {
  var token = $cookies.token,
      email = $cookies.email;

  // https://gist.github.com/nblumoe/3052052
  var tokenWrapper = function (resource, action) {
    resource['_' + action] = resource[action];
    resource[action] = function (data, success, error) {
      return resource['_' + action](
        angular.extend({}, data || {}, {
          user_token: tokenHandler.get().token,
          user_email: tokenHandler.get().email
        }),
        success,
        error
      );
    };
  };

  var tokenHandler = {
    set: function (newToken, newEmail) {
      token = $cookies.token = newToken;
      email = $cookies.email = newEmail;
    },
    get: function () {
      if (!token) {
        $rootScope.$broadcast('event:unauthorized');
      } else {
        return {
          token: token,
          email: email
        };
      }
    },
    wrapActions: function (resource, actions) {
      var wrappedResource = resource;
      for (var i = 0; i < actions.length; i++) {
        tokenWrapper(wrappedResource, actions[i]);
      }
      return wrappedResource;
    }
  };

  return tokenHandler;
});
