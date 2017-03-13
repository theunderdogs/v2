import { TaskQueue, inject, Aurelia, noView } from 'aurelia-framework';

@inject(TaskQueue)
export class App {
  constructor(TaskQueue) {   
    this.taskQueue = TaskQueue;
    this.profileName = window.profileName;
    
    var elem = document.createElement('textarea');
		elem.innerHTML = window.profilePic;
		this.profilePic = elem.value;
		this.year = window.year;
  }   
  
  configureRouter(config, router) {
    config.title = 'The Underdogs Rescue Admin Control Panel';
    config.map([
      { route: ['addpet'], name: 'addpet', moduleId: 'admin/viewmodels/addpet', nav: false, title: 'Add a pet' },
      { route: ['', '_=_', 'roles'], name: 'roles', moduleId: 'admin/viewmodels/roles/index', nav: false, title: 'Manage roles' },
      { route: ['createrole'], name: 'createrole', moduleId: 'admin/viewmodels/roles/createrole', nav: false, title: 'Create role' },
    	{ route: ['users'], name: 'users', moduleId: 'admin/viewmodels/users/index', nav: false, title: 'Manage users' },
    	{ route: ['createuser'], name: 'createuser', moduleId: 'admin/viewmodels/users/createuser', nav: false, title: 'Create user' },
			{ route: ['emaillists'], name: 'emaillists', moduleId: 'admin/viewmodels/emaillist/index', nav: false, title: 'Manage email lists' },
			{ route: ['createemaillist'], name: 'createemaillist', moduleId: 'admin/viewmodels/emaillist/createemaillist', nav: false, title: 'Create email lists' },    	
    	{ route: ['sendemail'], name: 'sendemail', moduleId: 'admin/viewmodels/emaillist/sendemail', nav: false, title: 'Send email' },
    	{ route: ['about'], name: 'about', moduleId: 'admin/viewmodels/about/index', nav: false, title: 'Manage \'About Us\' Page' },
    	{ route: ['createabout'], name: 'createabout', moduleId: 'admin/viewmodels/about/createabout', nav: false, title: 'Create \'About Us\' Page' },
    	{ route: ['contacttemplate'], name: 'contacttemplate', moduleId: 'admin/viewmodels/contacttemplate/index', nav: false, title: 'Manage \'Contact Info\' Page' },
    	{ route: ['createcontacttemplate'], name: 'createcontacttemplate', moduleId: 'admin/viewmodels/contacttemplate/createcontacttemplate', nav: false, title: 'Create \'Contact\' Template' },
    	{ route: ['faq'], name: 'faq', moduleId: 'admin/viewmodels/faq/index', nav: false, title: 'Manage \'FAQ\' Page' }
    	//optional paramerters
    	//{ route: ['', '_=_', 'createuser/:userid?'], name: 'createuser', moduleId: 'admin/viewmodels/users/createuser', nav: false, title: 'Create user' }
    ]);

    this.router = router;
  }

  click_logout(){
  	window.location.href = host + '/logout';
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
