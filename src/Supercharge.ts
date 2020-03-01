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

        // bind events
        this.element.onclick = (e) => this.onClick(e);
        this.element.onload = () => this.onLoad();

        this.onCreate();
    }

    public setId(id) {
        this.element.id = id;
    }

    public setAttribute(attr, value) {
        this.element.setAttribute(attr, value);
    }

    public getAttribute(attr) {
        this.element.getAttribute(attr);
    }

    public addClass(className) {
        if (!this.hasClass(className))
            this.element.className += " " + className;
    }

    public removeClass(className) {
        if (this.element.classList)
            this.element.classList.remove(className);
        else
            this.element.className = this.element.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');

    }

    public hasClass(className) : boolean {
        return !!this.element.className.match(new RegExp('(\\s|^)'+className+'(\\s|$)'));
    }

    public toggleClass(className) {
        if (this.hasClass(className))
            this.removeClass(className)
        else
            this.addClass(className)
    }

    public setStyle(property, value) {
        this.element.style[property] = value;
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

    public insert(array)
    {
        for (let item in array)
        {
            if (array.hasOwnProperty(item))
            {
                array[item].mount(this);
            }
        }
    }


    /*
     * Events
     */
    public onClick(e) {};
    public onLoad() {};
    public onMount() {};
    public onCreate() {};
}

class SuperchargeViewer {
    private parent;
    private currentView = undefined;

    constructor(parent) {
        this.parent = parent;
    }

    public setView(view) {
        this.onChangeView(() => {
            if (this.currentView != undefined)
                this.currentView.unmount();

            this.currentView = view;
            view.mount(this.parent);
            this.onViewChanged();
        })
    }

    public removeView() {
        if (this.currentView != undefined)
        {
            this.currentView.unmount();
            this.currentView = undefined;
        }
    }

    public onChangeView(continueFn) { continueFn() }

    public onViewChanged() {}
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


        // experimental feature
        let parentNode = node;
        if (parent != undefined) parentNode = parent;

        if (input instanceof Supercharge)
        {
            return input;
        }
        else
        {
            node = new Supercharge(input.tag);

            // TODO: finish build process
            if (typeof input.body == "string")
            {
                node.element.appendChild(document.createTextNode(input.body));
            }
            else if (typeof input.body == "object")
            {
                for (let inputNode in input.body) {
                    if (input.body.hasOwnProperty(inputNode))
                    {
                        let childNode = this.build(input.body[inputNode], parentNode);
                        node.element.appendChild(childNode.element);
                    }
                }
            }
        }


        // id, classes and styles
        if (typeof input.id == "string")
            node.setId(input.id);

        if (typeof input.classes == "object")
        {
            for (let className in input.classes)
            {
                if (input.classes.hasOwnProperty(className))
                    node.addClass(input.classes[className]);
            }
        }

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


    public static buildArray(input, parentNode = undefined) : any
    {
        let result = [];


        for (let inputNode in input) {
            result.push(this.build(input[inputNode], parentNode));
        }

        return result;
    }
}
