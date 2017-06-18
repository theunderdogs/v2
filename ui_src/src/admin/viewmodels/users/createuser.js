import {Page} from 'common/page';
import 'bootstrap-select'
import {BootstrapFormRenderer} from 'admin/viewmodels/users/createusererror';

export class CreateUser extends Page{
    constructor(...rest) {   
        super(...rest);
        this.controller = this.controllerFactory.createForCurrentScope();
        this.controller.addRenderer(new BootstrapFormRenderer());
    }  
    
    activate(params){
        this.editUser = false;
        this.roleList = [];
        
        this.user = {
            realName: undefined,
            facebookId: undefined,
            isAdmin: false,
            role: undefined,
            enable: false
        };
        
        if(params.hasOwnProperty('facebookId')){
            //console.log(params.userId);    
            this.user.facebookId = params.facebookId;
            this.editUser = true;
        }
        
        this.validationRules
          .ensure(a => a.realName)
            .required()
            .withMessage('Please enter name of the person you want to add')
          .ensure(a => a.facebookId)
            .required()
            .withMessage('Please enter facebookId eg. 10158081909300057')
          .ensure(a => a.role)
            .required()
            .when(a => a.isAdmin === false)
            .withMessage('Please select a role')
          .on(this.user);
        
        return Promise.all( this.editUser ? [this.db.getroles(), this.db.getUserByFacebookId(this.user.facebookId)] : [this.db.getroles()])
        .then((data) => {
            if(data[0] && data[0].length > 0) {
                this.roleList = data[0];
            }
            
            if(data[1]) {
                //this.roleList = data[0];
                console.log('user', data[1]);
                this.user._id = data[1]._id;
                this.user.realName = data[1].realName;
                this.user.isAdmin = data[1].isAdmin;
                this.user.enable = data[1].enable;
                
                if(data[1].hasOwnProperty('role')){
                    this.user.role = data[1].role;
                }
            }
        })
    }
    
    attached(){
    	 this.onPageRenderComplete();
    	 
    	 this.taskQueue.queueMicroTask(() => {  
    	    $(this.rolesCombo).selectpicker();
    	 });
    	 
    	 this.taskQueue.queueMicroTask(() => {  
    	    if(this.user.role) 
        	    $(this.rolesCombo).selectpicker('val', this.user.role);
         });
    }
    
    click_applyChanges(){
        let hideFn = this.showProgress('Loading role...');
        
        //console.log(this.user);
        
        return this.controller.validate()
        .then(result => {
            if(result.valid) {
                let user = JSON.parse(JSON.stringify(this.user));
                user.role = user.role == ''? undefined: user.role;
                
                console.log('user to be saved', user);
                
                return this.db.saveUser(user)
                .then((result) => {
                    console.log('success', result);
                    //hideFn();
                    this.showSuccess('User ' + (this.editUser ? 'updated' : 'added') + ' successfully');
                    this.router.navigate('users');
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
    
    change_selectedRole() {
        console.log(this.user.role);
    }
    
    change_isAdmin(){
        console.log(this.user.isAdmin);
        this.taskQueue.queueMicroTask(() => {  
    	    $(this.rolesCombo).selectpicker('refresh');
    	});
    }
    
    click_goback(){
        this.router.navigate('users');
    }
    
    getViewStrategy() {
        return 'admin/views/users/createuser.html';
    }
}