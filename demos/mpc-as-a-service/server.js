/**
 * This is a server instance, it just routes communication
 * between different parties.
 * To run, use:
 *  node server.js [path/to/configuration/file]
 * Configuration file path is optional, by default ./config.js
 * will be used.
 */
console.log('Command line arguments: [/path/to/configuration/file.json]');

// Server setup
var express = require('express');
var app = express();
var http = require('http').Server(app);

// Read configuration
var config = './config.json';
if (process.argv[2] != null) {
  config = process.argv[2];
}
config = require(config);

// Keep track of assigned ids
var assignedCompute = {};
var assignedInput = {};
var options = {
  logs: true,
  hooks: {
    beforeInitialization: [
      function (jiff, computation_id, msg, params) {
        console.log(msg, params);
        if (params.party_id != null) {
          return params;
        }

        var search = config.compute_parties;
        var check = assignedCompute;
        if (msg.role === 'input') {
          search = config.input_parties;
          check = assignedInput;
        }

        for (var p = 0; p < search.length; p++) {
          var id = search[p];
          if (check[id] === true) {
            continue;
          }

          check[id] = true;
          params.party_id = id;
          console.log(id);
          return params;
        }

        return params;
      }
    ]
  }
};

// Create the server
require('../../lib/jiff-server').make_jiff(http, options);

// Serve static files.
app.get('/config.js', function (req, res) {
  var str = 'var config = \'' + JSON.stringify(config) + '\';\n';
  str += 'config = JSON.parse(config);';
  res.send(str);
});

app.use('/demos', express.static('demos'));
app.use('/lib', express.static('lib'));
app.use('/lib/ext', express.static('lib/ext'));
http.listen(8080, function () {
  console.log('listening on *:8080');
});

console.log('** To provide inputs, direct your browser to *:8080/demos/mpc-as-a-service/client.html.');
console.log('** To run a compute party, use the command line and run node compute-party.js [configuration-file] [computation-id]');
console.log('All compute parties must be running before input parties can connect, an input party can leave');
console.log('any time after it submits its input.');
console.log('');