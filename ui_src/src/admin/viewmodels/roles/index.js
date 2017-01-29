//import { TaskQueue, inject, Aurelia, noView } from 'aurelia-framework';
import {Page} from 'common/page';
//import 'vendors:bower_components/datatables.net-dt/css/jquery.dataTables.min.css!'
//import 'vendors:bower_components/bootstrap-select/dist/css/bootstrap-select.css!'
import 'datatables'
import 'bootstrap-select'
import optionHtml from 'admin/views/roles/options.html!text'
//import {json} from 'aurelia-fetch-client';

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
        
        return this.db.getroles()
        .then(( data ) => {
          console.log( data );
          
          if(data && data.length > 0){
            self.roleList = data;
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
        
        return this.db.getPermissionsByRoleId(this.selectedRole._id)
        .then((result) => {
            console.log('permissions', result);
            this.tdata = result;
            
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
            return this.renderDatatable();
        });
    }
    
    renderDatatable() {
        //console.log('table data', this.tdata.permissions);
        
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
                console.log('cell data', data);
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
    
    getViewStrategy() {
        return 'admin/views/roles/index.html';
    }
}