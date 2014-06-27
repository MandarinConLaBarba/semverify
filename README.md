# Semverify

Used to warn when your package dependencies don't match your semver policy. Helps w/ enforcing a particular dependency version policy.

## Supported version patterns

* X.Y.Z - basically saying you want exact versions specified everywhere
* X.Y.*, X.*, etc - saying you want to specify at a patch, minor, etc
* ^X.Y.Z - require caret operator ("compatible with)
* ~X.Y.Z - require tilde operator ("reasonably close")

Haven't tested a single wildcard ('*'), but if you have that in your dependencies you probably don't need something like this!

## Usage

Determine what your policy is (e.g. X.Y.*, where you will only get new patch-level versions). Then test it against a package.json:

```
var semverify = require('semverify');

semverify.process("package.json", "X.Y.*")
    .pipe(process.stdout);

```

See [gulp-semverify](https://github.com/MandarinConLaBarba/gulp-semverify) for gulp integration.