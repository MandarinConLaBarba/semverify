# Semverify

Used to warn when your package dependencies don't match your semver policy. Helps w/ enforcing a particular dependency version policy.

## Usage

Determine what your policy is (e.g. X.Y.*, where you will only get new patch-level versions). Then test it against a package.json:

```
var semverify = require('semverify');

semverify.process("package.json", "X.Y.*")
    .pipe(process.stdout);

```

See [gulp-semverify](https://github.com/MandarinConLaBarba/gulp-semverify) for gulp integration.