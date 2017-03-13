import {Page} from 'common/page';
import 'bootstrap-select';
import 'autonumeric';
import 'jquery-ui';

export class Faq extends Page{
    constructor(...rest) {   
        super(...rest);
    }  
    
    activate(params){
        
    }
    
    attached(){
        this.onPageRenderComplete();
        
        $( this.sortable ).sortable({
          revert: true
        });
        
        $(this.questionSection).find('ul, li').disableSelection();
    }
    
    getViewStrategy() {
        return 'admin/views/faq/index.html';
    }
}