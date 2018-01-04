Ext.onReady(function(){
	var v_store = Ext.create('Ext.data.Store', {
        fields:['id','firstName','lastName','email','birthday'],
        autoLoad: true,//自动加载
        pageSize: 10,
        actionMethods : {  
            read : 'GET' // Store设置请求的方法，与Ajax请求有区别  
        },
        proxy: {
            type: 'ajax',
            url : 'http://localhost/customer/'
        }
    });
	var toolBar=Ext.create('Ext.PagingToolbar', { 
		store: v_store,
		displayInfo: true,
		pageSize: 10,
		beforePageText: '第',//'第'
		afterPageText: '页共{0}页',//'页共 {0} 页'
		displayMsg: '显示记录 {0} - {1} 共 {2}条数据', //'显示记录 {0} - {1} 共 {2}条数据'
		emptyMsg: "没有数据"//"没有数据"
	});
	
	var usersGrid = Ext.create('Ext.grid.Panel', {
		id : 'usergrid',
	    title: 'users',
		region:'center',
	    store: v_store,
	    selModel : new Ext.selection.CheckboxModel({checkOnly:true,mode:'SINGLE'}),
	    columnLines:true,//单元格边框
	    forceFit : true,
        plugins: [
          Ext.create('Ext.grid.plugin.CellEditing', {
              clicksToEdit: 1
          })
        ],//grid编辑器
	    columns: [
	        { text: 'id',  dataIndex: 'id' },
	        { text: 'firstName', dataIndex: 'firstName',editor:{xtype:'textfield'} },
	        { text: 'lastName', dataIndex: 'lastName',editor:{xtype:'textfield'} },
	        { text: 'email', dataIndex: 'email',editor:{xtype:'textfield'}},
	        { text: 'birthday', dataIndex: 'birthday', type:'datefield' }
	    ],
	    bbar : toolBar,
	    tbar : Ext.create('Ext.toolbar.Toolbar',{
	    	items : ['->',{
	 			   id : 'add',
	 			   iconCls : 'icon-add',
	 			   text : '新增',
	 			   handler : add_handler
	    	},{
	    		id : 'save',
	    		text : '保存',
	    		handler : save_handler
	    	},{
	    		id : 'delete',
	    		text : '删除',
	    		handler : delete_handler
	    	}]
	    })
	});

var treeStore = Ext.create('Ext.data.TreeStore', {
    root: {
        expanded: true,
        children: [
            { text: "detention", leaf: true },
            { text: "homework", expanded: true, children: [
                { text: "book report", leaf: true },
                { text: "alegrbra", leaf: true}
            ] },
            { text: "buy lottery tickets", leaf: true }
        ]
    }
});
	
	var treePancel = Ext.create('Ext.tree.Panel', {
		title: 'Simple Tree',
		region:'west',
		width: 300,
		store: treeStore,
		rootVisible: false,
		renderTo: Ext.getCmp('viewport')
	});
	
   var viewport = Ext.create('Ext.container.Viewport', {
	   id: 'viewport',
       layout:'border',
       items:[treePancel, usersGrid],
       renderTo: Ext.getBody()
   });

   
});

function add_handler(){
	var v_grid = Ext.getCmp('usergrid');
	//v_grid.stopEditing();
	var v_record = {firstName : '',lastName : '',email:'',birthday:''};
	v_grid.getStore().insert(0,v_record);
}

function delete_handler(){
	var v_records = Ext.getCmp('usergrid').getSelectionModel().getSelection();
	if(v_records && v_records.length > 0){
		var v_customer = v_records[0].data;
		var loadMarsk = new Ext.LoadMask(document.body, {    
             msg:'正在处理数据，请稍候......',  		// 正在处理数据，请稍候......  
             removeMask:true //完成后移除    
        });
        loadMarsk.show();
        
        var v_url = 'http://localhost/customer/'+v_customer.id;
        var v_method = 'DELETE';
        var v_params = Ext.JSON.encode(v_customer);
        Ext.Ajax.request({
             url : v_url,
             params : v_params,
             method : v_method,
             headers: {'Content-Type':'application/json;charset=utf8'},
             success : function(response, options) {
             	loadMarsk.hide();
             	Ext.Msg.alert('提示','删除成功');
             	Ext.getCmp('usergrid').getStore().load();
             },
             failure: function(response, options) {
                 loadMarsk.hide();  //隐藏
                 console.info(response);
                 Ext.Msg.alert('提示','删除失败');
             }
        });
	}else{
		Ext.Msg.alert('提示','请选择要删除的记录');
	}
}

function save_handler(){
	var v_records = Ext.getCmp('usergrid').getSelectionModel().getSelection();
	if(v_records && v_records.length > 0){
		var v_customer = v_records[0].data;
		var loadMarsk = new Ext.LoadMask(document.body, {    
             msg:'正在处理数据，请稍候......',  		// 正在处理数据，请稍候......  
             removeMask:true //完成后移除    
        });
        loadMarsk.show();
        
        var v_url = 'http://localhost/customer/';
        var v_method = 'POST';
        if(v_customer.id){
        	v_url = 'http://localhost/customer/'+v_customer.id;
        	v_method = 'PUT';
        }
        var v_params = Ext.JSON.encode(v_customer);
        Ext.Ajax.request({
             url : v_url,
             params : v_params,
             method : v_method,
             headers: {'Content-Type':'application/json;charset=utf8'},
             success : function(response, options) {
             	loadMarsk.hide();
             	Ext.Msg.alert('提示','保存成功');
             	Ext.getCmp('usergrid').getStore().load();
             },
             failure: function(response, options) {
                 loadMarsk.hide();  //隐藏
                 console.info(response);
                 Ext.Msg.alert('提示','保存失败');
             }
        });
	}
}