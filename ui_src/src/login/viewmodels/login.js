//import 'jquery-mCustomScrollbar';
//import Waves from 'waves';
//import { TaskQueue, inject, Aurelia, noView } from 'aurelia-framework';
import {Page} from 'common/page';

//@inject(TaskQueue)
export class Login extends Page{
	constructor(...rest) {   
        //this.taskQueue = TaskQueue;
        super(...rest);
    }   

    attached(){
    	 this.onPageRenderComplete();
    }
    
    click_login(){
      this.httpFetch.fetch('https://material-code84.c9users.io/per')
      .then(response => response.json())
      .then(data => {
         console.log(data);
      });
    }

    getViewStrategy() {
        return 'login/views/login.html';
    }
}