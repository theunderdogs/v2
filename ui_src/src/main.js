import $ from 'jquery';
import 'bootstrap';
import routes from 'common/routes.json!';
import {services} from 'common/services';
window.$ = $;

export function configure(aurelia) {
  let db = aurelia.container.get(services);

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

  if (window.location.hash) {
    console.log('there is hash', window.location.hash)
  } else {
    console.log('there is no hash')
  }

  let root, rootP = Promise.resolve();// = 'app';

  if(localStorage['accesstoken']) {
    console.log('root: admin/app')
    
    //If logged in user refreshes page then all window variables will be lost and hence we will have to repopulate them
    if(!window.user) {
      console.log('window.user found')
      rootP = db.authenticate()
      .then((res) => {
		      	 console.log('authenticating in main', res);
		       window.permissions = res.permissions ? JSON.parse(res.permissions) : null;
			     window.user = res.user
			     window.profileName = res.profileName;
			     window.profilePic = res.profilePic;
			     root = 'admin/app'
			     return 'admin/app'
			}, (err) => {
			  localStorage['accesstoken'] = null
			  console.log('authentication failed', err)
			  root = 'public/publicapp'
			})
    }
  } else {
    console.log('root: publicapp')
    root = 'public/publicapp'
  }

  rootP.then(() => {
    aurelia.start(root).then(() => {
      console.log('url', window.location.href)
      console.log('hash', window.location.hash)
      aurelia.setRoot(root)
    });
  }, () => {
    aurelia.start(root).then(() => {
      console.log('it failed')
      aurelia.setRoot(root)
    });
  });
}
