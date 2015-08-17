var refundsApp = angular.module('refundsApp', ['ngRoute', 'flow']);
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
  $scope.archiveColor = function(status) {
    var rowClass = "";
    switch(status) {
      case 0:
        rowClass = "danger";
        break;
      case 1:
        rowClass = "warning";
        break;
      case 2:
        rowClass = "success";
        break;
      default:
        break;
    }
    return rowClass;
  };
  $scope.archiveDecision = function (status) {
    var rowStatus = "";
    switch (status) {
      case 0:
        rowStatus = "Refusée";
        break;
      case 1:
        rowStatus = "TODO";
        break;
      case 2:
        rowStatus = "Acceptée";
        break;
      default:
        break;
    }
    return rowStatus;
  };
}]);

refundsApp.controller('refundDetailCtrl', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams) {
  $http({
      method: 'GET',
      url: '/refunds/'+$routeParams.id
  }).success(function(data, status, headers, config) {
    console.log('Detailed data: ', data );
    $scope.refundInfo = data;
    $scope.refundInfo.archive = $scope.refundInfo.reviewDate;
    // TODO: User Admin Management
    $scope.refundInfo.submitted = $scope.refundInfo.submitDate;
  }).error(function(data, status, headers, config) {
    console.log('Oops and error', data);
  });
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
  $scope.deny = function () {
    $scope.review(0);
  };
  $scope.grant = function () {
    $scope.review(2);
  };
  $scope.reqSubmit = function () {
    console.log('Form Submit Sent');
    $scope.refundInfo.submitDate = Date.now();
    $scope.refundInfo.submitted = true;
    $scope.saveRequest();
    window.document.location = '#/remboursements/';
  };
  $scope.review = function (status) {
    if($scope.refundInfo.reviewNote) {
      // Review Note supplied
      $scope.refundInfo.reviewError = "";
      //$scope.refundInfo.reviewer = 
      $scope.refundInfo.reviewDate = Date.now();
      $scope.refundInfo.status = status;
      $scope.refundInfo.archive = true;
      $scope.saveRequest();
      window.document.location = '#/remboursements/';
    } else {
      // Review Note not supplied, abort!
      $scope.refundInfo.reviewError = "has-error has-feedback";
      alert("La révision n'a pas laissé de note.");
    }
  };
  $scope.saveRequest = function() {
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
  $scope.upload = function (fieldID) {
    console.log($("#"+fieldID));
    upload(fieldID, $routeParams.id);
  };
  $scope.uploadFile = function(fieldID) {
    $http({
      data: $.param($scope.formData),
      method: 'POST',
      url: '/uploads/refunds',
      
    });
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

refundsApp.config(['flowFactoryProvider', function (flowFactoryProvider) {
  flowFactoryProvider.defaults = {
    target: 'upload.php',
    permanentErrors: [404, 500, 501],
    maxChunkRetries: 1,
    chunkRetryInterval: 5000,
    simultaneousUploads: 4
  };
  flowFactoryProvider.on('catchAll', function (event) {
    console.log('catchAll', arguments);
  });
  // Can be used with different implementations of Flow.js
  // flowFactoryProvider.factory = fustyFlowFactory;
}]);

refundsApp.filter('sumOfBills', function(){
  return function (data, key) {
    if (typeof (data) === 'undefined' || typeof (key) === 'undefined') {
      return 0;
    }
    var sum = 0;
    //console.log(data);
    for (var i = 0; i < data.length; i++) {
      sum = sum + data[i][key];
    }
    return sum;
  }
});

function upload(fileID, reqID){
  var file = $("#"+fileID)[0]; // Use only the first file from the array
  if (typeof file.files === 'undefined')
  {
    
  } else {
    var md = "";
    
    var reader = new FileReader();
    var fileBuffer = reader.readAsBinaryString(file.files[0]);
    
    reader.onloadend = function () {
      var jssha = new jsSHA("SHA-512","BYTES");
      jssha.update(reader.result);
      md = jssha.getHash("HEX");
      file.innerHTML = md;
      
      $.ajax({
        data: reader.result,
        headers: {
          'X-File-Name': file.files[0].name,
          'X-File-Size': file.files[0].size,
          'X-File-SHA512SUM': md,
          'X-Req-BillID':fileID.slice(4),
          'X-Req-ID': reqID
        },
        method: 'POST',
        url: '/uploads/refunds'
      });
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