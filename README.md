# Apt-Get Wrapper for Node.js

```
$ npm install node-apt-get
```

A node wrapper for the functionality of `apt-get` on Debian systems.  Should support all commands and options *(if not please PR the missing features)*, with a simple interface:

```javascript
var apt = require('node-apt-get');
apt.update().on('close', function() {
	apt.install('vim', {
		'assume-yes': true
	}).on('close', function(code) {
		if (code !== 0) return console.error('Vim not installed');
		console.log('Vim installed');
	});
});
```

All method take options which will be transformed like so:

```javascript
// apt-get install vim --assume-yes
apt.install('vim', {
	'assume-yes': true
});

// apt-get upgrade --simulate
apt.upgrade({
	'simulate': true
});

// apt-get update --config-file /path/to/config
apt.update({
	'config-file': '/path/to/config'
});
```

All options will fall back to the value specified in `apt.options`, so you can globally set options on all of your commands with the following:

```javascript
apt.options['assume-yes'] = true;
```

Be careful with this because all options set this way are global.  It is better to specify the options every time rather than accidentally setting `--assume-yes` or `--config-file` for all commands.

**Note: Most `apt-get` commands require root, but this module does not require or even check for that.**

See `man apt-get` for more info about supported commands and options.

## Spawn Options

You can also overide the default behavior of inheriting the stdio for your child processes with the `apt.spawnOptions` object.
