import {Page} from 'common/page';
//import 'bootstrap-select'
import {BootstrapFormRenderer} from 'admin/viewmodels/users/createusererror';
import 'vendors:summernote/dist/summernote.css!'
import 'summernote'
import 'bootstrap-select'
import 'dropzone'

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
        
        this.senderEmails = [];
        this.selectedSender = undefined;
        this.senderName = undefined;
        
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
        
        
        return Promise.all([this.db.getEmailListById(this.emailList._id), this.db.getSendersEmails()])
        .then((data) => {
            if(data[0]) {
                console.log('email list', data[0]);
                this.emailList.name = data[0].name;
                this.emailList.list = data[0].list;
            }
            
            if(data[1] && data[1].length > 0){
                console.log('senders email', data[1]);
                this.senderEmails = data[1];
            }
        });
    }
    
    attached(){
    	 this.onPageRenderComplete();
    	 
    // 	 $(this.txtsubject).summernote({
    //             height: 150,
    //             placeholder: 'Write your message here'
    //         });
            
        this.taskQueue.queueMicroTask(() => {       
        	$(this.senderEmailCombo).selectpicker();
    	 });
    	 
    	$(this.dropzoneUpload).dropzone({
            url: "/file/post",
            addRemoveLinks: true

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
    
    change_selectedSender(){
       this.senderName = this.selectedSender.from;
    }
    
    click_goback(){
        this.router.navigate('emaillists');
    }
    
    getViewStrategy() {
        return 'admin/views/emaillist/sendemail.html';
    }
}