import { TaskQueue, inject, Aurelia, noView } from 'aurelia-framework';
import {functions} from 'common/functions';
import routes from 'common/routes.json!';
import AuthorizeStep from 'common/AuthorizeStep';
import PreActivateStep from 'common/PreActivateStep'; 
import PreRenderStep from 'common/PreRenderStep'; 
import PostRenderStep from 'common/PostRenderStep'; 

@inject(TaskQueue, Aurelia)
export class App {
  constructor(TaskQueue, aurelia) {   
    
  }   
  
  configureRouter(config, router) {
  
  }

 
  attached(){
  
     
  }
}
