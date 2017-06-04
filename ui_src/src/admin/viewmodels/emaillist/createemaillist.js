import {Page} from 'common/page';
//import 'bootstrap-select'
import {BootstrapFormRenderer} from 'admin/viewmodels/users/createusererror';

export class CreateUser extends Page{
    constructor(...rest) {   
        super(...rest);
        this.controller = this.controllerFactory.createForCurrentScope();
        this.controller.addRenderer(new BootstrapFormRenderer());
    }  
    
    activate(params){
        this.editEmaillist = false;
        this.roleList = [];
        
        this.emailList = {
            name: undefined,
            list: undefined
        };
        
        if(params.hasOwnProperty('emailListId')){
            //console.log(params.userId);    
            this.emailList._id = params.emailListId;
            this.editEmaillist = true;
        }
        
        this.validationRules
          .ensure(a => a.name)
            .required()
            .withMessage('Please enter name for the email list')
          .ensure(a => a.list)
            .required()
            .withMessage('Please enter comma-separated email addresses')
            .satisfiesRule('emailList')
            .when(a => a.list !== undefined)
          .on(this.emailList)
          
        if(this.editEmaillist){
            return this.db.getEmailListById(this.emailList._id)
            .then((data) => {
                if(data) {
                    //this.roleList = data[0];
                    console.log('email list', data);
                    this.emailList.name = data.name;
                    this.emailList.list = data.list;
                }
            });
        } else {
            return true;   
        }
    }
    
    attached(){
    	 this.onPageRenderComplete();
    }
    
    click_applyChanges(){
        let hideFn = this.showProgress('Loading role...');
        
        //console.log(this.user);
        
        return this.controller.validate()
        .then(result => {
            if(result.valid) {
                let list = JSON.parse(JSON.stringify(this.emailList));
                
                console.log('user to be saved', list);
                
                return this.db.saveEmailList(list)
                .then((result) => {
                    console.log('success', result);
                    //hideFn();
                    this.showSuccess('List ' + (this.editEmaillist ? 'updated' : 'added') + ' successfully');
                    this.router.navigate('emaillists');
                },(err) => {
                    hideFn();
                    console.log(err);
                    if(err.status === 401) 
                        this.showUnauthorizedMessage();
                    this.showError();
                });        
            } else {
                hideFn();
            }
        });
    }
    
    click_goback(){
        this.router.navigate('emaillists');
    }
    
    getViewStrategy() {
        return 'admin/views/emaillist/createemaillist.html';
    }
}