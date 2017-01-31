import {Page} from 'common/page';
import 'datatables'

export class UserManagement extends Page{
    constructor(...rest) {   
        super(...rest);
    }   
    
    activate(){
        this.users = [];
        this.tableHtml = '<table ref="dtable" class="table table-striped">' +
                                '<thead>' +
                                    '<tr>' +
                                        '<th></th>' +
                                        '<th></th>' +
                                        '<th></th>' +
                                        '<th></th>' +
                                        '<th></th>' +
                                        '<th></th>' +
                                    '</tr>' + 
                                '</thead>' +
                            '</table>';
                            
        return this.db.getUsers()
        .then(( data ) => {
          if(data && data.length > 0){
            data.forEach((user) => {
                if(!user.hasOwnProperty('role'))
                    user.role = { name: '-' }
            });
            
            this.users = data;
          }
        });
    }

    attached(){
        //let self = this;
    	this.onPageRenderComplete();
    	
    	this.renderDatatable();
    }
    
     renderDatatable() {
        let promises = [];
        
        $(this.dynamicDom).html(this.tableHtml);
            
        let tablePromise = new Promise((resolve, reject) => {
            if(!this.dynamicDom.querySelectorAll('.au-target').length) {
                this.templatingEngine.enhance({
                    element: this.dynamicDom,
                    bindingContext: this
                });
                
                resolve();
            } else {
                reject();
            }
        }).then(() => {
           $(this.dtable).DataTable({
                data: this.users,
                paging: false,
                ordering: true,
                info: false,
                searching: true,
                columns: [{
                    title: 'Name',
                    data: 'realName'
                }, {
                    title: 'Facebook ID',
                    data: 'facebookId'
                }, {
                    title: 'Active',
                    data: 'enable'
                }, {
                    title: 'Admin',
                    data: 'isAdmin'
                }, {
                    title: 'Role',
                    data: 'role.name'
                }, { //edit button
                    title: 'Action',
                    data: 'realName',
                    ordering: false
                }],
                columnDefs: [ {
                    targets: 5,
                    orderable: false
                }],
                createdRow: (row, data, index) => {
                    //console.log('cell data', data);
                    // $(row).find('td').css('vertical-align', 'middle');
                    // let $cell = $(row).find('td').eq(2);
                    
                    // $cell.html(optionHtml);
                    let cells = $(row).find('td');
                    
                    cells.eq(2).html(data.enable ? 'Yes': 'No');
                    cells.eq(3).html(data.isAdmin ? 'Yes': 'No');
                    cells.eq(5).html('<button class="btn btn-primary btn-icon-text waves-effect" click.delegate="click_createUser(\'' + data.facebookId + '\')"><i class="zmdi zmdi-border-color"></i> Edit</button>');
                    
                    promises.push(new Promise((resolve, reject) => {
                        if(!cells.eq(5)[0].querySelectorAll('.au-target').length) {
                            this.templatingEngine.enhance({
                                element: cells.eq(5)[0],
                                bindingContext: this
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
        });
        
        promises.push(tablePromise);
        
        return Promise.all(promises);
    }
    
    click_createUser(facebookId){
        let urlDetail;
        
        if(facebookId){
            urlDetail = this.router.generate('createuser', {facebookId});
        }else {
            urlDetail = 'createuser';
        }
            
        this.router.navigate(urlDetail);
    }
    
    getViewStrategy() {
        return 'admin/views/users/index.html';
    }
}