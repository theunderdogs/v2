export class uiHelper {
    
    static loadPromise() {
        if(arguments.length == 0 || arguments.length > 2){
            console.log('contructor needs arguments for promise and message');
        }
        
        let promise = arguments[0];
        let message = 'Please wait...';
        
        if(arguments.length == 2) {
            message = arguments[1];
        }
        
        let $progressDom = $('<div class="page-loader">' +
                    '<div class="preloader pls-blue">' +
                        '<svg class="pl-circular" viewBox="25 25 50 50">' +
                            '<circle class="plc-path" cx="50" cy="50" r="20" />' +
                        '</svg>' +
            
                        '<p>' + message + '</p>' +
                    '</div>' +
                '</div>');
        
        $progressDom.appendTo('footer');
        
        let hideFn = () => {
            $progressDom.remove();
        };
        
        promise
        .then(() => {
           hideFn();
        },() => {
           hideFn(); 
        });
        
        return hideFn;
    }
}