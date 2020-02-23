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
    }
    Supercharge.prototype.onClick = function (e) { };
    ;
    return Supercharge;
}());
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
