//import { TaskQueue, inject, Aurelia, noView } from 'aurelia-framework';
import {Page} from 'common/page';
//import 'vendors:bower_components/datatables.net-dt/css/jquery.dataTables.min.css!'
//import 'vendors:bower_components/bootstrap-select/dist/css/bootstrap-select.css!'
import 'datatables'
import 'bootstrap-select'
import moment from 'moment'
//import optionHtml from 'admin/views/roles/options.html!text'

const tableHtml = '<table ref="dtable" class="table table-striped">' +
                                '<thead>' +
                                    '<tr>' +
                                        '<th></th>' +
                                        '<th></th>' +
                                        '<th></th>' +
                                        '<th></th>' +
                                    '</tr>' + 
                                '</thead>' +
                            '</table>';

//@inject(TaskQueue)
export class RoleManagement extends Page{
    constructor(...rest) {   
        //this.taskQueue = TaskQueue;
        super(...rest);
    }   
    
    activate(){
        let self = this;
        this.roleList = [];
        this.tdata;
        
        // return this.db.getroles()
        // .then(( data ) => {
        //   if(data && data.length > 0){
        //     self.roleList = data;
        //   }
        // });
    }

    attached(){
        //let self = this;
    //	 this.onPageRenderComplete();
    	 
    //	 this.renderDatatable();
    }
    /*
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
                data: this.roleList,
                paging: false,
                ordering: true,
                info: false,
                searching: true,
                columns: [{
                    title: 'Name',
                    data: 'name'
                }, {
                    title: 'Active',
                    data: 'enable'
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
                    
                    // cells.eq(3).html(data.isAdmin ? '<mark>Yes</mark>': 'No');
                    cells.eq(2).html('<button class="btn btn-primary btn-icon-text waves-effect" click.delegate="click_createRole(\'' + data._id + '\')"><i class="zmdi zmdi-border-color"></i> Edit</button>');
                    
                    let _date = moment(data.dateAdded);
                    cells.eq(3).html(_date.format('MM') + '/' + _date.format('DD') + '/' + _date.format('YYYY'));
                    
                    promises.push(new Promise((resolve, reject) => {
                        if(!cells.eq(2)[0].querySelectorAll('.au-target').length) {
                            this.templatingEngine.enhance({
                                element: cells.eq(2)[0],
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
    */
    
    click_createWriteUp(id){
        let urlDetail;
        
        if(id){
            urlDetail = this.router.generate('createabout', {id});
        }else {
            urlDetail = 'createabout';
        }
            
        this.router.navigate(urlDetail);
    }
    
    getViewStrategy() {
        return 'admin/views/about/index.html';
    }
}