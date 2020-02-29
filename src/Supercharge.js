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
    Supercharge.prototype.setId = function (id) {
        this.element.id = id;
    };
    Supercharge.prototype.setAttribute = function (attr, value) {
    };
    Supercharge.prototype.addClass = function (attr, value) {
    };
    Supercharge.prototype.removeClass = function (attr, value) {
    };
    Supercharge.prototype.hasClass = function (attr, value) {
    };
    Supercharge.prototype.toggleClass = function (attr, value) {
    };
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
    Supercharge.prototype.insert = function (array) {
        for (var item in array) {
            if (array.hasOwnProperty(item)) {
                array[item].mount(this);
                console.log(array[item]);
            }
        }
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
            node = new Supercharge(input.tag);
            if (typeof input.body == "string") {
                node.element.appendChild(document.createTextNode(input.body));
            }
            else if (typeof input.body == "object") {
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