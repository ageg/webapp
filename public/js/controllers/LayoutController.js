app.controller('LayoutController', ['$scope', 'UserService', '$window', function ($scope, UserService, $window) {
  UserService.login()
    .then(function (data) {
      UserService.get(data.cip)
          .then(function (user) {
            $scope.user = user;
            $scope.user.isAdmin = UserService.isAdmin(user);
      }, function (err) {
          UserService.create({cip: data.cip, prenom: '', nom: '', email: '', phone: '', concentration: 'Informatique', promo: 0})
            .then(function(userdata) {
                $scope.user = userdata;
                $scope.user.isAdmin = UserService.isAdmin(userdata);
              }, function (noo){
              console.log(JSON.stringify(noo));
          });
      });
    }, function (data) {
      $window.location = data.path
    });

  $scope.logout = function() {
    UserService.logout()
        .then(function(data) {
            $window.location.reload();
        }, function (err) {
            $window.location.reload();
            console.log(JSON.stringify(err));
        });
  };
}]);