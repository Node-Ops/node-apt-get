var childProcess = require('child_process'),
	camel = require('camel-case'), 
	apt = module.exports = {};

// The apt get command
apt.command = 'apt-get';

// Command options
apt.options = {
	'no-install-recommends': false,
	'download-only': false,
	'fix-broken': false,
	'ignore-missing': false,
	'no-download': false,
	'quiet': false,
	'simulate': false,
	'assume-yes': false,
	'show-upgraded': false,
	'verbose-versions': false,
	'build': false,
	'install-recommends': false,
	'no-install-recommends': false,
	'ignore-hold': false,
	'no-upgrade': false,
	'only-upgrade': false,
	'force-yes': false,
	'print-urls': false,
	'purge': false,
	'reinstall': false,
	'list-cleanup': false,
	'target-release': false,
	'trivial-only': false,
	'no-remove': false,
	'auto-remove': false,
	'only-source': false,
	'diff-only': false,
	'dsc-only': false,
	'tar-only': false,
	'arch-only': false,
	'allow-unauthenticated': false,
	'help': false,
	'version': false,
	'config-file': false,
	'option': false,
};

// Allows specifying options to the spawn call
apt.spawnOptions = {
	stdio: 'inherit'
};

// Parses the options adding them to
// an options array which is returned
var parseOptions = function(options) {
	options = options || {};
	var optionsArray = [];

	// Go through the available options,
	// set either the passed option
	// or the default
	for (var i in apt.options) {
		if (typeof options[i] !== 'undefined') {
			addOption(optionsArray, i, options[i]);
		} else {
			addOption(optionsArray, i, apt.options[i]);
		}
	}

	return optionsArray;
};

// Adds to the options array based
// on the type of argument provided
var addOption = function(optsArr, name, value) {
	switch(typeof value) {
		case 'boolean':
			if (value) optsArr.push('--' + name);
			break;
		case 'string':
			optsArr.push('--' + name);
			optsArr.push(value);
			break;
		case 'function':
			optsArr.push(value());
			break;
	};
};

// A spawn helper to spawn apt-get commands
var spawn = function(command, options) {
	options = options || [];
	options.unshift(command);
	return childProcess.spawn(apt.command, options, apt.spawnOptions);
};

// Commands that just take options
[
	'update',
	'upgrade',
	'dselect-upgrade',
	'dist-upgrade',
	'check',
	'clean',
	'autoclean',
	'autoremove',
].forEach(function(command) {
	apt[camel(command)] = function(options) {
		return spawn(command, parseOptions(options));
	};
});

// Commands that take packages and options
[
	'install',
	'remove',
	'purge',
	'source',
	'build-dep',
].forEach(function(command) {
	apt[camel(command)] = function(packages, options) {
		// Merge the packages on the front of the options
		options = parseOptions(options);
		if (!(packages instanceof Array)) {
			packages = [packages];
		}
		options = packages.concat(options);
		return spawn(command, options);
	};
});
