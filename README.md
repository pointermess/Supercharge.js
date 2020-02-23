# Supercharge.js

Supercharge.js is a lightweight, low-abstraction JavaScript frontend framework in testing stage. It simplifies managing the DOM in an object-oriented fashion.

### Basic usage

```js
class Button extends Supercharge
{
    private value;

    constructor(value) {
        super('button', value.toString());
        this.value = value;
    }

    public onClick(e): void {
        console.debug(`Button with value "${this.value}" pressed.`);
    }
}
```

### Hello World

Supercharge comes with a factory class which helps building the structure of an application. We can build a basic Hello World application using the `SuperchargeFactory.build` function and passing an object.

```js
let app = SuperchargeFactory.build({
    'tag': 'div',
    'body': 'Hello World from Supercharge.js!',
    'onClick': function (e) {
        alert('Mouse Coordinates: ' + e.clientX + ' , ' + e.clientY);
    }
});
```

### Mounting our application

```js
document.body.appendChild(app.element);
```

### Events

```js
let app = SuperchargeFactory.build({
    ...
    'onClick': function (e) {
        alert('Mouse Coordinates: ' + e.clientX + ' , ' + e.clientY);
    }
    ...
});
```

### Bindings

Supercharge.js supports very simple bindings. They only work on elements where the body consists of only a string and no other elements.

```js
class Clock extends SuperchargeBindable
{
    constructor() {
        super('div', 'The current time is {time} and the date is {date}.');

        // binds the variables
        this.bind('time');
        this.bind('date');
        
        // set the time and date every second
        setInterval(() => {
            var date = new Date();
            this.setBinding('time', date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds());
            this.setBinding('date', date.getDate() + '. ' + date.getMonth() + '. ' + date.getFullYear());
        }, 1000);
    }
}
```


```js
class Button extends SuperchargeBindable
{
    public value = 0;

    constructor() {
        super('button', 'My current value is "{value}"');

        this.bind('value');
        this.setBinding('value', this.value);
    }

    public onClick(e)
    {
        this.setBinding('value', ++this.value);
    }
}
```

### Credits

This framework was heavily inspired by [Igniter](https://github.com/nicoth-in/igniter) from [Nicothin](https://github.com/nicoth-in).

### License

This usage of this framework falls under the [MIT License](https://github.com/pointermess/Supercharge.js/blob/master/LICENSE).
