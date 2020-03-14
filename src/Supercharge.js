var Supercharge = (function () {
    function Supercharge(tag, body) {
        var _this = this;
        if (body === void 0) { body = undefined; }
        var node;
        this.element = document.createElement(tag);
        if (typeof body == "string") {
            node = document.createTextNode(body);
            this.element.appendChild(node);
        }
        else if (typeof body == "object") {
            if (body instanceof Supercharge)
                this.element.appendChild(body.element);
            else if (body instanceof HTMLElement)
                this.element.appendChild(body);
            else if (Array.isArray(body)) {
                for (var bodyIndex in body) {
                    if (body.hasOwnProperty(bodyIndex))
                        body[bodyIndex].mount(this.element);
                }
            }
            else
                console.error('Unknown body type');
        }
        this.element.onclick = function (e) { return _this.onClick(e); };
        this.element.onload = function () { return _this.onLoad(); };
        this.element.onmousemove = function (e) { return _this.onMouseMove(e); };
        this.onCreate();
    }
    Supercharge.prototype.onClick = function (e) { };
    ;
    Supercharge.prototype.onMouseMove = function (e) { };
    ;
    Supercharge.prototype.onLoad = function () { };
    ;
    Supercharge.prototype.onMount = function () { };
    ;
    Supercharge.prototype.onCreate = function () { };
    ;
    Supercharge.prototype.setId = function (id) {
        this.element.id = id;
    };
    Supercharge.prototype.setAttribute = function (attr, value) {
        this.element.setAttribute(attr, value);
    };
    Supercharge.prototype.getAttribute = function (attr) {
        return this.element.getAttribute(attr);
    };
    Supercharge.prototype.addClass = function (className) {
        if (!this.hasClass(className))
            this.element.className += " " + className;
    };
    Supercharge.prototype.removeClass = function (className) {
        if (this.element.classList)
            this.element.classList.remove(className);
        else
            this.element.className = this.element.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    };
    Supercharge.prototype.hasClass = function (className) {
        return !!this.element.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
    };
    Supercharge.prototype.toggleClass = function (className) {
        if (this.hasClass(className))
            this.removeClass(className);
        else
            this.addClass(className);
    };
    Supercharge.prototype.setStyle = function (property, value) {
        this.element.style[property] = value;
    };
    Supercharge.prototype.mount = function (element) {
        this.onMount();
        if (element instanceof HTMLElement)
            element.appendChild(this.element);
        else if (element instanceof Supercharge)
            element.element.appendChild(this.element);
    };
    Supercharge.prototype.unmount = function () {
        if (this.element.parentNode !== null)
            this.element.parentNode.removeChild(this.element);
    };
    Supercharge.prototype.insert = function (array) {
        if (!Array.isArray(array)) {
            console.error('Only arrays can be passed to insert.');
            return;
        }
        for (var item in array) {
            if (array.hasOwnProperty(item)) {
                if (array[item] instanceof Supercharge)
                    array[item].mount(this);
                else if (array[item] instanceof HTMLElement)
                    array[item].element.appendChild(array[item]);
                else
                    console.error('Unknown element type in Supercharge.insert.');
            }
        }
    };
    Supercharge.prototype.find = function (query) {
        return this.element.querySelector(query);
    };
    return Supercharge;
}());
var SuperchargeViewer = (function () {
    function SuperchargeViewer(parent) {
        this.currentView = undefined;
        this.parent = parent;
    }
    SuperchargeViewer.prototype.setView = function (view) {
        var _this = this;
        this.onChangeView(function () {
            if (_this.currentView != undefined) {
                if (_this.currentView instanceof Supercharge)
                    _this.currentView.unmount();
                else if (Array.isArray(_this.currentView)) {
                    for (var index in _this.currentView) {
                        if (_this.currentView.hasOwnProperty(index))
                            _this.currentView[index].unmount();
                    }
                }
            }
            _this.currentView = view;
            if (view instanceof Supercharge)
                view.mount(_this.parent);
            else
                _this.parent.insert(view);
            _this.onViewChanged();
        });
    };
    SuperchargeViewer.prototype.getView = function () {
        return this.currentView;
    };
    SuperchargeViewer.prototype.removeView = function () {
        if (this.currentView instanceof Supercharge) {
            this.currentView.unmount();
            this.currentView = undefined;
        }
    };
    SuperchargeViewer.prototype.onChangeView = function (continueFn) { continueFn(); };
    SuperchargeViewer.prototype.onViewChanged = function () { };
    return SuperchargeViewer;
}());
var SuperchargeFactory = (function () {
    function SuperchargeFactory() {
    }
    SuperchargeFactory.build = function (input, parent) {
        if (parent === void 0) { parent = undefined; }
        var node;
        var parentNode = node;
        if (parent != undefined)
            parentNode = parent;
        if (input instanceof Supercharge) {
            return input;
        }
        else {
            node = new Supercharge(input.tag);
            if (typeof input.body == "string") {
                node.element.appendChild(document.createTextNode(input.body));
            }
            else if (typeof input.body == "object") {
                if (Array.isArray(input.body)) {
                    for (var inputNode in input.body) {
                        if (input.body.hasOwnProperty(inputNode)) {
                            var childNode = this.build(input.body[inputNode], parentNode);
                            node.element.appendChild(childNode.element);
                        }
                    }
                }
                else {
                    var childNode = this.build(input.body, parentNode);
                    node.element.appendChild(childNode.element);
                }
            }
        }
        if (typeof input.id == "string")
            node.setId(input.id);
        if (typeof input.styles == "object") {
            for (var styleName in input.styles) {
                if (input.styles.hasOwnProperty(styleName))
                    node.setStyle(styleName, input.styles[styleName]);
            }
        }
        if (typeof input.classes == "object") {
            for (var className in input.classes) {
                if (input.classes.hasOwnProperty(className))
                    node.addClass(input.classes[className]);
            }
        }
        if (typeof input.attributes == "object") {
            for (var attributeName in input.attributes) {
                if (input.attributes.hasOwnProperty(attributeName))
                    node.setAttribute(attributeName, input.attributes[attributeName]);
            }
        }
        if (typeof input.onClick == "function")
            node.onClick = input.onClick.bind(parentNode);
        if (typeof input.onMount == "function")
            node.onMount = input.onMount.bind(parentNode);
        if (typeof input.onCreate == "function")
            node.onMount = input.onCreate.bind(node);
        for (var inputFunction in input.functions) {
            if (input.functions.hasOwnProperty(inputFunction)) {
                parentNode[inputFunction] = input.functions[inputFunction];
                console.log('added to root: ' + inputFunction);
            }
        }
        for (var inputFunction in input.owned) {
            if (input.owned.hasOwnProperty(inputFunction)) {
                parentNode[inputFunction] = input.owned[inputFunction].bind(node);
            }
        }
        return node;
    };
    SuperchargeFactory.buildArray = function (input, parentNode) {
        if (parentNode === void 0) { parentNode = undefined; }
        var result = [];
        for (var inputNode in input) {
            result.push(this.build(input[inputNode], parentNode));
        }
        return result;
    };
    return SuperchargeFactory;
}());
//# sourceMappingURL=supercharge.js.map
