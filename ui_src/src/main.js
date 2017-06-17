import $ from 'jquery';
import 'bootstrap';
import routes from 'common/routes.json!';
import {services} from 'common/services';
window.$ = $;

export function configure(aurelia) {
  let db = aurelia.container.get(services);
  window._aurelia = aurelia;
  
  //aurelia.use.instance('apiRoot', 'https://material-code84.c9users.io/');
  aurelia.use
    .standardConfiguration()
    .developmentLogging()
    .plugin('aurelia-validation');

  //Uncomment the line below to enable animation.
  //aurelia.use.plugin('aurelia-animator-css');
  //if the css animator is enabled, add swap-order="after" to all router-view elements

  //Anyone wanting to use HTMLImports to load views, will need to install the following plugin.
  //aurelia.use.plugin('aurelia-html-import-template-loader')

  //console.log('routes', routes)

  let root = 'public/publicapp', rootP = Promise.resolve();// = 'app';
  
  // if (window.location.hash) {
  //   console.log('routes', routes)
  //   let _hash = window.location.hash
  //   let lookupFor = _hash.replace('#', '')
    
  //   console.log('lookupFor', lookupFor)
  //   console.log('there is hash', window.location.hash)
    
  //   if(localStorage['accesstoken']) {
  //     //if user is logged in  
      
  //     routes.protected.forEach((r) => {
  //       if(_.find(r.routes, function(p) { return p === lookupFor; })) { 
  //         root = 'admin/app';
  //         return true
  //       }
  //     })
  //   } 
  // } else {
  //   console.log('there is no hash')
    
  //   //if user is logged in
  //   root = localStorage['accesstoken'] ? 'admin/app' : 'public/publicapp'
  // }

  if(localStorage['accesstoken']) {
    console.log('root: admin/app')
    
    //If logged in user refreshes page then all window variables will be lost and hence we will have to repopulate them
    if(!window.user) {
      console.log('window.user not found')
      rootP = db.authenticate()
      .then((res) => {
		       console.log('authenticating in main', res);
		       window.permissions = res.permissions ? JSON.parse(res.permissions) : null;
			     window.user = res.user
			     window.profileName = res.profileName;
			     window.profilePic = res.profilePic;
			     root = 'admin/app'
			     return root
			}, (err) => {
			  localStorage.removeItem('accesstoken')
			  console.log('authentication failed', err)
			  //root = 'public/publicapp'
			})
    }
  } else {
    localStorage.removeItem('accesstoken')
    console.log('root: publicapp')
    //root = 'public/publicapp'
  }

  rootP
  .then(() => {
    aurelia.start(root).then(() => {
      aurelia.setRoot(root)
    });
  }, () => {
    aurelia.start(root).then(() => {
      console.log('it failed')
      aurelia.setRoot(root)
    });
  });

  
}
