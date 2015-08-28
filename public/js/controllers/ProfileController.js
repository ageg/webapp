app.controller('ProfileController', ['$scope', 'UserService', function ($scope, UserService) {
    $scope.save = function() {
        UserService.update($scope.user)
            .then(function(data){
                $scope.change_message = 'Le profil a été sauvegardé correctement!';
            }, function(data){
                $scope.change_message = 'Il y a eu une erreur dans la sauvegarde!';
            });
    }
}]);