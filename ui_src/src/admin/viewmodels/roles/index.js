import { TaskQueue, inject, Aurelia, noView } from 'aurelia-framework';
import {Page} from 'common/page';
import 'vendors:bower_components/datatables.net-dt/css/jquery.dataTables.min.css!'
import 'datatables'

//@inject(TaskQueue)
export class RoleManagement extends Page{
    constructor(...rest) {   
        //this.taskQueue = TaskQueue;
        super(...rest);
    }   

    attached(){
    	 this.onPageRenderComplete();
    }
    
    getViewStrategy() {
        return 'admin/views/roles/index.html';
    }
}