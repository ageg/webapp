app.controller('AdminController', ['$scope', 'UserService', '$timeout', function ($scope, UserService, $timeout) {
    UserService.getAll()
        .then(function (data){
            $scope.users = data;
            $scope.usersDisplay = data;
        }, function(data) {
            console.log(JSON.stringify(data));
    });

    UserService.getAllRights()
        .then(function(data){
            $scope.rights = data.user_rights;
        }, function(data) {
            console.log(JSON.stringify(data));
    });

    $scope.addRight = function(user, right){
        UserService.addRight(user.cip, right)
            .then(function(data){
                user.rights.push(right);

                var match = _.find($scope.users, function(item) { return item.cip === user.cip })
                if (match) {
                    match.rights = user.rights;
                }

                var match = _.find($scope.usersDisplay, function(item) { return item.cip === user.cip })
                if (match) {
                    match.rights = user.rights;
                }
            }, function(data){
                console.log(JSON.stringify(data));
            });

    };

    $scope.removeRight = function(user, right) {
        UserService.removeRight(user.cip, right)
            .then(function(data){
                var index = user.rights.indexOf(right);
                if (index > -1) {
                    user.rights.splice(index, 1);
                }

                var match = _.find($scope.users, function(item) { return item.cip === user.cip })
                if (match) {
                    match.rights = user.rights;
                }
                var match = _.find($scope.usersDisplay, function(item) { return item.cip === user.cip })
                if (match) {
                    match.rights = user.rights;
                }
            }, function(data){
               console.log(JSON.stringify(data));
            });
    };

    $scope.checkboxes = {};
    $scope.cipFilter = '';
    $scope.nameFilter = '';

    $scope.filter = function(cip, name) {
      $scope.usersDisplay = _.filter($scope.users, function(user) {
        var filter = true;
        $scope.rights.forEach(function(right) {
          if ($scope.checkboxes[right] && filter) {
            filter = user.rights.indexOf(right) > -1;
          }
        });

        if (filter) {
          var username = user.prenom + ' ' + user.nom;
          filter = username.indexOf($scope[name]) > -1 && user.cip.indexOf($scope[cip]) > -1;
        }

        return filter;
      });
    };
}]);