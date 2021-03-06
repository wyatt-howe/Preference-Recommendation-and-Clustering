/**
 * Do not modify this file unless you have too
 * This file has UI handlers.
 */
var Zp = 15485867;

// eslint-disable-next-line no-unused-vars
function connect() {
  $('#connectButton').prop('disabled', true);
  var computation_id = $('#computation_id').val();
  var party_count = 2;

  if (isNaN(party_count)) {
    $('#output').append('<p class="error">Party count must be a valid number!</p>');
    $('#connectButton').prop('disabled', false);
  } else {
    var options = { party_count: party_count, Zp: Zp };
    options.onError = function (error) {
      $('#output').append('<p class="error">'+error+'</p>');
    };
    options.onConnect = function () {
      $('#button').attr('disabled', false); $('#output').append('<p>All parties Connected!</p>');
    };

    var hostname = window.location.hostname.trim();
    var port = window.location.port;
    if (port == null || port === '') {
      port = '80';
    }
    if (!(hostname.startsWith('http://') || hostname.startsWith('https://'))) {
      hostname = 'http://' + hostname;
    }
    if (hostname.endsWith('/')) {
      hostname = hostname.substring(0, hostname.length-1);
    }
    if (hostname.indexOf(':') > -1 && hostname.lastIndexOf(':') > hostname.indexOf(':')) {
      hostname = hostname.substring(0, hostname.lastIndexOf(':'));
    }

    hostname = hostname + ':' + port;
    // eslint-disable-next-line no-undef
    mpc.connect(hostname, computation_id, options);
  }
}

function hashString(strData) {
  var hash = 0, i, chr;
  if (strData.length === 0) {
    return hash;
  }
  for (i = 0; i < strData.length; i++) {
    chr   = strData.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }

  if (hash < 0) {
    hash = hash * -1;
  }

  return hash % Zp;
}

function och() {
    document.getElementById("rv").innerHTML=document.getElementById("input_item10").value;
}

// eslint-disable-next-line no-unused-vars
function submit() {
  $('#compareBtn').attr('disabled', true);
      
      var base64 = $('form').serialize();  // form data (preferences)
      base64 = hashString(base64);

      // Begin MPC comparison
      // eslint-disable-next-line no-undef
      var promise = mpc.compute(base64);
      promise.then(handleResult);
    img.src = reader.result;
  reader.readAsDataURL(file);
}

function handleResult(result) {
  console.log(result);
  var statement = result === 1 ? 'the same' : 'different';
  $('#output').append('<p>The preferences are ' + statement + '.</p>');
  $('#button').attr('disabled', false);
}
