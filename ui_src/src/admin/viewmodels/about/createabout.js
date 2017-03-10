//import { TaskQueue, inject, Aurelia, noView } from 'aurelia-framework';
import {Page} from 'common/page';
//import 'vendors:bower_components/datatables.net-dt/css/jquery.dataTables.min.css!'
//import 'vendors:bower_components/bootstrap-select/dist/css/bootstrap-select.css!'
import 'datatables'
import 'bootstrap-select'
import optionHtml from 'admin/views/roles/options.html!text';
import {BootstrapFormRenderer} from 'admin/viewmodels/users/createusererror';

export class CreateRole extends Page{
    constructor(...rest) {   
        super(...rest);
        this.controller = this.controllerFactory.createForCurrentScope();
        this.controller.addRenderer(new BootstrapFormRenderer());
    }   
    
    activate(params){
        this.showPreview = false;
        this.editMode = false;
        
        this.about = {
            name: undefined,
            active : false,
            content: undefined
        };
        
        this.validationRules
          .ensure(a => a.name)
            .required()
            .withMessage('Please enter name for this version')
          .on(this.about);
        
        if(params.hasOwnProperty('id')){
            //console.log(params.userId);    
            this.about._id = params.id;
            this.editMode = true;
            
            return Promise.all( [this.db.getAboutById(this.about._id), this.db.getActiveAboutById() ])
                .then((results) => {
                    let _about = results[0], activeAbout = results[1];
                    this.about._id = _about._id;
                    this.about.content = _about.content;
                    
                    if(!activeAbout)
                        this.about.active = false;
                    else {
                        this.about.active = activeAbout.aboutId == this.about._id;
                    }
                        
                    this.about.name = _about.name;
                }, (error) => {
                    console.log(error);
                });
        }
        
        // return Promise.all( this.editRole? [this.db.getPermissions(), this.db.getPermissionsByRoleId(this.role._id)] : [this.db.getPermissions()])
        // .then(( data ) => {
        //   //console.log('roles', data[0] );
        //   //console.log('permissions', data[1] );
          
        //   if(!this.editRole){
        //       if(data[0]){
        //           data[0].forEach((per) => {
        //             this.role.permissions.push({ value: undefined, item: per });    
        //           });
        //       }
        //   } else {
        //       this.role = data[1];
        //       data[0].forEach((permission) => {
        //         let match = false;
        //         this.role.permissions.forEach((userPermission) => {
        //             if(userPermission.item._id == permission._id){
        //                 match = true;
        //             }
        //         });
                
        //         if(!match) {
        //             this.role.permissions.push({ value: undefined, item: permission });
        //         }
        //     });
        //   }
        // });
    }
    
    attached(){
        //console.log('ROle...', this.role);
        
        //let self = this;
    	 //this.onPageRenderComplete();
    	 
    	 //this.renderDatatable();
    }
    /*
    renderDatatable() {
        console.log('table data', this.role.permissions);
        
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
        })
        .then(() => {
            let promises = [];
            
            $(this.dtable).DataTable({
                data: this.role.permissions,
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
        });
    }
    */
    click_applyChanges(){
        // //console.log(this.role);
        
        // //obj = JSON.parse(JSON.stringify(o));
        
        let hideFn = this.showProgress('Saving changes...');
        
        // // var newObject = $.extend(true, {}, this.tdata);
        
        return this.controller.validate()
         .then(result => {
             if(result.valid) {
        //         let indexesToDelete = [];
        //         this.role.permissions.forEach((permission) => {
        //             if(permission.value == undefined) {
        //                 indexesToDelete.push(this.role.permissions.indexOf(permission));
        //             }
        //         });
                
        //         for(let i = indexesToDelete.length - 1; i >=0; i--) {
        //             this.role.permissions.splice(indexesToDelete[i] , 1);
        //         }
                
        //         console.log('newrole to be saved', this.role);
            
                return this.db.saveAboutus(this.about)
                .then((about) => {
                    console.log('success', about);
                    hideFn();
                    this.showSuccess('Saved successfully');
                    this.router.navigate('about');
                },(err) => {
                    hideFn();
                    console.log(err);
                    this.showError();
                });
             } else {
                 hideFn();
                 //this.showError();
             }
        });
    }
    
    click_goback() {
        this.router.navigate('about');
    }
    
    click_preview() {
        this.showPreview = !this.showPreview;
        $(this.dynamicDom).html(this.about.content);
    }
    
    getViewStrategy() {
        return 'admin/views/about/createabout.html';
    }
}