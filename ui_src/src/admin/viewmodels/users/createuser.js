import {Page} from 'common/page';
import 'bootstrap-select'

export class CreateUser extends Page{
    constructor(...rest) {   
        super(...rest);
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
        
        return Promise.all( this.editUser ? [this.db.getroles(), this.db.getUserByFacebookId(this.user.facebookId)] : [this.db.getroles()])
        .then((data) => {
            if(data[0] && data[0].length > 0) {
                this.roleList = data[0];
            }
            
            if(data[1]) {
                //this.roleList = data[0];
                console.log('user', data[1]);
            }
        })
    }
    
    attached(){
    	 this.onPageRenderComplete();
    	 
    	 this.taskQueue.queueMicroTask(() => {       
        	$(this.rolesCombo).selectpicker();
    	 });
    }
    
    click_applyChanges(){
        let hideFn = this.showProgress('Loading role...');
        
        return this.db.saveUser(this.user)
        .then((result) => {
            console.log('success', result);
            hideFn();
            this.showSuccess('User ' + (this.editUser ? 'updated' : 'added') + ' successfully'); 
        },(err) => {
            console.log(err);
            this.showError();
        });
    }
    
    change_selectedRole() {
        console.log(this.user.role);
    }
    
    click_goback(){
        this.router.navigate('users');
    }
    
    getViewStrategy() {
        return 'admin/views/users/createuser.html';
    }
}