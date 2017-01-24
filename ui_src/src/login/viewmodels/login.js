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

    getViewStrategy() {
        return 'login/views/login.html';
    }
}