var refundsApp = angular.module('refundsApp', ['ngRoute']);
var xhr = new XMLHttpRequest();

refundsApp.controller('refundsCtrl',['$scope', '$http', function($scope,$http){
  /*$.ajax({
    //data: data,
    dataType: "json",
    method: "GET",
    success: function(data, status, jqXHR){
      $scope.refundList = data;
    },
    url: "/refunds"
  });*/
  $http({method: 'GET', url: '/refunds'}).success(function(data, status, headers, config) {
    console.log('data: ', data );
    $scope.refundList = data;
  }).error(function(data, status, headers, config) {
    console.log('Oops and error', data);
  });
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
}]);

refundsApp.config(['$routeProvider', function ($routeProvider) {
  $routeProvider
  .when('/', {
    templateUrl: '/menu.html',
    controller: 'refundsCtrl'
  }).when('/:id', {
    templateUrl: '/details.html',
    controller: 'refundDetailCtrl'
  })
  .when('/remboursements/', {
    templateUrl: '/menu.html',
    controller: 'refundsCtrl'
  }).when('/remboursements/:id', {
    templateUrl: '/details.html',
    controller: 'refundDetailCtrl'
  });
}]);

function addBill()
{
  //document.getElementById('bill_count').value++;
  var billCount = ++document.getElementById('bill_count').value;
  var form = document.getElementById('refundform');
  
  var billfs = document.createElement("fieldset");
  var legend = document.createElement("legend");
  legend.innerHTML="Facture #"+billCount;
  billfs.appendChild(legend);
  
  var div = document.createElement("div");
  div.setAttribute('class', 'form-group');
  var label = document.createElement("label");
  label.setAttribute('for','supplier'+billCount);
  label.innerHTML='Fournisseur';
  var input = document.createElement("input");
  input.setAttribute('type',"text");
  input.setAttribute('class',"form-control");
  input.setAttribute('id','supplier'+billCount);
  input.setAttribute('name','supplier'+billCount);
  
  div.appendChild(label);
  div.appendChild(input);
  billfs.appendChild(div);
  
  div = document.createElement("div");
  div.setAttribute('class', 'form-group');
  label = document.createElement("label");
  label.setAttribute('for','value'+billCount);
  label.innerHTML='Montant';
  input = document.createElement("input");
  input.setAttribute('type',"number");
  input.setAttribute('class',"form-control");
  input.setAttribute('id','value'+billCount);
  input.setAttribute('name','value'+billCount);
  input.setAttribute('step','0.01');
  input.setAttribute('value','0');
  
  div.appendChild(label);
  div.appendChild(input);
  billfs.appendChild(div);
  
  div = document.createElement("div");
  div.setAttribute('class', 'form-group');
  label = document.createElement("label");
  label.setAttribute('for','bill'+billCount);
  label.innerHTML='Montant';
  input = document.createElement("input");
  input.setAttribute('type',"file");
  input.setAttribute('class',"form-control");
  input.setAttribute('id','bill'+billCount);
  input.setAttribute('name','bill'+billCount);
  input.setAttribute('onchange','upload(this.id);');
  
  div.appendChild(label);
  div.appendChild(input);
  billfs.appendChild(div);
  
  div = document.createElement("div");
  div.setAttribute('class', 'form-group');
  label = document.createElement("label");
  label.setAttribute('for','note'+billCount);
  label.innerHTML='Notes';
  input = document.createElement("textarea");
  input.setAttribute('class',"form-control");
  input.setAttribute('id','note'+billCount);
  input.setAttribute('name','note'+billCount);
  input.setAttribute('placeholder','Notes spécifiques à la facture');
  input.setAttribute('rows','4');
  
  div.appendChild(label);
  div.appendChild(input);
  billfs.appendChild(div);
  
  form.insertBefore(billfs,document.getElementById('marker'));
  var formStr = saveRequest(billCount,-1);
  form.setAttribute('oninput',formStr.sumString);
  document.getElementById('totalOut').setAttribute('for',formStr.fieldString);
}

function saveRequest(billCount, offset) {
  /***
   * Arguments
   * billCount: number of bills in the request
   * offset: offset to max billCount (-1 from addBill, 0 from save instruction)
   ***/
  // Make sure numbers were given, not strings
  billCount = parseInt(billCount); 
  offset = parseInt(offset);
  // Build JSON object
  var tmp = {
    billCount: billCount,
    bills: [],
    category: document.getElementById('category').value,
    notes: document.getElementById('notes').value,
    ref: document.getElementById('reference').value,
    reqID: document.getElementById('refund_id').value,
    total: document.getElementById('total').value
  };
  
  var bill = {};
  var note = '';
  var out = {
    fieldString: '',
    sumString: "total.value=(totalOut.value=Math.round((0.000001"
  };
  var supplier = '';
  var value = '';
  var file = '';
  var jssha = new jsSHA();
  var md = '';
  for (var i = 1; i <= (billCount + offset); i++) {
    // Collect info
    note = document.getElementById('note'+i).value;
    supplier = document.getElementById('supplier'+i).value;
    value = document.getElementById('value'+i).value;
    file = document.getElementById('bill'+i).value; // Grab the file handler
    // Sanitize
    note = (typeof note === 'undefined') ? '' : note;
    supplier = (typeof supplier === 'undefined') ? '' : supplier;
    value = (typeof value === 'undefined') ? 0 : value;
    md = (typeof file.files === 'undefined') ? '' : jssha(file.files[0]).getHash("SHA-512","HEX");
    //md = (typeof file.files === 'undefined') ? '' : md.update(file.files[0]).digest().toHex();// Build the file hash
    // Build JSON object
    bill = {
      fileHash: md,
      note: note,
      supplier: supplier,
      value: value
    };
    tmp.bills[i-1] = bill;
    // Build output strings
    out.sumString += "+parseFloat(value"+(i)+".value)";
    out.fieldString += "value"+(i);
  }
  // Send JSON object through AJAX
  xhr.open('post','refunds/request/update', true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(JSON.stringify(tmp));
  
  // Bonus: Return the sumString for the total field
  out.sumString += "+parseFloat(value"+billCount+".value))*100)/100)";
  out.fieldString += "value"+billCount;
  return out;
}

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