/**
 * @class Ext.ux.form.field.plugin.Keypad
 * @author Danny Roessner
 * 
 * This plugin will add a keypad icon next to a numberfield
 * that can be clicked to open an on-screen keypad.
 */
Ext.define('Ext.ux.form.field.plugin.Keypad', {
	extend: 'Ext.AbstractPlugin',
	alias: 'plugin.keypad',
	pickerAlign: 'tl-bl?',
	init: function(field) {
		field.triggerTpl = [
				'<td style="{triggerStyle}">' +
					'<div class="' + Ext.baseCSSPrefix + 'trigger-index-0 ' + Ext.baseCSSPrefix + 'form-trigger ' + Ext.baseCSSPrefix + 'form-spinner-up {spinnerUpCls}" role="button"></div>' +
					'<div class="' + Ext.baseCSSPrefix + 'trigger-index-1 ' + Ext.baseCSSPrefix + 'form-trigger ' + Ext.baseCSSPrefix + 'form-spinner-down {spinnerDownCls}" role="button"></div>' +
				'</td>' +
				'<td id="' + field.id + '-keypad" data-qtip="Show Keypad" class="keypad"></td>' +
			'</tr>'
		];
		
		field.on('afterrender', this.addKeypadListener, this, {
			single: true
		});

		field.on('destroy', function() {
			var me = this,
				picker = me.picker;

			Ext.EventManager.removeResizeListener(me.alignPicker, me);
			Ext.destroy(me.keyNav);
			if (picker) {
				picker.destroy();
			}
		});
		
		field.addEvents(
			/**
			 * @event collapse
			 * Fires when the field's picker is collapsed.
			 * @param {Object} field This field instance
			 */
			'collapse'
		);
		
		// Don't focus the input element if clicking on the keypad.  This is
		// done so that if running on a mobile device, the built-in keyboard
		// doesn't pop up.
		field.onTriggerWrapMouseup = function() {
			var target = event.target || event.srcElement,
				element;
			
			if (target) {
				element = Ext.fly(target);
				if (!(element && element.hasCls('keypad'))) {
					this.inputEl.focus();
				}
			} else {
				this.inputEl.focus();
			}
		};
	},
	addKeypadListener: function() {
		var me = this,
			cmp = me.cmp;
		
		cmp.keypadEl = Ext.get(cmp.id + '-keypad');
		Ext.fly(cmp.keypadEl).on('click', me.showKeypad, me);
	},
	showKeypad: function() {
		var me = this,
			cmp = me.cmp,
			picker = me.getPicker();

		if (cmp.rendered && !me.isExpanded && !cmp.isDestroyed && !cmp.isDisabled() && !cmp.readOnly) {
			picker.show();
			me.isExpanded = true;
			me.alignPicker();
			cmp.mon(Ext.getDoc(), {
				mousewheel: me.collapseIf,
				mousedown: me.collapseIf,
				scope: me
			});
			Ext.EventManager.onWindowResize(me.alignPicker, me);
		}
	},
	getPicker: function() {
		var me = this;

		return me.picker || (me.picker = me.createPicker());
	},
	alignPicker: function() {
		var me = this;

		if (me.isExpanded) {
			me.picker.alignTo(me.cmp.inputEl);
		}
	},
	collapseIf: function(e) {
		var me = this,
			cmp = me.cmp;

		if (!cmp.isDestroyed && !e.within(me.picker.el, false, true)) {
			me.collapse();
		}
	},
	collapse: function() {
		var me = this,
			cmp = me.cmp,
			picker = me.picker,
			doc = Ext.getDoc();

		if (me.isExpanded && !cmp.isDestroyed) {
			cmp.beforeBlur();
			if (cmp.isValid()) {
				cmp.fireEvent('collapse', cmp);
			}
			picker.hide();
			me.isExpanded = false;

			doc.un('mousewheel', me.collapseIf, me);
			doc.un('mousedown', me.collapseIf, me);
			Ext.EventManager.removeResizeListener(me.alignPicker, me);
		}
	},
	createPicker: function() {
		var me = this,
			cmp = me.cmp,
			picker;

		picker = Ext.create('Ext.panel.Panel', {
			renderTo: Ext.getBody(),
			border: true,
			floating: true,
			hidden: true,
			focusOnShow: true,
			layout: 'column',
			width: 152,
			height: 202,
			defaults: {
				width: 50,
				height: 50,
				cls: 'keypad-buttons',
				handler: function(button) {
					var newValue = (cmp.getRawValue() || '') + button.text;

					if (!(cmp.maxLength && cmp.enforceMaxLength && newValue.length > cmp.maxLength)) {
						cmp.setRawValue(newValue);
					}
				}
			},
			items: [{
				xtype: 'button',
				text: '7'
			}, {
				xtype: 'button',
				text: '8'
			}, {
				xtype: 'button',
				text: '9'
			}, {
				xtype: 'button',
				text: '4'
			}, {
				xtype: 'button',
				text: '5'
			}, {
				xtype: 'button',
				text: '6'
			}, {
				xtype: 'button',
				text: '1'
			}, {
				xtype: 'button',
				text: '2'
			}, {
				xtype: 'button',
				text: '3'
			}, {
				xtype: 'button',
				text: 'Clear',
				handler: function() {
					cmp.setValue('');
				}
			}, {
				xtype: 'button',
				text: '0'
			}, {
				xtype: 'button',
				disabled: !cmp.decimalPrecision,
				text: '.'
			}],
			keyNavConfig: {
				esc: function() {
					me.collapse();
				}
			}
		});
		
		me.keyNav = new Ext.util.KeyNav(picker.el, {
			esc: {
				handler: me.onEsc,  
				defaultEventAction: false
			},
			scope: me
		});

		return picker;
	},
	onEsc: function(e) {
		var me = this;

		if (me.isExpanded) {
			me.collapse();
			e.stopEvent();
		}
	}
});