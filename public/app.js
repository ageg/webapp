var myApp = angular.module('myApp',[]);

myApp.controller('FindCipController', ['$scope', function($scope) {
  $("#cip").keyup(function() {
    $("#pNotFound").addClass("ng-hide");
  });

  $scope.findUser = function() {
    if ($scope.cip !== undefined) {
      $scope.findUserCip($scope.cip);
    }
  };



  $scope.findUserCip = function(cip) {
    $scope.cip = cip;
    $("#userFound").addClass("ng-hide");
    $.get("findCIP", { cip: cip }, function(data, status){
        $scope.rights = data.rights;
        if (data.user === null) {
          $("#pNotFound").removeClass("ng-hide");
        }
        else
        {
          $("#userFound").removeClass("ng-hide");
          $scope.user = data.user;
          $scope.$apply();
        }
    });
  };

  $scope.deleteRight = function(right) {
    $.post('removeRight', {cip: $scope.user.cip, right: right}, function(){
      $scope.findUser();
    })
  };

  $scope.addRight = function() {
    $.post('addRight', {cip: $scope.user.cip, right: $("#newRight").val()}, function(){
      $scope.findUser();
    })
  };
}]);