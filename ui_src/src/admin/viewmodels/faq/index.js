import {Page} from 'common/page';
import 'bootstrap-select';
import 'autonumeric';
import 'jquery-ui';
import 'jquery-ui-touch-punch';
import _ from 'lodash';
import moment from 'moment'
import {BootstrapFormRenderer} from 'admin/viewmodels/users/createusererror';
import swal from 'sweet-alert'

export class Faq extends Page{
    constructor(...rest) {   
        super(...rest);
        this.controller = this.controllerFactory.createForCurrentScope();
        this.controller.addRenderer(new BootstrapFormRenderer());
    }  
    
    activate(params){
        this.newEntry = {
            question: undefined, 
            answer: undefined,
            _id: undefined
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
                        
                        item.color = self.fn.getRandomColor();;
                        
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
        this.initDraggable();
    }
    
    initDraggable(){
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
                
                // if(this.newEntry._id == undefined){
                //     delete this.newEntry['_id']
                // }
                
                return this.db.saveQuestion(this.newEntry._id == undefined ? {
                    question: this.newEntry.question,
                    answer: this.newEntry.answer
                } : this.newEntry)
                .then((res) => {
                    console.log('success', res);
                    this.newEntry._id = undefined;
                    this.newEntry.question = undefined;
                    this.newEntry.answer = undefined;
                    hideFn();
                    this.showSuccess('Question saved successfully');
                    
                    $( this.newQuestionDOM).removeClass('fg-toggled');
                    $(this.newAnswerDOM).removeClass('fg-toggled');
        
                    return this.loadQuestionsAndOrder()
                        .then(() => {
                            this.initDraggable();
                        });
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
    
    click_edit(id) {
        let hideFn = this.showProgress('Loading question...');
        
        return this.db.getQuestionById(id)
            .then((q) => {
               this.newEntry.question = q.question;
               this.newEntry.answer = q.answer;
               this.newEntry._id = q._id;
            
               $( this.newQuestionDOM).addClass('fg-toggled');
               $(this.newAnswerDOM).addClass('fg-toggled');
               $('html, body').animate({ scrollTop: 0 }, 'slow');
               
               hideFn();
               return false; 
            }, (error) => {
                hideFn();
                this.showError();
            });
    }
    
    click_delete(id){
        swal.init();
        
        swal({   
            title: "Confirm",   
            text: 'Are you sure you want to delete this question',   
            type: "warning",   
            showCancelButton: true,   
            confirmButtonText: "Yes",
        }).then((result) => {
            this.click_cancel();
            let hideFn = this.showProgress('Deleting..');
        
            return this.db.deleteQuestion({id})
            .then((result) => {
                hideFn();
                this.showSuccess();
                return this.loadQuestionsAndOrder()
                        .then(() => {
                            this.initDraggable();
                        });
            })
            .catch((err) => {
               this.showError(err); 
            }); 
        })
        .catch((result) => {
            console.log('cancelled ', result);
        });
    }
    
    click_cancel(){
        this.newEntry.question = undefined;
        this.newEntry.answer = undefined;
        this.newEntry._id = undefined;
        
        $( this.newQuestionDOM).removeClass('fg-toggled');
        $(this.newAnswerDOM).removeClass('fg-toggled');
    }
    
    getViewStrategy() {
        return 'admin/views/faq/index.html';
    }
}