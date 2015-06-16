var xhr = new XMLHttpRequest;
//var cxhr = new XMLHttpRequest; // Challenge XMLHttpRequest

function challengeUser() {
  var uname = $('#uname').val();
  var password = $('#password').val();
  
  if (uname == '') {
    markError('uname');
    alert("Le nom d'utilisateur fourni est vide");
    return;
  }
  if (password == '') {
    markError('password');
    alert("Le mot de passe fourni est vide");
    return;
  }
  $.post('/profile/challenge', {
    uname: uname,
    password: password
  }, function(data, status, xhr){
    if (status.localeCompare('success') === 0) {
      // 200 OK
      if (data.auth) {
        unMarkError('uname');
        unMarkError('password');
        lockPassword();
        alert("L'authentification a réussi.");
      } else {
        // Clear input fields
        $("uname").removeAttribute('value');
        $("password").removeAttribute('value');
        alert("L'authentification a échoué.");
      }
    } else {
      alert('$POST reported status ' + status);
    }
  }, 'json');
}

function lockPassword() {
  $('#password').attr({
    disabled: true,
    value: ''
  });
}

function markError(fieldID) {
  if(!$('#'+fieldID).hasClass('error')) {
    $('#'+fieldID).addClass('error');
  }
}

function unlockPassword() {
  $('#password').removeAttr('disabled');
}

function unMarkError(fieldID) {
  $('#'+fieldID).removeClass('error');
}

function updateProfile(fieldID) {
  var regEx = new RegExp($('#'+fieldID).attr('pattern'));
  var tmp = {};
  
  if (regEx.test($('#'+fieldID).val())) {
    unMarkError(fieldID);
    
    // Use intermediary block as we don't know what field we're sending home...
    tmp[fieldID] = $('#'+fieldID).val();
    $.post('/profile/ajax', tmp).done(function(data) {
      if (typeof(data) === 'string') {
        // Received JSON string instead of Object
        data = JSON.parse(data);
      }
      Object.keys(data).forEach(function(elem) {
        if (data[elem]) {
          // Replied field is OK (ACK)
          unMarkError(elem);
        } else {
          // Replied field is not OK (NAK)
          markError(elem);
        }
      });
    }).fail(function(jqXHR, textStatus, errorThrown) {
      alert('Status: '+textStatus+'\nError: '+errorThrown);
    });
  } else {
    // Current field has failed the REGEX test, flag it.
    markError(fieldID);
  }
}