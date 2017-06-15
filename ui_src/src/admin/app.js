import { TaskQueue, inject, Aurelia, noView } from 'aurelia-framework';
import routes from 'common/routes.json!';

@inject(TaskQueue, Aurelia)
export class App {
  constructor(TaskQueue, aurelia) {   
    this.taskQueue = TaskQueue;
    this.profileName = window.profileName;
    this.aurelia = aurelia;
    
    var elem = document.createElement('textarea');
		elem.innerHTML = window.profilePic;
		this.profilePic = elem.value;
		this.year = window.year;
  }   
  
  configureRouter(config, router) {
    config.title = 'The Underdogs Rescue Admin Control Panel';
    //config.options.root = ''
    
    config.map(routes.protected);
    
    //optional paramerters
    	//{ route: ['', '_=_', 'createuser/:userid?'], name: 'createuser', moduleId: 'admin/viewmodels/users/createuser', nav: false, title: 'Create user' }
    

    this.router = router;
  }

  click_logout(){
  	let self = this
  	$.ajaxSetup({ cache: true });
	  $.getScript('//connect.facebook.net/en_US/sdk.js', function(){
	  	FB.getLoginStatus(function(response) {
	  		console.log('logout response', response)
	        if (response && response.status === 'connected') {
	            FB.logout(function(response) {
	              console.log('logout', response)
				  self.postLogout();
	            });
	        }
	    });
	  });
	  
	  self.postLogout();
  }


  postLogout() {
  	  let self = this;
  	  localStorage['accesstoken'] = null;
	  self.router.navigate('')//, { replace: true, trigger: false });
	  self.router.deactivate()
	  self.router.reset();
	  return self.aurelia.setRoot('public/publicapp')
			.then(() => {
				self.aurelia.root.viewModel.router.navigateToRoute('login');	
			})
  }

  attached(){
  	/*-----------------------------------------------------------
        Link prevent
    -----------------------------------------------------------*/
    $('body').on('click', '.a-prevent', function(e){
        e.preventDefault();
    });

    // A microtask can be queued anywhere, lets put it inside of attached
    this.taskQueue.queueMicroTask(() => {       
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

    });
     
  }

	

}
