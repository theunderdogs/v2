import {Page} from 'common/page';
import 'bootstrap-select';
import 'autonumeric';

export class AboutUs extends Page{
    constructor(...rest) {   
        super(...rest);
    }  
    
    activate(params){
        this.content = '';
        
        return this.db.getActiveAboutToDisplay()
        .then((about) => {
            if(about)
                this.content = about.content;    
        });
    }
    
    attached(){
        this.onPageRenderComplete();
        
        $(this.dynamicContent).html(this.content);
    }
    
    getViewStrategy() {
        return 'public/views/about.html';
    }
}