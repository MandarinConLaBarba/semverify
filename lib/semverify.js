var fs = require('fs'),
    JSONParser = require('jsonparse'),
    eventStream = require('event-stream'),
    _ = require('underscore');

module.exports = {

    process : function(target, policy) {

        var self = this;
        var p = new JSONParser();

        var returnStream = eventStream.readable(function(count, callback) {
            callback();
        });


        var readStream = fs.createReadStream(target);
        readStream.on('data', function(chunk) {
            p.write(chunk);
        });

        readStream.on('end', function() {
            returnStream.emit('end');
        });


        p.onValue = function (value) {
            if (this.key === "dependencies" || this.key === "devDependencies") {
                var policyIssues = self.checkPolicy(value, policy);

                policyIssues.forEach(function(issue) {
                    returnStream.emit('data', JSON.stringify(issue) + "\n");
                });
            }
        };

        return returnStream;
    },

    checkPolicy : function(dependencies, policy) {

        var policyFrags = policy.split("."),
            reqTilde = policyFrags[0].indexOf("~") > -1,
            reqCaret = policyFrags[0].indexOf("^") > -1;

        var nonCompliant = [];

        function issue(key, val, msg) {
            return {package : key, value : val, message: msg}
        }

        _.each(dependencies, function(val, key) {

            var depFrags = val.split(".");

            if (reqTilde && depFrags[0][0] !== "~") {
                nonCompliant.push(issue(key, val, "The ~ operator was expected but not found."));
                return;
            }
            if (!reqTilde && depFrags[0][0] == "~") {
                nonCompliant.push(issue(key, val, "The ~ operator was found but the policy doesn't include it."));
                return;
            }
            if (reqCaret && depFrags[0][0] !== "^") {
                nonCompliant.push(issue(key, val, "The ^ operator was expected but not found."));
                return;
            }
            if (!reqCaret && depFrags[0][0] == "^") {
                nonCompliant.push(issue(key, val, "The ^ operator was found but the policy doesn't include it."));
                return;
            }

            var wildcardFailure = _.any(policyFrags, function(pfrag, key) {
                if (pfrag === "x" || pfrag === "*") {
                    return depFrags[key] !== 'x' && depFrags[key] !== '*';
                }

                return false;
            });

            if (wildcardFailure) {
                nonCompliant.push(issue(key, val, "A wildcard operator was expected but not found."));
            }

        });

        return nonCompliant;

    }

};


