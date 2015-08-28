app.factory('UserService', ['$http', '$q', function ($http, $q) {
  
    var factory = {};
  
    factory.getAll = function () {
        return $http.get('/users')
            .then(function(data) {
                return data.data;
            },
            function(data){
                return $q.reject(data.data);
            })
    };
  
    factory.get = function (cip) {
        return $http.get('/users/' + cip)
            .then(function(data) {
                return data.data;
            },
            function(data){
                return $q.reject(data.data);
            })
    };

    factory.update = function (user) {
        return $http.put('/users/' + user.cip, user)
            .then(function(data) {
                return data.data;
            },
            function(data){
                return $q.reject(data.data);
            })
    };
    
    factory.login = function () {
        return $http.get('/login')
            .then(function(data) {
                return data.data;
            },
            function(data){
                return $q.reject(data.data);
            })
    };

    factory.create = function(user) {
        return $http.post('/users', user)
            .then(function(data) {
                return data.data;
            },
            function(data){
                return $q.reject(data.data);
            })
    };

    factory.addRight = function(cip, right) {
        return $http.post('/users/' + cip + '/rights', {right: right})
            .then(function(data) {
                return data.data;
            },
            function(data){
                return $q.reject(data.data);
            })
    };

    factory.removeRight = function(cip, right) {
        return $http.delete('/users/' + cip + '/rights?right=' + right)
            .then(function(data) {
                return data.data;
            },
            function(data){
                return $q.reject(data.data);
            })
    };

    factory.isAdmin = function (user) {
        return user.rights.indexOf('admin') > -1;
    };

    factory.getAllRights = function () {
        return $http.get('/user_rights')
            .then(function(data) {
                return data.data;
            },
            function(data){
                return $q.reject(data.data);
            })
    };

    return factory;
}]);