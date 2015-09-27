app.controller('3DController', ['scope', 'UserService', function($scope, UserService){
  $http.get('/3dprint/').then(function(data){
    console.log('AJAX 3DPrint Data:');
    console.log(data);
    $scope.printJobs = data;
  }).function(data, status, headers, config){
    console.log('Oops and error', data);
  };
}]);