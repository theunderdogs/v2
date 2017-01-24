//import 'jquery-mCustomScrollbar';
//import 'vendors:bower_components/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.min.css!';
//import Waves from 'waves';
//import { TaskQueue, inject, Aurelia, noView } from 'aurelia-framework';
import {Page} from 'common/page';

//@inject(TaskQueue)
export class Addpet extends Page{
	constructor(...rest) {   
        //this.taskQueue = TaskQueue;
        super(...rest);
    }   

    attached(){
    	this.onPageRenderComplete();
    }

    getViewStrategy() {
        return 'admin/views/addpet.html';
    }
}