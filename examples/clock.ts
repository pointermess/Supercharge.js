/* Supercharge.js Clock Example
 *
 * This example is outdated as data binding is not supported in the current main branchs
 * of supercharge.js.
 *
 * To use this example, version 0.1-alpha of Supercharge.js has to be used.
 *
 * This example shows a simple clock displaying the time and date.
 * It uses bindings to display the time and an interval to update the values.
 */
class Clock extends SuperchargeBindable
{
    constructor() {
        super('div', 'The current time is {time} and the date is {date}.');

        // binds the variables and initialize with default values
        this.bind('time', this.getDate().time);
        this.bind('date', this.getDate().date);

        // set the time and date every second
        setInterval(() => {
            this.setBinding('time', this.getDate().time);
            this.setBinding('date', this.getDate().date);
        }, 1000);
    }

    getDate() {
        var date = new Date();
        return {
            time: date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds(),
            date: date.getDate() + '. ' + date.getMonth() + '. ' + date.getFullYear()
        }
    }
}

window.onload = function(){
    new Clock().mount(document.body);
};
