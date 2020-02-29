/**
 * Supercharge class
 *
 * Can be used as base to derive classes from or can be used to directly
 * work on Supercharge instances
 */
class Supercharge {
    public element;

    constructor(tag: string, body: any = undefined) {
        // create element
        let node;

        // append body
        this.element = document.createElement(tag);


        if (typeof body == "string")
        {
            node = document.createTextNode(body);
            this.element.appendChild(node);
        }
        else if (typeof body == "object")
        {
            if (body instanceof Supercharge)
                this.element.appendChild(body.element);
            else if (body instanceof Node)
                this.element.appendChild(body);
            else
            {
                for (let bodyIndex in body)
                {
                    if (body.hasOwnProperty(bodyIndex))
                        body[bodyIndex].mount(this.element);
                }
            }
        }

        this.element.onclick = (e) => this.onClick(e);
        this.element.onload = () => this.onLoad();

        this.onCreate();
    }

    public mount(element) {
        this.onMount();
        if (element instanceof Node)
            element.appendChild(this.element);
        else if (element instanceof Supercharge)
            element.element.appendChild(this.element);
    }

    public unmount() {
        this.element.parentNode.removeChild(this.element);
    }


    /*
     * Events
     */
    public onClick(e) {};
    public onLoad() {};
    public onMount() {};
    public onCreate() {};
}

/**
 * SuperchargeBindable class
 *
 * Supercharge with bindable components. Use it with caution as it can cause issues when
 * having dynamic elements as children.
 */
class SuperchargeBindable extends Supercharge
{
    protected binding = false;
    private innerHtml = '';
    public bindings = {};

    constructor(tag: string, body: string) {
        super(tag, body);

        this.innerHtml = this.element.innerHTML;
        this.onCreate();
    }

    public bind(key, defaultValue = '')
    {
        this.bindings[key] = {
            'val': defaultValue
        };
        this.refreshBindings();
    }

    public refreshBindings() {
        let def = this.innerHtml;
        for (let binding in this.bindings)
        {
            let value : any = this.bindings[binding].val;


            def = def.replace('{' + binding + '}', value );
        }
        this.element.innerHTML = def;
    }

    public startBinding() { this.binding = true; }
    public stopBinding() { this.binding = false; this.refreshBindings(); }

    public setBinding(key, value)
    {
        if (typeof this.bindings[key] == "object")
        {
            this.bindings[key].val = value;

            if (!this.binding)
                this.refreshBindings();
        }
    }
}

/**
 * factory class to build trees of Supercharge objects
 */
class SuperchargeFactory
{
    /**
     * Builds a tree of Supercharge objects
     * @param input object
     * @return Built instance of a Supercharge object
     */
    public static build(input, parent = undefined)
    {
        let node;


        if (input instanceof Supercharge)
        {
            return input;
        }
        else
        {
            // TODO: finish build process
            if (typeof input.body == "string")
            {
                if (typeof input.bindings != "undefined")
                {
                    node = new SuperchargeBindable(input.tag, input.body);

                    for (let binding in input.bindings)
                    {
                        if (input.bindings.hasOwnProperty(binding))
                        {
                            node.bind(binding, input.bindings[binding]);
                        }
                    }
                }
                else
                    node = new Supercharge(input.tag, input.body);
            }
            else if (typeof input.body == "object")
            {
                node = new Supercharge(input.tag);

                for (let inputNode in input.body) {
                    if (input.body.hasOwnProperty(inputNode))
                    {
                        let childNode = this.build(input.body[inputNode], node);
                        node.element.appendChild(childNode.element);
                    }
                }
            }
        }

        // experimental feature
        let parentNode = node;
        if (parent != undefined) parentNode = parent;

        if (typeof input.onClick == "function") node.onClick = input.onClick.bind(parentNode);
        if (typeof input.onMount == "function") node.onMount = input.onMount.bind(parentNode);
        if (typeof input.onCreate == "function") node.onMount = input.onCreate.bind(node);

        // functions
        for (let inputFunction in input.functions) {
            if (input.functions.hasOwnProperty(inputFunction))
            {
                parentNode[inputFunction] = input.functions[inputFunction];
                console.log('added to root: ' + inputFunction);
            }
        }


        return node;
    }


    public static buildArray(input) : any
    {
        let result = [];


        for (let inputNode in input) {
            result.push(this.build(input[inputNode]));
        }

        return result;
    }
}
