import $ from 'jquery';
import 'bootstrap';
window.$ = $;

export function configure(aurelia) {
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

  let root = 'app';

  switch (window.entryPage) {
    case 'login':
        root = "login/app";
        break;
    case 'admin':
        root = "admin/app";
        break;
  }	

  aurelia.start().then(() => aurelia.setRoot(root));
}
