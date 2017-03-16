import {Page} from 'common/page';
import 'bootstrap-select';
import 'autonumeric';
import 'jquery-ui';
import 'jquery-ui-touch-punch';

export class Faq extends Page{
    constructor(...rest) {   
        super(...rest);
    }  
    
    activate(params){
        
    }
    
    attached(){
        let self = this;
        this.onPageRenderComplete();
        
        $( this.sortable ).sortable({
          revert: true,
          axis: 'y',
          //containment: $(self.questionSection)
          handle: $('.card-header'),
          stop: function( event, ui ) {
              console.log('stopped');
          }
        });
        
        $(this.questionSection).find('ul, li').disableSelection();
    }
    
    getViewStrategy() {
        return 'admin/views/faq/index.html';
    }
}