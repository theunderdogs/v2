import 'jquery-mCustomScrollbar';
import 'vendors:bower_components/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.min.css!';
import Waves from 'waves';
import { TaskQueue, inject, Aurelia, noView, TemplatingEngine, BindingEngine, computedFrom } from 'aurelia-framework';
import {services} from 'common/services'
//import 'fetch';
//import {HttpClient} from 'aurelia-http-client';

@inject(TaskQueue, Aurelia, TemplatingEngine, BindingEngine, services)
export class Page{
	constructor(taskQueue, aurelia, templatingEngine, bindingEngine, db) {   
        this.taskQueue = taskQueue;
        this.aurelia = aurelia;
        this.templatingEngine = templatingEngine;    
        this.bindingEngine = bindingEngine;
        this.db = db;
    }   

    onPageRenderComplete(){
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
}