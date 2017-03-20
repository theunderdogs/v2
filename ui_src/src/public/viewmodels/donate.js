import {Page} from 'common/page';
import 'bootstrap-select';
import 'autonumeric';

export class Donate extends Page{
    constructor(...rest) {   
        super(...rest);
    }  
    
    activate(params){
        this.monthlyList = [
                // { val: 'Five', title: 'Five : $5.00 USD - monthly' },
                // { val: 'Ten', title: 'Ten : $10.00 USD - monthly' },
                // { val: 'Fifty', title: 'Fifty : $50.00 USD - monthly' },
                // { val: 'OneHundred', title: 'OneHundred : $100.00 USD - monthly' },
                // { val: 'TwoHundred', title: 'TwoHundred : $200.00 USD - monthly' },
                // { val: 'ThreeHundred', title: 'ThreeHundred : $300.00 USD - monthly' },
                // { val: 'FiveHundred', title: 'FiveHundred : $500.00 USD - monthly' },
                // { val: 'OneThousand', title: 'OneThousand : $1,000.00 USD - monthly' }
                
                { val: 'Five', title: '$5.00 USD - monthly' },
                { val: 'Ten', title: '$10.00 USD - monthly' },
                { val: 'TwentyFive', title: '$25.00 USD - monthly' },
                { val: 'Fifty', title: '$50.00 USD - monthly' },
                { val: 'OneHundred', title: '$100.00 USD - monthly' },
                { val: 'TwoHundred', title: '$200.00 USD - monthly' },
                { val: 'ThreeHundred', title: '$300.00 USD - monthly' },
                { val: 'FiveHundred', title: '$500.00 USD - monthly' },
                { val: 'OneThousand', title: '$1,000.00 USD - monthly' }
            ];
    }
    
    attached(){
        this.onPageRenderComplete();
        
        $(this.txtdonationAmt).autoNumeric('init', { currencySymbol : '$' });
        
        this.taskQueue.queueMicroTask(() => {  
    	    $(this.monthlyCombo).selectpicker();
    	});
    	 
    }
    
    click_monthlyDonate() {
         var formData = new FormData();
         formData.append('cmd','_s-xclick');
         formData.append('hosted_button_id','TZ2MS4HGCTF3W');
         formData.append('currency_code','USD');
         formData.append('on0','Recurring donation amount');
         formData.append('os0','Ten');
         
         return $.ajax({
                url: 'https://www.paypal.com/cgi-bin/webscr', 
			    type: 'POST',
			    data: formData,
			    processData: false,
                contentType: false
			  });
           
    }
    
    getViewStrategy() {
        return 'public/views/donate.html';
    }
}