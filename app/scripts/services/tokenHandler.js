'use strict';

app.factory('tokenHandler', function($rootScope, $http, $q, $location, $cookies) {

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
      $cookies.token = newToken;
      $cookies.email = newEmail;
    },
    get: function () {
      if (!$cookies.token) {
        $rootScope.$broadcast('event:unauthorized');
        return null;
      } else {
        return {
          token: $cookies.token,
          email: $cookies.email
        };
      }
    },
    delete: function () {
      delete $cookies.token;
      delete $cookies.email;
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
