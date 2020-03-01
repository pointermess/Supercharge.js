
<h1 align="center">
    Supercharge.js v0.2.1
</h1>

<p align="center">
    <img src="https://github.com/pointermess/Supercharge.js/blob/dev/media/repo_logo.png">
</p>

<span align="center">
    Supercharge.js is a lightweight, low-abstraction JavaScript frontend framework. It simplifies managing the DOM in an object-oriented fashion.
</span>

### Basic usage

```html
<script src="https://cdn.jsdelivr.net/gh/pointermess/Supercharge.js@v0.2.1/src/Supercharge.js"></script>
```

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

Before our application appear on the site, we have to mount it first. Supercharge.js provides ways to mount and unmount our application.

```js
// mounting the application
app.mount(document.body);

// unmounting the application
app.unmount();
```

### Events

#### Using Supercharge class

```js
class Button extends Supercharge {
    onClick(e) {
        alert('Button clicked!');
    }
}
```

#### Using factory

```js
let app = SuperchargeFactory.build({
    ...
    'onClick': function (e) {
        alert('Mouse Coordinates: ' + e.clientX + ' , ' + e.clientY);
    }
    ...
});
```

#### Functions

It is possible to assign functions to factory built objects.

```js
let factory = SuperchargeFactory.build({
    'tag': 'div',
    'body': [
        {
            'tag': 'div',
            'body': 'Hello world from Supercharge.js Factory'
        },
        {
            'tag': 'button',
            'body': 'Click me',
            'onClick': function () {
                this.SayHi('button');
            }
        },
    ],
    'functions': {
        SayHi: function(sender) {
            alert(`Hi from "${sender}"!`);
        }
    }
});
```

### Viewer

#### Setup up the viewer

```js
// setup viewer
// the passed argument has to be a Supercharge object or a html node element
let viewer = new SuperchargeViewer(this);
```

#### Setting the view

```js
viewer.setView(SuperchargeFactory.build({
  tag: 'div',
  body: 'This is a test view.',
}));
```

#### Events and Transitions

```js
// setup events for view transitions
this.viewer.onChangeView = function (continueFn) {
    this.addClass('__DACWTransitionHide');
    setTimeout(function () {
        continueFn();
    }.bind(this), 400);
}.bind(this);

this.viewer.onViewChanged = function () {
    this.removeClass('__DACWTransitionHide');
}.bind(this);
```



### Credits

This framework was heavily inspired by [Igniter](https://github.com/nicoth-in/igniter) from [Nicothin](https://github.com/nicoth-in).

### License

This usage of this framework falls under the [MIT License](https://github.com/pointermess/Supercharge.js/blob/master/LICENSE).
