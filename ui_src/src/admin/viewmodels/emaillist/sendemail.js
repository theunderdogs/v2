import {Page} from 'common/page';
//import 'bootstrap-select'
import {BootstrapFormRenderer} from 'admin/viewmodels/users/createusererror';
import 'vendors:summernote/dist/summernote.css!'
import 'summernote'
import 'bootstrap-select'
import Dropzone from 'dropzone'
//import swal from 'sweet-alert'
//import 'vendors:bower_components/sweetalert2/dist/sweetalert2.min.css!';

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
        
        this.senderEmails = [];
        this.selectedSender = undefined;
        this.senderName = undefined;
        this.password = undefined;
        
        this.dropZoneInstance;
        
        if(params.hasOwnProperty('emailListId')){
            //console.log(params.userId);    
            this.emailList._id = params.emailListId;
        }
        
        this.validationRules
          .ensure(a => a.list)
            .required()
            .withMessage('Please enter comma-separated email addresses')
            .satisfiesRule('emailList')
          .on(this.emailList);
        
        this.validationRules
          .ensure(a => a.selectedSender)
            .required()
            .withMessage('Please select an email')
          .ensure(a => a.senderName)
            .required()
            .when(a => a.selectedSender !== undefined)
            .withMessage('Please enter sender\'s name')
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
         let self = this;
         
    	 this.onPageRenderComplete();
    	 
    // 	 $(this.txtsubject).summernote({
    //             height: 150,
    //             placeholder: 'Write your message here'
    //         });
            
        this.taskQueue.queueMicroTask(() => {       
        	$(this.senderEmailCombo).selectpicker();
    	 });
    	 
    	$(this.dropzoneUpload).dropzone({ 
            dictDefaultMessage: 'Drop files to attach',
            url: '/file/post',
            addRemoveLinks: true,
            maxFilesize: 25, //in MB
            totalMaxUploadSize: 25,//25,
            //maxFiles: 2,
            init: function () {
                self.dropZoneInstance = this;
                this.on("success", function(fileArray, response) {
                        //console.log("Success", fileArray);
                        //debugger;
                        console.log("Success", fileArray, $.parseJSON(response));
                        //console.log(self.dropZoneInstance.getAcceptedFiles().length);
                });
                this.on("maxfilesreached", function(fileArray) {
                        //console.log("MAX_FILES_REACHED", fileArray);
                });
                this.on("maxfilesexceeded", function(fileArray, response) {
                        //console.log("MAX_FILES_REACHED", fileArray, response);
                });
                this.on("filetoobig", function(fileArray) {
                        //console.log("File too big", fileArray);
                        //console.log(self.dropZoneInstance.getAcceptedFiles().length);
                });
                this.on("removedfile", function(fileArray) {
                        //console.log("Removed file", fileArray);
                        //console.log(self.dropZoneInstance.getAcceptedFiles().length);
                });
                this.on("totalmaxuploadsizeexceeded", function(file, totalUploaded, uploadLimit){
                    //console.log("totalmaxuploadsizeexceeded", file, totalUploaded, uploadLimit);
                });
                this.on("sending", function(file, xhr, data){
                    if(file.fullPath){
                        data.append("fullPath", file.fullPath);
                    }
                });
                this.on("error", function(file, message) {
                        //console.log("Error", file);
                        //console.log(self.dropZoneInstance.getRejectedFiles().length);
                });
            }
        });
        
    }
    
    click_applyChanges(){
        //swal.init();
        
        let self = this;
        ///console.log( self.dropZoneInstance.getAcceptedFiles() );
        
        return this.controller.validate()
         .then(result => {
            console.log('result.valid', result.valid)
            
            if(result.valid) {
                let message;
                
                if(!this.emailList.subject) {
                    message = 'Do you want send email without subject?';    
                } else if(!this.emailList.bodyhtml) {
                    message = 'Do you want send email with empty body?';
                }
                
                if(message) {
                    this.swal({   
                        title: "Are you sure?",   
                        text: message,   
                        type: "warning",   
                        showCancelButton: true,   
                        confirmButtonText: "Yes",
                    }).then(function(result){
                        console.log(result);
                        return self.sendEmail();
                    })
                    .catch(function(result){
                        console.log('cancelled ', result);
                    });
                } else {
                    //return self.sendEmail();
                    self.openPasswordModal()
                    return true
                }
            }
         });
    }
    
    openPasswordModal() {
        let self = this;
        
        $(this.modalCredentials).on('shown.bs.modal', function (e) {
           $(self.passwordField).focus()
        })
                    
        $(this.modalCredentials).modal('show');
    }
    
    click_sendEmail(){
        //console.log( this.dropZoneInstance.getAcceptedFiles().map( f => f.serverPath ) );
   
        let hideFn = this.showProgress('Sending email...');
          
        return this.db.sendEmail({
            senderEmail: this.selectedSender.user,
            password: this.password,
            senderName: this.senderName,
            list : this.emailList.list,
            subject : this.emailList.subject,
            bodyhtml : this.emailList.bodyhtml,
            attachments: this.dropZoneInstance.getAcceptedFiles().map( f => { 
                return { path: f.serverPath, filename: f.fileName }; 
            } )
        })
        .then((result) => {
            console.log('success', result);
            hideFn();
            this.showSuccess('Email sent successfully');
            $(this.modalCredentials).modal('hide');
            this.router.navigate('emaillists');
        },(err) => {
            hideFn();
            console.log(err);
            this.showError();
        });
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