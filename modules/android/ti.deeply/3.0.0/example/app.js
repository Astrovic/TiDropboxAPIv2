var Deeply = require('ti.deeply');

var win = Ti.UI.createWindow({ backgroundColor: 'white' });

Deeply.setCallback(function (e) {
	Ti.API.debug('Deep link called with:');
	Ti.API.debug('\tdata:', e.data);
	Ti.API.debug('\taction:', e.action);
	Ti.API.debug('\textras', e.extras);
});

win.open();