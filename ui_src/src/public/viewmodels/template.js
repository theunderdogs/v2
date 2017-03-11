import {Page} from 'common/page';
import 'bootstrap-select';
import 'autonumeric';

export class Donate extends Page{
    constructor(...rest) {   
        super(...rest);
    }  
    
    activate(params){
        
    }
    
    attached(){
        this.onPageRenderComplete();
    }
    
    getViewStrategy() {
        return 'public/views/donate.html';
    }
}