/**
 * Pimcore
 *
 * This source file is available under two different licenses:
 * - GNU General Public License version 3 (GPLv3)
 * - Pimcore Enterprise License (PEL)
 * Full copyright and license information is available in
 * LICENSE.md which is distributed with this source code.
 *
 * @category   Pimcore
 * @package    EcommerceFramework
 * @copyright  Copyright (c) 2009-2016 pimcore GmbH (http://www.pimcore.org)
 * @license    http://www.pimcore.org/license     GPLv3 and PEL
 */


pimcore.registerNS("pimcore.object.gridcolumn.operator.dateformatter");

pimcore.object.gridcolumn.operator.dateformatter = Class.create(pimcore.object.gridcolumn.Abstract, {


    type: "operator",
    class: "DateFormatter",
    iconCls: "pimcore_icon_datetime",
    defaultText: "operator_dateformatter",
    group: "other",

    getConfigTreeNode: function(configAttributes) {
        if(configAttributes) {
            var nodeLabel = this.getNodeLabel(configAttributes);
            var node = {
                draggable: true,
                iconCls: this.iconCls,
                text: nodeLabel,
                configAttributes: configAttributes,
                isTarget: true,
                maxChildCount: 1,
                expanded: true,
                leaf: false,
                expandable: false,
                isChildAllowed: this.allowChild
            };
        } else {

            //For building up operator list
            var configAttributes = { type: this.type, class: this.class, label: t(this.defaultText)};

            var node = {
                draggable: true,
                iconCls: this.iconCls,
                text: t(this.defaultText),
                configAttributes: configAttributes,
                isTarget: true,
                maxChildCount: 1,
                leaf: true,
                isChildAllowed: this.allowChild
            };
        }
        node.isOperator = true;
        return node;
    },

    getCopyNode: function(source) {

        var copy = source.createNode({
            iconCls: source.data.iconCls,
            text: source.data.text,
            isTarget: true,
            leaf: false,
            expandable: false,
            dataType: source.data.dataType,
            qtip: source.data.key,
            configAttributes: {
                label: source.data.text,
                type: this.type,
                class: this.class,
                attribute: source.data.key,
                dataType: source.data.dataType
            }
        });
        return copy;
    },

    getConfigDialog: function(node) {
        this.node = node;

        this.formatField = new Ext.form.TextField({
            label_width: 200,
            fieldLabel: t('date_format'),
            length: 255,
            width: 200,
            value: this.node.data.configAttributes.format
        });

        var helpButton = new Ext.Button({
            text: t("click_for_help"),
            handler: function () {
                window.open("http://php.net/manual/en/function.date.php");
            },
            iconCls: "pimcore_icon_help"
        });


        this.configPanel = new Ext.Panel({
            layout: "form",
            bodyStyle: "padding: 10px;",
            items: [this.formatField, helpButton],
            buttons: [{
                text: t("apply"),
                iconCls: "pimcore_icon_apply",
                handler: function () {
                    this.commitData();
                }.bind(this)
            }]
        });

        this.window = new Ext.Window({
            width: 500,
            height: 250,
            modal: true,
            title: t('operator_dateformatter_settings'),
            layout: "fit",
            items: [this.configPanel]
        });

        this.window.show();
        return this.window;
    },

    commitData: function() {
        this.node.data.configAttributes.format = this.formatField.getValue();
        var nodeLabel = this.getNodeLabel(this.node.data.configAttributes);
        this.node.set('isOperator', true);
        this.window.close();
    },

    getNodeLabel: function (configAttributes) {
        var nodeLabel = configAttributes.label ? configAttributes.label : t(this.defaultText);
        if (configAttributes.format) {
            nodeLabel += '<span class="pimcore_gridnode_hint"> (' + configAttributes.format + ')</span>';
        }

        return nodeLabel;
    },

    allowChild: function (targetNode, dropNode) {
        return true;
    }
});