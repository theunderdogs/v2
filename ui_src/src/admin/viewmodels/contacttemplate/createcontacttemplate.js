//import { TaskQueue, inject, Aurelia, noView } from 'aurelia-framework';
import {Page} from 'common/page';
//import 'vendors:bower_components/datatables.net-dt/css/jquery.dataTables.min.css!'
//import 'vendors:bower_components/bootstrap-select/dist/css/bootstrap-select.css!'
import 'datatables'
import 'bootstrap-select'
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
        
        this.contacttemplate = {
            name: undefined,
            active : false,
            content: undefined
        };
        
        this.validationRules
          .ensure(a => a.name)
            .required()
            .withMessage('Please enter name for this version')
          .on(this.contacttemplate);
        
        if(params.hasOwnProperty('id')){
            //console.log(params.userId);    
            this.contacttemplate._id = params.id;
            this.editMode = true;
            
            return Promise.all( [this.db.getContactTemplateById(this.contacttemplate._id), this.db.getActiveContactTemplate() ])
                .then((results) => {
                    let _contacttemplate = results[0], activeAbout = results[1];
                    this.contacttemplate._id = _contacttemplate._id;
                    this.contacttemplate.content = _contacttemplate.content;
                    
                    if(!activeAbout)
                        this.contacttemplate.active = false;
                    else {
                        this.contacttemplate.active = activeAbout.templateId == this.contacttemplate._id;
                    }
                        
                    this.contacttemplate.name = _contacttemplate.name;
                }, (error) => {
                    console.log(error);
                });
        }
    }
    
    attached(){
        //console.log('ROle...', this.role);
        
        //let self = this;
    	 this.onPageRenderComplete();
    	 
    	 //this.renderDatatable();
    }
   
    click_applyChanges(){
        return this.controller.validate()
         .then(result => {
             if(result.valid) {
                let hideFn = this.showProgress('Saving changes...');
                    
                return this.db.saveContactTemplate(this.contacttemplate)
                .then((contacttemplate) => {
                    console.log('success', contacttemplate);
                    hideFn();
                    this.showSuccess('Saved successfully');
                    this.router.navigate('contacttemplate');
                },(err) => {
                    hideFn();
                    if(err.status === 401) 
                        this.showUnauthorizedMessage();
                    console.log(err);
                    this.showError();
                });
             } else {
                 //hideFn();
                 //this.showError();
             }
        });
    }
    
    click_goback() {
        this.router.navigate('contacttemplate');
    }
    
    click_preview() {
        this.showPreview = !this.showPreview;
        $(this.dynamicDom).html(this.contacttemplate.content);
    }
    
    getViewStrategy() {
        return 'admin/views/contacttemplate/createcontacttemplate.html';
    }
}