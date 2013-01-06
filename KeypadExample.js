Ext.Loader.setConfig({
	enabled: true,
	paths: {
		'Ext.ux': 'js/ux'
	}
});

Ext.require('Ext.ux.form.field.plugin.Keypad');
Ext.onReady(function() {
	Ext.create('Ext.panel.Panel', {
		title: 'Keypad Plugin Examples',
		renderTo: Ext.getBody(),
		bodyPadding: 5,
		width: 500,
		defaults: {
			xtype: 'numberfield',
			plugins: {
				ptype: 'keypad'
			},
			labelWidth: 110
		},
		items: [{
			fieldLabel: 'With Spinner'
		}, {
			fieldLabel: 'Without Spinner',
			hideTrigger: true
		}, {
			fieldLabel: 'maxLength: 2',
			hideTrigger: true,
			maxLength: 2,
			enforceMaxLength: true
		}, {
			fieldLabel: 'maxValue: 9999',
			hideTrigger: true,
			maxValue: 9999
		}, {
			fieldLabel: 'disabled',
			disabled: true
		}, {
			fieldLabel: 'decimalPrecision: 0',
			decimalPrecision: 0
		}]
	});
});