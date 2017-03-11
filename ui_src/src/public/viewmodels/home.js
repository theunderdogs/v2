import {Page} from 'common/page';
import 'bootstrap-select';
import 'autonumeric';

export class Home extends Page{
    constructor(...rest) {   
        super(...rest);
    }  
    
    activate(params){
        this.calendarModel = {
          key: 'AIzaSyBhCHsSiB-YlfHtWp77HW2NvDUK83GRjlI',
          email: 'theunderdogsrescue@gmail.com'
        };
    }
    
    attached(){
        this.onPageRenderComplete();
        
        $(this.txtdonationAmt).autoNumeric('init', { currencySymbol : '$' });
    }
    
    getViewStrategy() {
        return 'public/views/home.html';
    }
}