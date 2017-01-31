//import { TaskQueue, inject, Aurelia, noView } from 'aurelia-framework';
import {Page} from 'common/page';
//import 'vendors:bower_components/datatables.net-dt/css/jquery.dataTables.min.css!'
//import 'vendors:bower_components/bootstrap-select/dist/css/bootstrap-select.css!'
import 'datatables'
import 'bootstrap-select'

//@inject(TaskQueue)
export class UserManagement extends Page{
    constructor(...rest) {   
        //this.taskQueue = TaskQueue;
        super(...rest);
    }   
    
    activate(){

    }

    attached(){
        //let self = this;
    	 this.onPageRenderComplete();
    	 
    }
    
    getViewStrategy() {
        return 'admin/views/users/index.html';
    }
}