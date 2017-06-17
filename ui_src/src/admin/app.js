import { TaskQueue, inject, Aurelia, noView } from 'aurelia-framework';
import routes from 'common/routes.json!';
import {functions} from 'common/functions';

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
  	localStorage.removeItem('accesstoken')
	  self.router.navigate('')//, { replace: true, trigger: false });
	  self.router.deactivate()
	  self.router.reset();
	  return self.aurelia.setRoot('public/publicapp')
			.then(() => {
				self.aurelia.root.viewModel.router.navigateToRoute('login');	
			})
  }

  attached(){
	 if(!window.didPostScriptFinishRunning) {
  		window.didPostScriptFinishRunning = true;
  		functions.postRenderScript()
  	 }
  }
}
