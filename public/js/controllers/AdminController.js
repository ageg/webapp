app.controller('AdminController', ['$scope', 'UserService', '$timeout', function ($scope, UserService, $timeout) {
    UserService.getAll().success(function (data){
        $scope.users = data;
        $scope.usersDisplay = data;
    });
    UserService.getAllRights().success(function(data){
        $scope.rights = data.user_rights;
    });

    $scope.addRight = function(user, right){
        UserService.addRight(user.cip, right)
            .success(function(data){
                user.rights.push(right);

                var match = _.find($scope.users, function(item) { return item.cip === user.cip })
                if (match) {
                    match.rights = user.rights;
                }

                var match = _.find($scope.usersDisplay, function(item) { return item.cip === user.cip })
                if (match) {
                    match.rights = user.rights;
                }
            })
            .error(function(data){
                console.log(JSON.stringify(data));
            });

    };

    $scope.removeRight = function(user, right) {
        UserService.removeRight(user.cip, right)
            .success(function(data){
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
            })
            .error(function(data){
               console.log(JSON.stringify(data));
            });
    };

    $scope.filterName = function(model) {
        $scope.usersDisplay = _.filter($scope.users, function(user){
            var username = user.prenom + ' ' + user.nom;
            return username.indexOf($scope[model]) > -1;
        });
    };

    $scope.filterCip = function(model) {
        $scope.usersDisplay = _.filter($scope.users, function(user){
            return user.cip.indexOf($scope[model]) > -1;
        });
    };

    $scope.checkboxes = {};

    $scope.filterRight = function(right) {
        $scope.usersDisplay = _.filter($scope.users, function(user){
            if ($scope.checkboxes[right]) {
                return user.rights.indexOf(right) > -1;
            } else {
                return true;
            }
        });
    }
}]);