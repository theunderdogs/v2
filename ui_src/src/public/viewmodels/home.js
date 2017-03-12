import {Page} from 'common/page';
import 'bootstrap-select';
import 'autonumeric';

export class Home extends Page{
    constructor(...rest) {   
        super(...rest);
    }  
    
    activate(params){
        this.contacttemplate = '';
        
        this.calendarModel = {
          key: 'AIzaSyBhCHsSiB-YlfHtWp77HW2NvDUK83GRjlI',
          email: 'theunderdogsrescue@gmail.com'
        };
        
        return Promise.all([this.db.getActiveContactTemplateToDisplay()])
            .then((results) => {
                if(results[0] && results[0].content) 
                    this.contacttemplate = results[0].content;
            })
    }
    
    attached(){
        this.onPageRenderComplete();
        
        $(this.txtdonationAmt).autoNumeric('init', { currencySymbol : '$' });
        $(this.contactContainer).html(this.contacttemplate);
    }
    
    getViewStrategy() {
        return 'public/views/home.html';
    }
}