import 'jquery-mCustomScrollbar';
import 'vendors:bower_components/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.min.css!';
import Waves from 'waves';
import 'bootstrap-growl';
import {Router} from 'aurelia-router';
import { TaskQueue, inject, Aurelia, noView, TemplatingEngine, BindingEngine, computedFrom } from 'aurelia-framework';
import {services} from 'common/services';
import {functions} from 'common/functions';
import swal from 'sweet-alert';

import {
  ValidationControllerFactory,
  ValidationController,
  ValidationRules
} from 'aurelia-validation';
import _ from 'lodash';
//import {uiHelper} from 'common/uihelper';

@inject(TaskQueue, Aurelia, TemplatingEngine, BindingEngine, Router, ValidationControllerFactory, services, functions)
export class Page{
	constructor(taskQueue, aurelia, templatingEngine, bindingEngine, router, controllerFactory, db, fn) {   
        this.taskQueue = taskQueue;
        this.aurelia = aurelia;
        this.templatingEngine = templatingEngine;    
        this.bindingEngine = bindingEngine;
        this.router = router;
        this.controllerFactory = controllerFactory;
        this.validationRules = ValidationRules;
        this.db = db;
        this.fn = fn;
        this.swal = swal;
        
        this.init();
    }   
    
    // getRandomColor() {
    //     let colors = ['lightblue', 'bluegray', 'cyan', 'teal', 'green', 'orange', 'blue', 'purple'];
        
    //     //random number between 1 to 8
        
    //     return colors[Math.floor((Math.random() * 8) + 1) - 1];
    // }
    
    showUnauthorizedMessage () {
        this.swal("You don\'t have sufficient rights to perform this action");
    }
    
    init(){
        this.validationRules.customRule(
          'emailList',
          (value, obj) =>  { 
              if(value === undefined)
              return false;
              
              var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
              
              var emails = _.uniqBy(value.split(';')), flag = true;
              emails.forEach((mail) => {
                    if(!re.test(mail.trim()) ){
                        flag = false;
                        return true; //break loop
                    }
              });
              
              return flag;
            },
          `One or more email addresses are not property formatted` 
        );
    }

    onPageRenderComplete(){
        //console.log(this.router.currentInstruction.config.moduleId)
        
        this.swal.init()
        //aurelia.start().then(() => aurelia.setRoot('app', document.app));

    	// A microtask can be queued anywhere, lets put it inside of attached
    	 this.taskQueue.queueMicroTask(() => {       
            /*----------------------------------------------------------
                Scrollbar
            -----------------------------------------------------------*/
            function scrollBar(selector, theme, mousewheelaxis) {
                $(selector).mCustomScrollbar({
                    theme: theme,
                    scrollInertia: 100,
                    axis:'yx',
                    mouseWheel: {
                        enable: true,
                        axis: mousewheelaxis,
                        preventDefault: true
                    }
                });
            }

            if (!$('html').hasClass('ismobile')) {
                //On Custom Class
                if ($('.c-overflow')[0]) {
                    scrollBar('.c-overflow', 'minimal-dark', 'y');
                }
            }


            /*----------------------------------------------------------
                Text Field
            -----------------------------------------------------------*/
            //Add blue animated border and remove with condition when focus and blur
            if($('.fg-line')[0]) {
                $('body').on('focus', '.fg-line .form-control', function(){
                    $(this).closest('.fg-line').addClass('fg-toggled');
                })

                $('body').on('blur', '.form-control', function(){
                    var p = $(this).closest('.form-group, .input-group');
                    var i = p.find('.form-control').val();

                    if (p.hasClass('fg-float')) {
                        if (i.length == 0) {
                            $(this).closest('.fg-line').removeClass('fg-toggled');
                        }
                    }
                    else {
                        $(this).closest('.fg-line').removeClass('fg-toggled');
                    }
                });
            }

            //Add blue border for pre-valued fg-flot text feilds
            if($('.fg-float')[0]) {
                $('.fg-float .form-control').each(function(){
                    var i = $(this).val();

                    if (!i.length == 0) {
                        $(this).closest('.fg-line').addClass('fg-toggled');
                    }

                });
            }


            Waves.attach('.btn');
            Waves.attach('.btn-icon, .btn-float', ['waves-circle', 'waves-float']);
            Waves.init();
        });
    }
    
    showProgress(message) {
        let hideFn = this.notify({
                type: 'info',
                icon: 'zmdi zmdi-thumb-up m-r-20',
                message: message || 'Please wait',
                delay: 0
            });
            
        return () => {
            hideFn.close();
        }
    }
    
    showSuccess(message){
        this.notify({
                type: 'success',
                icon: 'zmdi zmdi-thumb-up m-r-20',
                message: message || 'Saved successfully'
            }); 
    }
    
    showError(message){
        this.notify({
                type: 'danger',
                icon: 'zmdi zmdi-thumb-down m-r-20',
                message: message || 'Something went wrong',
                delay: 0
            }); 
    }
    
    notify(config) {
        return $.growl({
                icon: config.icon,// 'fa fa-check',//icon,
                title: config.title, // ' Bootstrap Growl ',
                message: config.message ,//'Turning standard Bootstrap alerts into awesome notifications',
                url: ''
            },{
                    element: 'body',
                    type: config.type, //'success', //'inverse',
                    allow_dismiss: true,
                    placement: {
                            from: config.from,
                            align: config.align
                    },
                    offset: {
                        x: 20,
                        y: 85
                    },
                    spacing: 10,
                    z_index: 1031,
                    delay: config.delay || 2500,  //0 is permanent
                    timer: 1000,
                    url_target: '_blank',
                    mouse_over: false,
                    animate: {
                            enter: config.animIn || 'animated bounceInUp', //config.animIn,
                            exit: config.animOut || 'animated bounceOutUp'// config.animOut
                    },
                    icon_type: 'class',
                    template: '<div data-growl="container" class="alert" role="alert">' +
                                    '<button type="button" class="close" data-growl="dismiss">' +
                                        '<span aria-hidden="true">&times;</span>' +
                                        '<span class="sr-only">Close</span>' +
                                    '</button>' +
                                    '<span data-growl="icon"></span>' +
                                    '<span data-growl="title"></span>' +
                                    '<span data-growl="message"></span>' +
                                    '<a href="#" data-growl="url"></a>' +
                                '</div>'
            });
    }
    
}