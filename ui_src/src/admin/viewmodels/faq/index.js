import {Page} from 'common/page';
import 'bootstrap-select';
import 'autonumeric';
import 'jquery-ui';
import 'jquery-ui-touch-punch';
import _ from 'lodash';
import {BootstrapFormRenderer} from 'admin/viewmodels/users/createusererror';

export class Faq extends Page{
    constructor(...rest) {   
        super(...rest);
        this.controller = this.controllerFactory.createForCurrentScope();
        this.controller.addRenderer(new BootstrapFormRenderer());
    }  
    
    activate(params){
        this.newEntry = {
            question: undefined, 
            answer: undefined
        }
        
        this.questionList = [];
        
        this.validationRules
          .ensure(a => a.question)
            .required()
            .withMessage('Please enter question')
          .ensure(a => a.answer)
            .required()
            .withMessage('Please enter answer for the question')
          .on(this.newEntry);
          
          return this.loadQuestionsAndOrder();
    }
    
    loadQuestionsAndOrder() {
        let hideFn = this.showProgress('Loading role...');
        return Promise.all([this.db.getQuestions(), this.db.getQuestionOrder()])
            .then((results) => {
                hideFn();
                let oder = results[1] && results[1].questionOrder? results[1].questionOrder : undefined;
                let qList = results[0] ? results[0] : [];
                
                if(oder){
                    this.questionList = _.sortBy(qList, function(item){
                      return oder.indexOf(item._id)
                    });
                } else this.questionList = qList;
            }, (err) => {
                hideFn();
                this.showError();
            });
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
              let oder = [];
              console.log('stopped');
              $( self.sortable ).find('.card').each(function() {
                  oder.push($(this).attr('data-id'));
              });  
            
             if(oder.length == 0) {
                 return;
             }
            
             let hideFn = self.showProgress('Saving order...');
              
             return self.db.saveQuestionOrder(oder)
                    .then(() => {
                        hideFn();
                        self.showSuccess('Order saved successfully');
                    }, (err) => {
                        hideFn();
                        self.showError();
                    });
          }
        });
        
        $(this.questionSection).find('ul, li').disableSelection();
    }
    
    click_add(){
        let hideFn = this.showProgress('Loading role...');
        
        return this.controller.validate()
        .then(result => {
            if(result.valid) {
                
                return this.db.saveQuestion(this.newEntry)
                .then((res) => {
                    console.log('success', res);
                    this.newEntry.question = undefined;
                    this.newEntry.answer = undefined;
                    hideFn();
                    this.showSuccess('Question saved successfully');
                    return this.loadQuestionsAndOrder();
                },(err) => {
                    hideFn();
                    console.log(err);
                    this.showError();
                });        
            } else {
                hideFn();
            }
        });
    }
    
    getViewStrategy() {
        return 'admin/views/faq/index.html';
    }
}