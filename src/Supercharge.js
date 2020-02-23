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
            else
                this.element.appendChild(body);
        }
        this.element.onclick = function (e) { return _this.onClick(e); };
        this.element.onload = function () { return _this.onLoad(); };
        this.onMount();
    }
    Supercharge.prototype.mount = function (element) {
        element.appendChild(this.element);
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
    return Supercharge;
}());
var SuperchargeBindable = (function (_super) {
    __extends(SuperchargeBindable, _super);
    function SuperchargeBindable(tag, body) {
        var _this = _super.call(this, tag, body) || this;
        _this.binding = false;
        _this.innerHtml = '';
        _this.bindings = {};
        if (typeof body != "string") {
            console.error('Bindable supercharge class can only have a string body.');
            return _this;
        }
        _this.innerHtml = _this.element.innerHTML;
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
            console.log(this.bindings[binding].val);
            def = def.replace('{' + binding + '}', this.bindings[binding].val);
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
    SuperchargeFactory.build = function (input) {
        var node;
        if (input instanceof Supercharge) {
            return input;
        }
        else {
            if (typeof input.body == "string") {
                node = new Supercharge(input.tag, input.body);
                if (typeof input.onClick == "function")
                    node.onClick = input.onClick.bind(node);
            }
            else if (typeof input.body == "object") {
                node = new Supercharge(input.tag);
                for (var inputNode in input.body) {
                    if (input.body.hasOwnProperty(inputNode)) {
                        var childNode = this.build(input.body[inputNode]);
                        node.element.appendChild(childNode.element);
                    }
                }
            }
        }
        return node;
    };
    return SuperchargeFactory;
}());
//# sourceMappingURL=supercharge.js.map
