//import { TaskQueue, inject, Aurelia, noView } from 'aurelia-framework';
import {Page} from 'common/page';
//import 'vendors:bower_components/datatables.net-dt/css/jquery.dataTables.min.css!'
//import 'vendors:bower_components/bootstrap-select/dist/css/bootstrap-select.css!'
import 'datatables'
import 'bootstrap-select'
//import {json} from 'aurelia-fetch-client';

//@inject(TaskQueue)
export class RoleManagement extends Page{
    constructor(...rest) {   
        //this.taskQueue = TaskQueue;
        super(...rest);
    }   
    
    activate(){
        this.roleList = [];
        
        $.get( host + '/getroles', function( data ) {
          console.log( data );
          //alert( "Load was performed." );
        });
        
        // return this.http.fetch(host + '/getroles')
        // .then(response => response.json())
        // .then(data => {
        //      console.log(data);
        // });
    }

    attached(){
        //let self = this;
    	 this.onPageRenderComplete();
    	 
    	 this.taskQueue.queueMicroTask(() => {       
        	$(this.rolesCombo).selectpicker();
    	 });
    }
    
    getViewStrategy() {
        return 'admin/views/roles/index.html';
    }
}