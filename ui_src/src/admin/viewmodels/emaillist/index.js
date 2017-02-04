import {Page} from 'common/page';
import 'datatables'
import moment from 'moment'

export class EmailListManagement extends Page{
    constructor(...rest) {   
        super(...rest);
    }   
    
    activate(){
        let self = this;
        this.tableHtml = '<table ref="dtable" class="table table-striped">' +
                                '<thead>' +
                                    '<tr>' +
                                        '<th></th>' +
                                        '<th></th>' +
                                        '<th></th>' +
                                        '<th></th>' +
                                        '<th></th>' +
                                    '</tr>' + 
                                '</thead>' +
                            '</table>';
        this.tdata;
        
        return this.db.getEmailLists()
        .then(( data ) => {
          console.log('lists', data );
          
          if(data && data.length > 0){
            self.tdata = data;
          }
        });
    }

    attached(){
        this.onPageRenderComplete();
    	 
    	this.renderDatatable();
    }
    
    renderDatatable() {
        $(this.dynamicDom).html(this.tableHtml);
        
        let promises = [];
         
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
                data: this.tdata,
                paging: false,
                ordering: true,
                info: false,
                searching: true,
                columns: [{
                    title: 'Name',
                    data: 'name'
                }, {
                    title: 'Email addresses',
                    data: 'list',
                    ordering: false
                }, {
                    title: 'Created By',
                    data: 'createdBy.realName'
                }, { //edit button
                    title: 'Action',
                    data: 'name',
                    ordering: false
                }, { 
                    title: 'Created On',
                    data: 'dateAdded',
                    ordering: false
                }],
                createdRow: (row, data, index) => {
                    let cells = $(row).find('td');
                    
                    let html = cells.eq(1).html();
                    
                    if(html.length > 30) {
                        cells.eq(1).html(html.substring(0, 30) + '...');
                    }
                    
                    cells.eq(3).html('<button class="btn btn-primary btn-icon-text waves-effect" click.delegate="click_createnewlist(\'' + data._id + '\')"><i class="zmdi zmdi-border-color"></i> Edit</button>    <button class="btn bgm-orange btn-icon-text waves-effect" click.delegate="click_sendEmail(\'' + data._id + '\')"><i class="zmdi zmdi-email"></i> Send Email</button>');
                    
                    let _date = moment(data.dateAdded);
                    cells.eq(4).html(_date.format('MM') + '/' + _date.format('DD') + '/' + _date.format('YYYY'));
                    
                    promises.push(new Promise((resolve, reject) => {
                        if(!cells.eq(3)[0].querySelectorAll('.au-target').length) {
                            this.templatingEngine.enhance({
                                element: cells.eq(3)[0],
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
    
    click_createnewlist(emailListId){
        let urlDetail;
        
        if(emailListId){
            urlDetail = this.router.generate('createemaillist', {emailListId});
        }else {
            urlDetail = 'createemaillist';
        }
            
        this.router.navigate(urlDetail);
    }
    
    getViewStrategy() {
        return 'admin/views/emaillist/index.html';
    }
}