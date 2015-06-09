var xhr = new XMLHttpRequest;

function markError(fieldID) {
  var classSet = false;
  var count = 0;
  var field = document.getElementById(fieldID);
  var fieldClasses = field.className.split(' ');
  var i = 0;
  
  for (i = 0, count = fieldClasses.length; i < count; i++) {
    classSet = classSet || (fieldClasses[i].localeCompare('error') == 0);
  }
  if (!classSet) {
    field.className += ' error';
  }
}

function updateProfile(fieldID) {
  var classes;
  var classSet = false;
  var count = 0;
  var field = document.getElementById(fieldID);
  var i = 0;
  var regEx = new RegExp(field.getAttribute('pattern'));
  var tmp = {};
  
  classes = field.className.split(' ');
  if (regEx.test(field.value)) {
    // Make sure to remove the invalid highlighting
    for (i = 0, count = classes.length; i < count; i++) {
      if (classes[i].localeCompare('error') == 0) {
        classes.splice(i--, 1);
        count--;
      }
    }
    field.className = classes.join(' ');
    // AJAX
    tmp[fieldID] = field.value;
    
    xhr.open('post','profile/ajax', true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(tmp));
  } else {
    // Current field has failed the REGEX test, flag it.
    markError(fieldID);
  }
}

/* Check the response status */
xhr.onreadystatechange = function() 
{
  if (xhr.readyState == 4) {
    alert(xhr.status+' '+xhr.statusText);
    // Results handling
    switch (xhr.status) {
      case 200: // 200 OK Do Nothing
        break;
      case 207: // 207 Multi-Status, we have at least one error from the server
        var res = JSON.parse(xhr.responseText)
        console.log(res);
        Object.keys(res).forEach(function (elem){
          markError(elem);
        });
        break;
      case 401: // 401 Unauthorized
        // TODO: Re-Authentication
      default:
        console.log('Unhandled: '+xhr.status+' '+xhr.statusText);
    }
  }
}