app.factory('UserService', ['$http', function ($http) {
  
  var factory = {};
  
  factory.getAll = function () {
    return $http.get('/users')
        .success(function (data) {
      return data;
    })
        .error(function (data) {
      return data;
    });
  };
  
  factory.get = function (cip) {
    return $http.get('/users/' + cip)
        .success(function (data) {
      return data;
    })
        .error(function (data) {
      return data;
    });
  };

  factory.update = function (user) {
    return $http.put('/users/' + user.cip, user)
        .success(function(data) {
          return data;
        })
        .error(function(data) {
          return data;
        })
  };
    
  factory.login = function () {
    return $http.get('/login')
      .success(function (data) {
        return data;
      })
        .error(function (data) {
        return data;
      });
  };

  factory.create = function(user) {
    return $http.post('/users', user)
      .success(function (data) {
        return data;
      })
      .error(function (data) {
        return data;
      })
  };

  factory.addRight = function(cip, right) {
    return $http.post('/users/' + cip + '/rights', {right: right})
      .success(function(data) {
        return data;
      })
      .error(function(data){
        return data;
      })
  };

  factory.removeRight = function(cip, right) {
    return $http.delete('/users/' + cip + '/rights?right=' + right)
      .success(function(data) {
        return data;
      })
      .error(function(data){
        return data;
      })
  };

  factory.isAdmin = function (user) {
    return user.rights.indexOf('admin') > -1;
  };

  factory.getAllRights = function () {
    return $http.get('/user_rights')
      .success(function (data) {
        return data;
      })
      .error(function (data){
        return data;
      })
  };

  return factory;
}]);