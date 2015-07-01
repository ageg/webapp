var refundsApp = angular.module('refundsApp', ['ngRoute']);
var xhr = new XMLHttpRequest();

refundsApp.controller('refundsCtrl',['$scope', '$http', function($scope,$http){
  $http({
    method: 'GET',
    url: '/refunds'
  }).success(function(data, status, headers, config) {
    console.log('data: ', data );
    $scope.refundList = data;
    $scope.redirectTo = function (dest) {
      window.document.location = dest;
    };
  }).error(function(data, status, headers, config) {
    console.log('Oops and error', data);
  });
  $scope.newRefund = function() {
    // Send empty message to create a new refund entry
    $http({
      data: {
        // TODO: DYNAMIC CIP FFS!
        billCount: 0,
        category: '',
        notes: '',
        reference: '',
        total: 0
      },
      method: 'POST',
      url: '/refunds'
    }).success(function(data, status, headers, config) {
      window.document.location = '#/remboursements/'+data.refund.refundID;
    });
  };
}]);

refundsApp.controller('refundDetailCtrl', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams) {
  $http({
      method: 'GET',
      url: '/refunds/'+$routeParams.id
  }).success(function(data, status, headers, config) {
    console.log('Detailed data: ', data );
    $scope.refundInfo = data[0];
  }).error(function(data, status, headers, config) {
    console.log('Oops and error', data);
  });
  $scope.saveRequest = function() {
    console.log($scope.refundInfo);
    $http({
      data: $scope.refundInfo,
      method: 'PUT',
      url: '/refunds/'+$routeParams.id
    }).success(function(data, status, headers, config) {
      console.log('Detailed data: ', data );
      $scope.refundInfo = data;
    }).error(function(data, status, headers, config) {
      console.log('Oops and error', data);
    });
  };
  $scope.addBill = function() {
    if (!$scope.refundInfo.bills) {
      $scope.refundInfo.bills = [];
    }
    if (!$scope.refundInfo.billCount) {
      $scope.refundInfo.billCount = 0;
    }
    $scope.refundInfo.bills.push({
      billID: ++$scope.refundInfo.billCount,
      filename: '',
      notes: '',
      supplier: '',
      value: 0.00
    });
    $scope.saveRequest();
  };
}]);

refundsApp.config(['$routeProvider', function ($routeProvider) {
  $routeProvider
  .when('/', {
    templateUrl: '/menu.html',
    controller: 'refundsCtrl'
  }).when('/remboursements/', {
    templateUrl: '/menu.html',
    controller: 'refundsCtrl'
  }).when('/remboursements/:id', {
    templateUrl: '/details.html',
    controller: 'refundDetailCtrl'
  });
}]);

refundsApp.filter('sumOfBills', function(){
  return function (data, key) {
    if (typeof (data) === 'undefined' && typeof (key) === 'undefined') {
      return 0;
    }
    var sum = 0;
    for (var i = 0; i < data.length; i++) {
      sum = sum + data[i][key];
    }
    return sum;
  }
});

function upload(fileID){
  var file = document.getElementById(fileID);
  if (typeof file.files === 'undefined')
  {
    
  } else {
    var formData = new FormData();
    formData.append('fichier', file.files[0]);
    formData.append('cip', 'foug1803');
    formData.append('prenom', 'Gab');
    
    var md = "";
    
    var test = {
      cip: 'foug1803',
      prenom: 'gab',
      file: md
    };
    
    var reader = new FileReader();
    var fileBuffer = reader.readAsBinaryString(file.files[0]);
    
    reader.onloadend = function () {
      var jssha = new jsSHA(reader.result,"BYTES");
      md = jssha.getHash("SHA-512","HEX");
      file.innerHTML = md;
      console.log("SHA512: " + (md));
      
      xhr.open('put', '/refunds/uploads', true);
      xhr.setRequestHeader("X-File-Name", file.files[0].name);
      xhr.setRequestHeader("X-File-Size", file.files[0].size);
      xhr.setRequestHeader("X-File-SHA512SUM", md);
      xhr.send(file.files[0]);
    }
  }
}

/* Check the response status */
xhr.onreadystatechange = function() 
{
  if (xhr.readyState == 4) 
  {
    alert(xhr.status+' '+xhr.statusText);
  }
}