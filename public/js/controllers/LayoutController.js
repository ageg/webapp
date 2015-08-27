app.controller('LayoutController', ['$scope', 'UserService', '$window', function ($scope, UserService, $window) {
  UserService.login()
    .success(function (data) {
      UserService.get(data.cip).success(function (user) {
        $scope.user = user;
        $scope.user.isAdmin = UserService.isAdmin(user);
      })
      .error(function (err) {
          UserService.create({cip: data.cip, prenom: '', nom: '', email: '', phone: '', concentration: 'Informatique', promo: 0})
            .success(function(userdata) {
                $scope.user = userdata;
                $scope.user.isAdmin = UserService.isAdmin(userdata);
              })
            .error(function (noo){
              console.log(JSON.stringify(noo));
          });
      });
    })
    .error(function (data) {
      $window.location = data.path
    });
}]);