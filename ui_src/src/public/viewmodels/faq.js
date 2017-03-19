import {Page} from 'common/page';
import 'bootstrap-select';
import 'autonumeric';
import moment from 'moment';

export class Donate extends Page{
    constructor(...rest) {   
        super(...rest);
    }  
    
    activate(params){
        this.questionList = [];
        return this.loadQuestionsAndOrder();
    }
    
    loadQuestionsAndOrder() {
        let self = this;
        let hideFn = this.showProgress('Loading role...');
        return Promise.all([this.db.getQuestions(), this.db.getQuestionOrder()])
            .then((results) => {
                hideFn();
                let oder = results[1] && results[1].questionOrder? results[1].questionOrder : undefined;
                let qList = results[0] ? results[0] : [];
                
                if(oder){
                    this.questionList = _.sortBy(qList, function(item){
                        
                        let _date = moment(item.dateAdded);
                        item.dateAdded = _date.format('MM') + '/' + _date.format('DD') + '/' + _date.format('YYYY');
                    
                        _date = moment(item.dateUpdated);
                        item.dateUpdated = _date.format('MM') + '/' + _date.format('DD') + '/' + _date.format('YYYY');
                        
                        //item.color = self.getRandomColor();
                        
                      return oder.indexOf(item._id)
                    });
                } else this.questionList = qList;
            }, (err) => {
                hideFn();
                this.showError();
            });
    }
    
    attached(){
        this.onPageRenderComplete();
    }
    
    getViewStrategy() {
        return 'public/views/faq.html';
    }
}