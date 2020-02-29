var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
            else if (body instanceof Node)
                this.element.appendChild(body);
            else {
                for (var bodyIndex in body) {
                    if (body.hasOwnProperty(bodyIndex))
                        body[bodyIndex].mount(this.element);
                }
            }
        }
        this.element.onclick = function (e) { return _this.onClick(e); };
        this.element.onload = function () { return _this.onLoad(); };
        this.onCreate();
    }
    Supercharge.prototype.mount = function (element) {
        this.onMount();
        if (element instanceof Node)
            element.appendChild(this.element);
        else if (element instanceof Supercharge)
            element.element.appendChild(this.element);
    };
    Supercharge.prototype.unmount = function () {
        this.element.parentNode.removeChild(this.element);
    };
    Supercharge.prototype.onClick = function (e) { };
    ;
    Supercharge.prototype.onLoad = function () { };
    ;
    Supercharge.prototype.onMount = function () { };
    ;
    Supercharge.prototype.onCreate = function () { };
    ;
    return Supercharge;
}());
var SuperchargeBindable = (function (_super) {
    __extends(SuperchargeBindable, _super);
    function SuperchargeBindable(tag, body) {
        var _this = _super.call(this, tag, body) || this;
        _this.binding = false;
        _this.innerHtml = '';
        _this.bindings = {};
        _this.innerHtml = _this.element.innerHTML;
        _this.onCreate();
        return _this;
    }
    SuperchargeBindable.prototype.bind = function (key, defaultValue) {
        if (defaultValue === void 0) { defaultValue = ''; }
        this.bindings[key] = {
            'val': defaultValue
        };
        this.refreshBindings();
    };
    SuperchargeBindable.prototype.refreshBindings = function () {
        var def = this.innerHtml;
        for (var binding in this.bindings) {
            var value = this.bindings[binding].val;
            def = def.replace('{' + binding + '}', value);
        }
        this.element.innerHTML = def;
    };
    SuperchargeBindable.prototype.startBinding = function () { this.binding = true; };
    SuperchargeBindable.prototype.stopBinding = function () { this.binding = false; this.refreshBindings(); };
    SuperchargeBindable.prototype.setBinding = function (key, value) {
        if (typeof this.bindings[key] == "object") {
            this.bindings[key].val = value;
            if (!this.binding)
                this.refreshBindings();
        }
    };
    return SuperchargeBindable;
}(Supercharge));
var SuperchargeFactory = (function () {
    function SuperchargeFactory() {
    }
    SuperchargeFactory.build = function (input, parent) {
        if (parent === void 0) { parent = undefined; }
        var node;
        if (input instanceof Supercharge) {
            return input;
        }
        else {
            if (typeof input.body == "string") {
                if (typeof input.bindings != "undefined") {
                    node = new SuperchargeBindable(input.tag, input.body);
                    for (var binding in input.bindings) {
                        if (input.bindings.hasOwnProperty(binding)) {
                            node.bind(binding, input.bindings[binding]);
                        }
                    }
                }
                else
                    node = new Supercharge(input.tag, input.body);
            }
            else if (typeof input.body == "object") {
                node = new Supercharge(input.tag);
                for (var inputNode in input.body) {
                    if (input.body.hasOwnProperty(inputNode)) {
                        var childNode = this.build(input.body[inputNode], node);
                        node.element.appendChild(childNode.element);
                    }
                }
            }
        }
        var parentNode = node;
        if (parent != undefined)
            parentNode = parent;
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
        return node;
    };
    SuperchargeFactory.buildArray = function (input) {
        var result = [];
        for (var inputNode in input) {
            result.push(this.build(input[inputNode]));
        }
        return result;
    };
    return SuperchargeFactory;
}());
//# sourceMappingURL=supercharge.js.map