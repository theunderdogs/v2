import { TaskQueue, inject, Aurelia, noView } from 'aurelia-framework';
import {functions} from 'common/functions';
import routes from 'common/routes.json!';
import {services} from 'common/services';
import AuthorizeStep from 'common/AuthorizeStep';
import PreActivateStep from 'common/PreActivateStep'; 
import PreRenderStep from 'common/PreRenderStep'; 
import PostRenderStep from 'common/PostRenderStep'; 

@inject(TaskQueue, Aurelia, services)
export class App {
  constructor(TaskQueue, aurelia, db) {   
    this.taskQueue = TaskQueue;
    this.year = window.year;
    this.color = functions.getRandomColor();
    this.aurelia = aurelia;
    this.db = db;
  }   
  
  configureRouter(config, router) {
  	config.title = 'The Underdogs Rescue';
  	
  	// config.addAuthorizeStep(AuthorizeStep); //alternate way: config.addPipelineStep('authorize', AuthorizeStep);       
   // config.addPreActivateStep(PreActivateStep); //alternate way: config.addPipelineStep('preActivate', AuthorizeStep); 
   // config.addPreRenderStep(PreRenderStep); //alternate way: config.addPipelineStep('preRender', AuthorizeStep);   
   // config.addPostRenderStep(PostRenderStep); //alternate way: config.addPipelineStep('postRender', AuthorizeStep);   
 
  	//console.log('all routes', [...routes.public, ...routes.protected])
  	//config.options.root = ''
  	config.map(routes.public);
    
    //optional paramerters
    //{ route: ['', '_=_', 'createuser/:userid?'], name: 'createuser', moduleId: 'admin/viewmodels/users/createuser', nav: false, title: 'Create user' }

    this.router = router;
  }

  checkWithDB() {
  	let self = this;
  	return this.db.authenticate()
  			 //$.ajax( {
		    //       url: host + "/auth/facebook/token",
		    //       type: 'POST',
		    //       data: JSON.stringify({ access_token : JSON.parse(localStorage['accesstoken'] || null) }),
	    	// 	  contentType: 'application/json'
		    //   })
		      .then((res) => {
		      	 console.log('success', res);
		      	 
		      	 window.permissions = res.permissions ? JSON.parse(res.permissions) : null;
			     window.user = res.user
			     window.profileName = res.profileName;
			     window.profilePic = res.profilePic;
			     
			     self.router.navigate('') //, { replace: true, trigger: false });
    			 self.router.deactivate()
    			 self.router.reset();
    			 //;
    			 return self.aurelia.setRoot('admin/app')
			     //return self.aurelia.start().then(() => self.aurelia.setRoot('admin/app'));
			     // .then(() => {
				    //   self.aurelia.root.viewModel.router.navigateToRoute('');
				    // }); 
		      },(err) => {
		      	console.log('error', err)
		      	//user not found in underdogs database
		      	console.log('setting access token', null)
		      	localStorage['accesstoken'] = null;
		      });
        	
  }
  
  click_login(){
  	  let self = this;
  	  
	    //load scripts for facebook login
	  //$.ajaxSetup({ cache: true });
	  $.getScript('//connect.facebook.net/en_US/sdk.js', function(){
	    FB.init({
	      appId: '258563667910331',
	      version: 'v2.7' // or v2.1, v2.2, v2.3, ...
	    });
	    
	    	//$('#loginbutton,#feedbutton').removeAttr('disabled');
	    FB.getLoginStatus(function(response) {
	      console.log('Login status callback', response)
		  if (response.status === 'connected') {
		    console.log('Logged in.');
		    //let uid = response.authResponse.userID;
        	//let accessToken = response.authResponse.accessToken;
        	console.log('setting access token', response.authResponse.accessToken)
        	localStorage['accesstoken'] = JSON.stringify(response.authResponse.accessToken);
        	
        	return self.checkWithDB();
        	 
		  } else if (response.status === 'not_authorized') {
	        //the user is logged in to Facebook, but has not authenticated your app
	
	        console.log('the user is logged in to Facebook, but has not authenticated your app')
	      } 
	      else if(response.status === 'unknown') {
	        // the user isn't logged in to Facebook.
	        console.log('the user isn\'t logged in to Facebook.')
	        FB.login((res) => {
	        	console.log('after login', res)
	        	
	        	if(res.status === 'connected') {
	        		console.log('setting access token', res.authResponse.accessToken)
	        		localStorage['accesstoken'] = JSON.stringify(res.authResponse.accessToken);
	        		return self.checkWithDB();
	        	} else {
	        		console.log('You so bad')
	        	}
	        });
	      } 
		});
  	 
  		// FB.api('/me', 'GET', {fields: 'first_name,last_name,name,id,picture.width(150).height(150)'}, function(data) {
		    //   console.log('profile', data)
		    //   console.log('**************')
		    // });
  	 
	  		//this works 
			    /* jQuery.ajax( {
			          url: host + "/auth/facebook/token",
			          type: 'POST',
			          headers: {
					        access_token: accessToken
					    }
			      })
			      .then((res) => {
			      	 console.log('success', res)
			      },(err) => {
			      	console.log('error', err)
			      });
			      */
			      
			   //this works too
			   /*
			   jQuery.ajax( {
		          url: host + "/auth/facebook/token",
		          type: 'POST',
		          data: JSON.stringify({ access_token : accessToken }),
	    		  contentType: 'application/json'
		      })
		      .then((res) => {
		      	 console.log('success', res)
		      },(err) => {
		      	console.log('error', err)
		      });
			   */
			   
			      //this works too
			   /*
			   jQuery.ajax( {
		          url: host + "/auth/facebook/token?access_token=" + accessToken,
		          type: 'POST',
		      })
		      .then((res) => {
		      	 console.log('success', res)
		      },(err) => {
		      	console.log('error', err)
		      });
			   */
	  	 
	        /*
	      this.httpFetch.fetch('https://material-code84.c9users.io/per')
	      .then(response => response.json())
	      .then(data => {
	         console.log(data);
	      });
	      */
	      
	      //window.location.href = host + '/auth/facebook';
	      
	      //console.log(host);
	      /*
	      this.httpFetch.fetch('https://material-code84.c9users.io/per', {
	          method: 'POST',
	          body: json(job)
	      })
	      .then(response => response.json())
	      .then(data => {
	         console.log(data);
	      }).catch(err => {
	          
	      });
	      */
	    
	  });
	  
	    
    }

  attached(){
  	 if(!window.didPostScriptFinishRunning) {
  		window.didPostScriptFinishRunning = true;
  		functions.postRenderScript()
  	 }
  }

	
}
