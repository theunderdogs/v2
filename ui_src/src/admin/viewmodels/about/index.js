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
        this.aboutList = [];
        this.tdata;
        
        return Promise.all([ this.db.getAbouts(), this.db.getActiveAboutById()])
        .then(( results ) => {
          let abouts = results[0], activeAbout = results[1];
          
          if(abouts && abouts.length > 0){
            abouts.forEach((about) => {
                if(!activeAbout)
                    about.active = false;
                else {
                    about.active = about._id == activeAbout.aboutId;
                }
            });  
              
            self.aboutList = abouts;
            console.log(self.aboutList);
          }
        });
    }

    attached(){
        let self = this;
        this.onPageRenderComplete();
    	 
    	this.renderDatatable();
    }
    
    renderDatatable() {
        let promises = [];
        
        $(this.dynamicDom).html(tableHtml);
            
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
                data: this.aboutList,
                paging: false,
                ordering: true,
                info: false,
                searching: true,
                columns: [{
                    title: 'Version Name',
                    data: 'name'
                }, {
                    title: 'Content',
                    data: 'content'
                }, {
                    title: 'Active',
                    data: 'active'
                }, { 
                    title: 'Created By',
                    data: 'createdBy.realName',
                }, { 
                    title: 'Created On',
                    data: 'dateAdded',
                    ordering: false
                }, { 
                    title: 'Updated By',
                    data: 'updatedBy.realName',
                }, { 
                    title: 'Updated On',
                    data: 'dateUpdated',
                    ordering: false
                }, { //edit button
                    title: 'Action',
                    data: 'dateAdded',
                    ordering: false
                }],
                createdRow: (row, data, index) => {
                    let cells = $(row).find('td');
                    
                    if(data.content){
                        let content = data.content.length > 20 ? data.content.substring(0,20) + '...' : data.content;
                        
                        cells.eq(1).html(content.replace('<', '&lt;'));
                    }
                    
                    cells.eq(7).html('<button class="btn btn-primary btn-icon-text waves-effect" click.delegate="click_createWriteUp(\'' + data._id + '\')"><i class="zmdi zmdi-border-color"></i> Edit</button>');
                    
                    let _date = moment(data.dateAdded);
                    cells.eq(4).html(_date.format('MM') + '/' + _date.format('DD') + '/' + _date.format('YYYY'));
                    
                    let _updateddate = moment(data.dateUpdated);
                    cells.eq(6).html(_updateddate.format('MM') + '/' + _updateddate.format('DD') + '/' + _updateddate.format('YYYY'));
                    
                    promises.push(new Promise((resolve, reject) => {
                        if(!cells.eq(7)[0].querySelectorAll('.au-target').length) {
                            this.templatingEngine.enhance({
                                element: cells.eq(7)[0],
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