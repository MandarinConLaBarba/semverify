var semverify = require('../lib/semverify'),
  should = require('should');

describe("lib/semverify", function(){

  var policy,
    dependencies,
    result;

  afterEach(function() {

  });

  describe("checkPolicy", function(){

    describe("when there is a 'x' wildcard in the policy patch position", function(){

      beforeEach(function() {
        policy = "X.x";
      });

      describe("and the dependency does not have a wildcard in the patch position", function(){

        beforeEach(function() {
          dependencies = {
            'sweet-package' : '1.2.0'
          };

          result = semverify.checkPolicy(dependencies, policy);
        });

        it("should return an error", function(done){

          result[0].package.should.equal('sweet-package');
          result[0].message.should.containEql('wildcard operator was expected');
          done();
        });

      });

      describe("and the dependency DOES have a wildcard in the patch position", function(){

        beforeEach(function() {
          dependencies = {
            'sweet-package' : '1.x'
          };

          result = semverify.checkPolicy(dependencies, policy);
        });

        it("should NOT return an error", function(done){

          result.length.should.be.exactly(0);
          done();

        });

      });

    });


    describe("when there is a 'x' wildcard in the policy patch position", function(){

      beforeEach(function() {
        policy = "X.Y.x";
      });

      describe("and the dependency does not have a wildcard in the patch position", function(){

        beforeEach(function() {
          dependencies = {
            'sweet-package' : '1.2.0'
          };

          result = semverify.checkPolicy(dependencies, policy);
        });

        it("should return an error", function(done){

          result[0].package.should.equal('sweet-package');
          result[0].message.should.containEql('wildcard operator was expected');
          done();
        });

      });

      describe("and the dependency DOES have the SAME wildcard in the patch position", function(){

        beforeEach(function() {
          dependencies = {
            'sweet-package' : '1.2.x'
          };

          result = semverify.checkPolicy(dependencies, policy);
        });

        it("should NOT return an error", function(done){

          result.length.should.be.exactly(0);
          done();
        });

      });

      describe("and the dependency DOES have a DIFFERENT wildcard character in the patch position", function(){

        beforeEach(function() {
          dependencies = {
            'sweet-package' : '1.2.*'
          };

          result = semverify.checkPolicy(dependencies, policy);
        });

        it("should NOT return an error", function(done){

          result.length.should.be.exactly(0);
          done();
        });

      });

    });

    describe("when there is a '*' wildcard in the policy patch position", function(){

      beforeEach(function() {
        policy = "X.Y.*";
      });

      describe("and the dependency is a git URL", function(){

        describe("and the dependency does NOT have a wildcard in the patch position", function(){

          beforeEach(function() {

            dependencies = {
              'sweet-package' : 'git://github.com/someUser/someRepo#v1.2.3'
            };

            result = semverify.checkPolicy(dependencies, policy);

          });

          it("should not return an error", function(){

            result.length.should.equal(0);

          });

        });


      });

      describe("and the dependency does not have a wildcard in the patch position", function(){

        beforeEach(function() {
          dependencies = {
            'sweet-package' : '1.2.0'
          };

          result = semverify.checkPolicy(dependencies, policy);
        });

        it("should return an error", function(done){

          result[0].package.should.equal('sweet-package');
          result[0].message.should.containEql('wildcard operator was expected');
          done();
        });

      });

    });

    describe("when there is a '^' operator in the policy", function(){

      beforeEach(function() {
        policy = "^X.Y.Z";
      });

      describe("and the dependency doesn't have a '^' operator", function(){


        beforeEach(function() {
          dependencies = {
            'sweet-package' : '1.2.3'
          };

          result = semverify.checkPolicy(dependencies, policy);
        });

        it("should return an error", function(done){

          result[0].package.should.equal('sweet-package');
          result[0].message.should.containEql('^ operator was expected');
          done();
        });

      });

    });

    describe("when there is NOT a '^' operator in the policy", function(){

      beforeEach(function() {
        policy = "X.Y.Z";
      });

      describe("and the dependency DOES have a '^' operator", function(){


        beforeEach(function() {
          dependencies = {
            'sweet-package' : '^1.2.3'
          };

          result = semverify.checkPolicy(dependencies, policy);
        });

        it("should return an error", function(done){

          result[0].package.should.equal('sweet-package');
          result[0].message.should.containEql('^ operator was found but the policy doesn\'t include');
          done();
        });

      });

    });

    describe("when there is a '~' operator in the policy", function(){

      beforeEach(function() {
        policy = "~X.Y.Z";
      });

      describe("and the dependency doesn't have a '~' operator", function(){


        beforeEach(function() {
          dependencies = {
            'sweet-package' : '1.2.3'
          };

          result = semverify.checkPolicy(dependencies, policy);
        });

        it("should return an error", function(done){

          result[0].package.should.equal('sweet-package');
          result[0].message.should.containEql('~ operator was expected');
          done();
        });

      });

    });

    describe("when there is NOT a '~' operator in the policy", function(){

      beforeEach(function() {
        policy = "X.Y.Z";
      });

      describe("and the dependency DOES have a '~' operator", function(){


        beforeEach(function() {
          dependencies = {
            'sweet-package' : '~1.2.3'
          };

          result = semverify.checkPolicy(dependencies, policy);
        });

        it("should return an error", function(done){

          result[0].package.should.equal('sweet-package');
          result[0].message.should.containEql('~ operator was found but the policy doesn\'t include');
          done();
        });

      });

    });


  });

});