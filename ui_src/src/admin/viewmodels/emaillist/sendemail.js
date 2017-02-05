import {Page} from 'common/page';
//import 'bootstrap-select'
import {BootstrapFormRenderer} from 'admin/viewmodels/users/createusererror';
import 'vendors:summernote/dist/summernote.css!'
import 'summernote'

export class CreateUser extends Page{
    constructor(...rest) {   
        super(...rest);
        this.controller = this.controllerFactory.createForCurrentScope();
        this.controller.addRenderer(new BootstrapFormRenderer());
    }  
    
    activate(params){
        this.emailList = {
            subject: undefined,
            bodyhtml: undefined,
            list: undefined
        };
        
        this.username = undefined;
        this.password = undefined;
        
        if(params.hasOwnProperty('emailListId')){
            //console.log(params.userId);    
            this.emailList._id = params.emailListId;
        }
        
        this.validationRules
        //   .ensure(a => a.emailList.list)
        //     .required()
        //     .withMessage('Please enter email addresses')
          .ensure(a => a.username)
            .required()
            .withMessage('Please enter your email address')
          .ensure(a => a.password)
            .required()
            .withMessage('Please enter password for your email')
          .on(this);
        
        
        return this.db.getEmailListById(this.emailList._id)
        .then((data) => {
            if(data) {
                console.log('email list', data);
                this.emailList.name = data.name;
                this.emailList.list = data.list;
            }
        });
    }
    
    attached(){
    	 this.onPageRenderComplete();
    	 
    	 $(this.txtsubject).summernote({
                height: 150,
                placeholder: 'Write your message here'
            });
    }
    
    click_applyChanges(){
        return this.controller.validate()
         .then(result => {
             
             if(result.valid) {
                  let hideFn = this.showProgress('Loading role...');
                  
                return this.db.sendEmail({
            from : this.username,
            password: this.password,
            list : this.emailList.list,
            subject : this.emailList.subject,
            bodyhtml : $(this.txtsubject).val()
        })
                .then((result) => {
                    console.log('success', result);
                    hideFn();
                    this.showSuccess('Email sent successfully');
                    //this.router.navigate('emaillists');
                },(err) => {
                    hideFn();
                    console.log(err);
                    this.showError();
                });      
             }
         });
        
        
        // //console.log(this.user);
        
        // return this.controller.validate()
        // .then(result => {
        //     if(result.valid) {
        //         let list = JSON.parse(JSON.stringify(this.emailList));
                
        //         console.log('user to be saved', list);
                
        //         return this.db.saveEmailList(list)
        //         .then((result) => {
        //             console.log('success', result);
        //             //hideFn();
        //             this.showSuccess('List ' + (this.editEmaillist ? 'updated' : 'added') + ' successfully');
        //             this.router.navigate('emaillists');
        //         },(err) => {
        //             hideFn();
        //             console.log(err);
        //             this.showError();
        //         });        
        //     } else {
        //         hideFn();
        //     }
        // });
    }
    
    click_sendEmail(){
       
        
        
    }
    
    click_goback(){
        this.router.navigate('emaillists');
    }
    
    getViewStrategy() {
        return 'admin/views/emaillist/sendemail.html';
    }
}