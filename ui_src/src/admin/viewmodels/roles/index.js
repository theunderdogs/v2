//import { TaskQueue, inject, Aurelia, noView } from 'aurelia-framework';
import {Page} from 'common/page';
//import 'vendors:bower_components/datatables.net-dt/css/jquery.dataTables.min.css!'
//import 'vendors:bower_components/bootstrap-select/dist/css/bootstrap-select.css!'
import 'datatables'
import 'bootstrap-select'
import optionHtml from 'admin/views/roles/options.html!text'

//@inject(TaskQueue)
export class RoleManagement extends Page{
    constructor(...rest) {   
        //this.taskQueue = TaskQueue;
        super(...rest);
    }   
    
    activate(){
        let self = this;
        this.roleList = [];
        this.selectedRole;
        this.allPermissions= [];
        this.tableHtml = '<table ref="dtable" class="table table-striped">' +
                                '<thead>' +
                                    '<tr>' +
                                        '<th></th>' +
                                        '<th></th>' +
                                        '<th></th>' +
                                    '</tr>' + 
                                '</thead>' +
                            '</table>';
        this.tdata;
        
        return Promise.all([this.db.getroles(), this.db.getPermissions()])
        .then(( data ) => {
          //console.log('roles', data[0] );
          //console.log('permissions', data[1] );
          
          if(data[0] && data[0].length > 0){
            self.roleList = data[0];
          }
          
          if(data[1] && data[1].length > 0){
              self.allPermissions = data[1];
          }
        });
    }

    attached(){
        //let self = this;
    	 this.onPageRenderComplete();
    	 
    	 this.taskQueue.queueMicroTask(() => {       
        	$(this.rolesCombo).selectpicker();
    	 });
    }
    
    change_selectedRole() {
        //console.log(this.selectedRole);
        //var data;
        let hideFn = this.showProgress('Loading role...');
        
        return this.db.getPermissionsByRoleId(this.selectedRole._id)
        .then((result) => {
            //console.log('permissions', result);
            this.tdata = result;
            
            this.allPermissions.forEach((permission) => {
                let match = false;
                this.tdata.permissions.forEach((userPermission) => {
                    if(userPermission.item._id == permission._id){
                        match = true;
                    }
                });
                
                if(!match) {
                    this.tdata.permissions.push({ value: undefined, item: permission });
                }
            });
                
            $(this.dynamicDom).html(this.tableHtml);
            
            return new Promise((resolve, reject) => {
                if(!this.dynamicDom.querySelectorAll('.au-target').length) {
                    this.templatingEngine.enhance({
                        element: this.dynamicDom,
                        bindingContext: this
                    });
                    
                    resolve();
                } else {
                    reject();
                }
            });
        })
        .then(() => {
            hideFn();
            return this.renderDatatable();
        });
        
        //this.uiHelper.loadPromise(pr, 'Yay');
        
        //return pr;
    }
    
    renderDatatable() {
        console.log('table data', this.tdata.permissions);
        
        let promises = [];
        
        $(this.dtable).DataTable({
            data: this.tdata.permissions,
            paging: false,
            ordering: false,
            info: false,
            searching: true,
            columns: [{
                title: 'Name',
                data: 'item.name'
            }, {
                title: 'Description',
                data: 'item.description'
            }, {
                title: 'Actions',
                data: 'item.name'
            }],
            createdRow: (row, data, index) => {
                //console.log('cell data', data);
                $(row).find('td').css('vertical-align', 'middle');
                let $cell = $(row).find('td').eq(2);
                
                $cell.html(optionHtml);
                
                promises.push(new Promise((resolve, reject) => {
                    if(!$cell[0].querySelectorAll('.au-target').length) {
                        this.templatingEngine.enhance({
                            element: $cell[0],
                            bindingContext: data
                        });
                        
                        resolve();
                    } else {
                        reject();
                    }
                }));
            },
            initComplete: (settings, json) => {
                
            }
        });
        
        return promises;
    }
    
    click_applyChanges(){
        //obj = JSON.parse(JSON.stringify(o));
        
        let hideFn = this.showProgress('Saving changes...');
        
        var newObject = $.extend(true, {}, this.tdata);
        
        let indexesToDelete = [];
        newObject.permissions.forEach((permission) => {
            if(permission.value == undefined) {
                indexesToDelete.push(newObject.permissions.indexOf(permission));
            }
        });
        
        for(let i = indexesToDelete.length - 1; i >=0; i--) {
            newObject.permissions.splice(indexesToDelete[i] , 1);
        }
        
        console.log('newrole to be saved', newObject);
    
        return this.db.saveRole(newObject)
        .then((role) => {
            console.log('success', role);
            this.change_selectedRole();
            hideFn();
            this.showSuccess('Role updated successfully'); 
        },(err) => {
            console.log(err);
            this.showError();
        });
    }
    
    click_createRole() {
       this.router.navigate('createrole');
       //this.showSuccess();
    }
    
    getViewStrategy() {
        return 'admin/views/roles/index.html';
    }
}