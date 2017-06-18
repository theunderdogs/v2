import { TaskQueue } from 'aurelia-framework';

export const functions = {
    getRandomColor : () => {    
        return ['lightblue', 'cyan', 'teal', 'green', 'orange', 'blue', 'purple'][Math.floor((Math.random() * 7) + 1) - 1]; //'bluegray'
    },
    postRenderScript : () => {
        let taskQueue = _aurelia.container.get(TaskQueue);
        
        /*-----------------------------------------------------------
              Link prevent
          -----------------------------------------------------------*/
          $('body').on('click', '.a-prevent', function(e){
              e.preventDefault();
          });
      
          // A microtask can be queued anywhere, lets put it inside of attached
          taskQueue.queueMicroTask(() => {       
          	    $('body').on('click', '[data-ma-action]', function (e) {
      	        e.preventDefault();
      
      	        var $this = $(this);
      	        var action = $(this).data('ma-action');
      
      	        switch (action) {
      
      	            /*-------------------------------------------
      	                Sidebar Open/Close
      	            ---------------------------------------------*/
      	            case 'sidebar-open':
      	                var target = $this.data('ma-target');
      	                var backdrop = '<div data-ma-action="sidebar-close" class="ma-backdrop" />';
      
      	                $('body').addClass('sidebar-toggled');
      	                $('#header, #header-alt, #main').append(backdrop);
      	                $this.addClass('toggled');
      	                $(target).addClass('toggled');
      
      	                break;
      
      	            case 'sidebar-close':
      	                $('body').removeClass('sidebar-toggled');
      	                $('.ma-backdrop').remove();
      	                $('.sidebar, .ma-trigger').removeClass('toggled')
      
      	                break;
      
      
      	            /*-------------------------------------------
      	                Profile Menu Toggle
      	            ---------------------------------------------*/
      	            case 'profile-menu-toggle':
      	                $this.parent().toggleClass('toggled');
      	                $this.next().slideToggle(200);
      
      	                break;
      
      
      	            /*-------------------------------------------
      	                Mainmenu Submenu Toggle
      	            ---------------------------------------------*/
      	            case 'submenu-toggle':
      	                $this.next().slideToggle(200);
      	                $this.parent().toggleClass('toggled');
      
      	                break;
      
      
      	            /*-------------------------------------------
      	                Top Search Open/Close
      	            ---------------------------------------------*/
      	            //Open
      	            case 'search-open':
      	                $('#header').addClass('search-toggled');
      	                $('#top-search-wrap input').focus();
      
      	                break;
      
      	            //Close
      	            case 'search-close':
      	                $('#header').removeClass('search-toggled');
      
      	                break;
      
      
      	            /*-------------------------------------------
      	                Fullscreen Browsing
      	            ---------------------------------------------*/
      	            case 'fullscreen':
      	                //Launch
      	                function launchIntoFullscreen(element) {
      	                    if(element.requestFullscreen) {
      	                        element.requestFullscreen();
      	                    } else if(element.mozRequestFullScreen) {
      	                        element.mozRequestFullScreen();
      	                    } else if(element.webkitRequestFullscreen) {
      	                        element.webkitRequestFullscreen();
      	                    } else if(element.msRequestFullscreen) {
      	                        element.msRequestFullscreen();
      	                    }
      	                }
      
      	                //Exit
      	                function exitFullscreen() {
      
      	                    if(document.exitFullscreen) {
      	                        document.exitFullscreen();
      	                    } else if(document.mozCancelFullScreen) {
      	                        document.mozCancelFullScreen();
      	                    } else if(document.webkitExitFullscreen) {
      	                        document.webkitExitFullscreen();
      	                    }
      	                }
      
      	                launchIntoFullscreen(document.documentElement);
      
      	                break;
      
      
      	            /*-------------------------------------------
      	                Login Window Switch
      	            ---------------------------------------------*/
      	            case 'login-switch':
      	                var loginblock = $this.data('ma-block');
      	                var loginParent = $this.closest('.lc-block');
      
      	                loginParent.removeClass('toggled');
      
      	                setTimeout(function(){
      	                    $(loginblock).addClass('toggled');
      	                });
      
      	                break;
      
      
      	            /*-------------------------------------------
      	                Change Header Skin
      	            ---------------------------------------------*/
      	            case 'change-skin':
      
      	                var skin = $this.data('ma-skin');
      	                $('[data-ma-theme]').attr('data-ma-theme', skin);
      
      	                break;
      	        }
      	    });
      
            /*----------------------------------------------------------
            Page Loader
            -----------------------------------------------------------*/
            function hasClass(element, cls) {
                return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
            }
            
            if(!hasClass(document.documentElement, 'ismobile')) {
                if(document.getElementsByClassName('page-loader').length > 0) {
                    //setTimeout (function () {
                        //$('.page-loader').fadeOut();
                        document.getElementsByClassName('page-loader')[0].style.display = "none";
                    //}, 500);
    
                }
            }    
      
      
          });
    }
}