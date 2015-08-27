app.controller('ProfileController', ['$scope', 'UserService', function ($scope, UserService) {
    $scope.save = function() {
        UserService.update($scope.user)
            .success(function(data){
                $scope.change_message = 'Le profil a été sauvegardé correctement!';
            })
            .error(function(data){
                $scope.change_message = 'Il y a eu une erreur dans la sauvegarde!';
            });
    }
}]);