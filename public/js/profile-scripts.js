var xhr = new XMLHttpRequest;
var cxhr = new XMLHttpRequest; // Challenge XMLHttpRequest

function challengeUser() {
  var username = document.getElementById('username').value;
  var password = document.getElementById('password').value;
  
  if (username == '') {
    markError('username');
    alert("Le nom d'utilisateur fourni est vide");
    return;
  }
  if (password == '') {
    markError('password');
    alert("Le mot de passe fourni est vide");
    return;
  }
  cxhr.open('post','profile/challenge', true);
  cxhr.setRequestHeader("Content-Type", "application/json");
  cxhr.send(JSON.stringify({
    username: username,
    password: password
  }));
}

cxhr.onreadystatechange = function() 
{
  if (cxhr.readyState == 4) {
    // Results handling
    switch (cxhr.status) {
      case 200: // 200 OK Do Nothing
        // Server must return a JSON object containing a bool
        if (JSON.parse(cxhr.responseText).auth) {
          unMarkError('username');
          unMarkError('password');
          lockPassword();
          alert("L'authentification a réussi.");
        } else {
          alert("L'authentification a échoué.");
          // Clear input fields
          $("username").removeAttribute('value');
          $("password").removeAttribute('value');
        }
        break;
      default:
        alert(cxhr.status+' '+cxhr.statusText);
        console.log('Unhandled: '+cxhr.status+' '+cxhr.statusText);
    }
  }
}

function lockPassword() {
  var field = document.getElementById('password');
  field.setAttribute('disabled',true);
  field.removeAttribute('value');
}

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

function unlockPassword() {
  document.getElementById('password').removeAttribute('disabled');
}

function unMarkError(fieldID) {
  var field = document.getElementById(fieldID);
  var classes = field.className.split(' ');
  // Remove invalid highlighting
  for (i = 0, count = classes.length; i < count; i++) {
    if (classes[i].localeCompare('error') == 0) {
      classes.splice(i--, 1);
      count--;
    }
  }
  field.className = classes.join(' ');
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