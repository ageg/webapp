var agegApp = angular.module('agegApp', ['ngRoute']);

agegApp.controller('agegHeader',['$http', '$rootScope', '$scope', 'sharedUserInfo', function($http, $rootScope, $scope, sharedUserInfo) {
  $http({
    method: 'GET',
    url: '/user'
  }).then(function(response) {
    $scope.userInfo = response.data;
  });
  $scope.connected = function() {
    return $scope.userInfo !== undefined && $scope.userInfo.cip !== undefined;
  };
  $scope.fullName = function() {
    return $scope.userInfo.prenom + " " + $scope.userInfo.nom;
  };
  sharedUserInfo.setUser($scope.userInfo);
}]);

agegApp.controller('profileCtrl',['$http', '$route', '$routeParams', '$scope', function($http, $route, $routeParams, $scope) {
  $http({
    method: 'GET',
    url: '/user'
  }).then(function(response) {
    $scope.userInfo = response.data;
  });
  $scope.profileSubmit = function () {
    $http({
      data: $scope.userInfo,
      method: 'PUT',
      url: '/user/'
    }).then(function(data, status, headers, config) {
      $scope.refundInfo = data;
      $route.reload();
    },function(data, status, headers, config) {
      console.log('Oops and error', data);
    });
  };
}]);

agegApp.controller('refundsCtrl',['$scope', '$http', function($scope,$http){
  $http({
    method: 'GET',
    url: '/refunds'
  }).success(function(data, status, headers, config) {
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

agegApp.controller('refundDetailCtrl', ['$scope', '$http', '$routeParams', function ($scope, $http, $routeParams) {
  $http({
    method: 'GET',
    url: '/refunds/'+$routeParams.id
  }).success(function(data, status, headers, config) {
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

agegApp.controller('voteAdminCtrl',['$http', '$rootScope', '$scope', 'sharedUserInfo', function ($http, $rootScope, $scope, sharedUserInfo) {
  $http({
    method: 'GET',
    url: '/votesAdmin'
  }).then( function(data, status, headers, config) {
    $scope.voteList = data.data;
  }, function(data, status, headers, config) {
    console.log('Oops and error', data);
  });
  $scope.newVote = function () {
    $http({
      data: sharedUserInfo.getUser(),
      method: 'POST',
      url: '/votesAdmin'
    }).then(function (data, status, headers, config) {
      // Redirect
    }, function (data, status, headers, config) {
      console.log('Oops and error', data);
    });
  };
}]);

agegApp.controller('voteAdminDetailCtrl',['$http', '$routeParams', '$scope', function ($http, $routeParams, $scope) {
  $http({
    method: 'GET',
    url: '/votesAdmin/'+$routeParams.id
  }).then( function(data, status, headers, config) {
    $scope.voteInfo = data.data;
    $scope.voteInfo.startDate = $scope.ParseDate($scope.voteInfo.startDate);
    $scope.voteInfo.endDate = $scope.ParseDate($scope.voteInfo.endDate)
  }, function(data, status, headers, config) {
    console.log('Oops and error', data);
  });
  $scope.MakeCEForm = function () {
    $scope.voteInfo.votes = [{
      prompt: 'Présidence'
    }, {
      prompt: 'Vice-Présidence aux Affaires Externes'
    }, {
      prompt: 'Vice-Présidence aux Affaires Financières'
    }, {
      prompt: 'Vice-Présidence aux Affaires Internes'
    }, {
      prompt: 'Vice-Présidence aux Affaires Pédagogiques'
    }, {
      prompt: 'Vice-Présidence aux Affaires Sociales'
    }, {
      prompt: 'Vice-Présidence aux Affaires Universitaires'
    }, {
      prompt: 'Vice-Présidence à la Formation Étudiante'
    }, ];
    $scope.voteSubmit();
  };
  $scope.voteSubmit = function () {
    $http({
      data: $scope.voteInfo,
      method: 'PUT',
      url: '/votesAdmin/'+$routeParams.id
    }).then( function(data, status, headers, config) {
      $scope.voteInfo = data.data;
      $scope.voteInfo.startDate = $scope.ParseDate($scope.voteInfo.startDate);
      $scope.voteInfo.endDate = $scope.ParseDate($scope.voteInfo.endDate)
    }, function(data, status, headers, config) {
      console.log('Oops and error', data);
    });
  };
  $scope.ParseDate = function (value) {
    var tmp = new Date();
    if (value) {
      tmp = new Date(value);
    }
    return tmp;
  };
}]);

agegApp.controller('voteMenuCtrl',['$http', '$scope', function ($http, $scope) {
  $http({
    method: 'GET',
    url: '/votes'
  }).then( function(data, status, headers, config) {
    $scope.voteInfo = data;
  }, function(data, status, headers, config) {
    console.log('Oops and error', data);
  });
}]);

agegApp.config(['$routeProvider', function ($routeProvider) {
  $routeProvider
  .when('/', {
    templateUrl: '/index.html',
    controller: 'profileCtrl'
  }).when('/profil', {
    templateUrl: '/profile.html',
    controller: 'profileCtrl'
  }).when('/remboursements/', {
    templateUrl: '/refundMenu.html',
    controller: 'refundsCtrl'
  }).when('/remboursements/:id', {
    templateUrl: '/refundDetails.html',
    controller: 'refundDetailCtrl'
  }).when('/vote',{
    templateUrl: '/voteMenu.html',
    controller: 'voteMenuCtrl'
  }).when('/vote/:id',{
    templateUrl: '/voteDetail.html',
    controller: 'voteDetailCtrl'
  }).when('/voteAdmin',{
    templateUrl: '/voteAdmin.html',
    controller: 'voteAdminCtrl'
  }).when('/voteAdmin/:id',{
    templateUrl: '/voteAdminDetail.html',
    controller: 'voteAdminDetailCtrl'
  }).otherwise({
    redirectTo: '/'
  });
}]);

agegApp.factory('sharedUserInfo', function($rootScope) {
  var userInfo = {};
  return {
    getUser: function () {
      return userInfo;
    }, setUser: function (value) {
      userInfo = value;
    }
  };
});

agegApp.filter('sumOfBills', function(){
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