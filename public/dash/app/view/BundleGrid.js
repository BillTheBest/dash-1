Ext.define("Dash.view.BundleGrid", {
    extend: 'Ext.grid.Panel',
    alias: 'widget.bundlegrid',
    requires: 'Ext.grid.column.Action',
    store: 'Bundles',
    width: '100%',
    
    stageStatusIconRenderer: function(value, metadata, record, rowIndex, colIndex, store, view) {
        var icon = Dash.app.getController('Bundle').getStageStatusIcon(record, colIndex - 2);
        var iconUrl = (icon) ? Ext.String.format(Dash.config.stagestatus.iconpath, icon) : Ext.BLANK_IMAGE_URL;
        this.columns[colIndex].items[0].icon = iconUrl;
    },
    
    createChangeTooltip: function(target) {
        return Ext.create('Dash.view.ChangeToolTip', {
            target: target
        });
    },
    
    createJobResultTooltip: function(target) {
        return Ext.create('Dash.view.JobResultToolTip', {
            target: target
        });
    },
    
    initComponent: function() {
        var that = this;
        this.columns = [{
            text: 'Bundle',
            menuText: 'Bundle',
            dataIndex: 'id',
            renderer: function(value, metadata, record, rowIndex, colIndex, store, view) {
                return Ext.String.format(Dash.config.bundlegrid.repolink, record.get('branch'), record.get('id'));
            },
            width: 90
        }, {
            text: 'Revision',
            dataIndex: 'revision',
            width: 90
        }, {
            text: 'Erzeugt',
            dataIndex: 'timestamp',
            type: 'date',
            renderer: Ext.util.Format.dateRenderer(Dash.config.bundlegrid.dateformat),
            width: 180
        }, {
            text: '1st',
            menuText: '1st',
            dataIndex: 'stage1',
            align: 'center',
            xtype: 'actioncolumn',
            items: [{
                handler: function(gridview, rowIndex, colIndex, item, event, record) {
                    that.fireEvent('hideAllTooltips');
                    that.fireEvent('loadJobResult', record, 1, that.createJobResultTooltip(event.target));
                }
            }],
            renderer: this.stageStatusIconRenderer,
            scope: this,
            width: 40
        }, {
            text: '2nd',
            menuText: '2nd',
            dataIndex: 'stage2',
            align: 'center',
            xtype: 'actioncolumn',
            items: [{
                handler: function(gridview, rowIndex, colIndex, item, event, record) {
                    that.fireEvent('hideAllTooltips');
                    that.fireEvent('loadJobResult', record, 2, that.createJobResultTooltip(event.target));
                }
            }],
            renderer: this.stageStatusIconRenderer,
            scope: this,
            width: 40
        }, {
            text: '3rd',
            menuText: '3rd',
            dataIndex: 'stage3',
            align: 'center',
            xtype: 'actioncolumn',
            items: [{
                handler: function(gridview, rowIndex, colIndex, item, event, record) {
                    that.fireEvent('hideAllTooltips');
                    that.fireEvent('loadJobResult', record, 3, that.createJobResultTooltip(event.target));
                }
            }],
            renderer: this.stageStatusIconRenderer,
            scope: this,
            width: 40
        }, {
            text: 'Änderungen',
            menuText: 'Änderungen',
            align: 'center',
            xtype: 'actioncolumn',
            width: 120,
            items: [{
                icon: Dash.config.bundlegrid.icon.change,
                handler: function(gridview, rowIndex, colIndex, item, event, record) {
                    that.fireEvent('hideAllTooltips');
                    that.fireEvent('loadChanges', record, that.createChangeTooltip(event.target));
                }
            }]
        }, {
            text: 'Committer',
            dataIndex: 'committer',
            width: 120
        }, {
            text: 'Deployment',
            xtype: 'actioncolumn',
            width: 60,
            flex: 1,
            items: [{
                icon: Dash.config.bundlegrid.icon.deploy,
                handler: function(gridview, rowIndex, colIndex, item, event, record) {
                    console.log('Deploy ' + record.get('id'));
                }
            }]
        }];
        this.callParent(arguments);
    }
});