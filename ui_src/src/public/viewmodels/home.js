import {Page} from 'common/page';
import 'bootstrap-select'

export class CreateUser extends Page{
    constructor(...rest) {   
        super(...rest);
    }  
    
    activate(params){
    }
    
    attached(){
        this.onPageRenderComplete();
    }
    
    getViewStrategy() {
        return 'public/views/home.html';
    }
}