import 'fullcalendar';
import 'gcal';
import moment from 'moment';

export class Calendar {
    
    constructor(){
        
    }
    
    activate(params){
        this.params = params;
        //console.log(params);
       // this.name = 'kiran';
    }
    
    attached(){
        let self = this;
        var mYear = moment().format('YYYY');
        var mDay = moment().format('dddd, MMM D');
        
        $(this.calendar).find('#cw-body').fullCalendar({
                contentHeight: 'auto',
                theme: false,
                buttonIcons: {
                    prev: ' zmdi zmdi-chevron-left',
                    next: ' zmdi zmdi-chevron-right'
                },
                header: {
                    right: 'next',
                    center: 'title, ',
                    left: 'prev'
                },
                defaultDate: mYear + '-' + moment().format('MM') + '-' + moment().format('DD'),// '2016-08-12',
                editable: false,
                googleCalendarApiKey: self.params.key,
                events: {
                    googleCalendarId: self.params.email,
                    className: 'bgm-green' // an option!
                }
        });
        
        $(this.calendar).find('.cwh-year').html(mYear);
        $(this.calendar).find('.cwh-day').html(mDay);
    }
    
    getViewStrategy() {
        return 'admin/common/calendarWidget/index.html';
    }
}