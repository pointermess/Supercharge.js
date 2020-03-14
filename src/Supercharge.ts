/**
 * Supercharge Class
 *
 * Basic Supercharge element.
 */
class Supercharge {
    public element : HTMLElement;

    constructor(tag: string, body: any = undefined) {

        // create element
        let node;

        // append body
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
                for (let bodyIndex in body) {
                    if (body.hasOwnProperty(bodyIndex))
                        body[bodyIndex].mount(this.element);
                }
            }
            else
                console.error('Unknown body type');
        }

        // bind events
        this.element.onclick = (e) => this.onClick(e);
        this.element.onload = () => this.onLoad();
        this.element.onmousemove = (e) => this.onMouseMove(e);

        this.onCreate();
    }

    /*
     * Events
     */
    public onClick(e : MouseEvent) {};
    public onMouseMove(e : MouseEvent) {};
    public onLoad() {};
    public onMount() {};
    public onCreate() {};

    public setId(id : string) : void {
        this.element.id = id;
    }

    public setAttribute(attr : string, value : string) : void {
        this.element.setAttribute(attr, value);
    }

    public getAttribute(attr : string) : string {
        return this.element.getAttribute(attr);
    }

    public addClass(className : string) : void {
        if (!this.hasClass(className))
            this.element.className += " " + className;
    }

    public removeClass(className : string) : void {
        if (this.element.classList)
            this.element.classList.remove(className);
        else
            this.element.className = this.element.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');

    }

    public hasClass(className : string) : boolean {
        return !!this.element.className.match(new RegExp('(\\s|^)'+className+'(\\s|$)'));
    }

    public toggleClass(className : string) : void {
        if (this.hasClass(className))
            this.removeClass(className);
        else
            this.addClass(className);
    }

    public setStyle(property : string, value : string) : void {
        this.element.style[property] = value;
    }

    public mount(element : Supercharge|HTMLElement) : void {
        this.onMount();

        if (element instanceof HTMLElement)
            element.appendChild(this.element);
        else if (element instanceof Supercharge)
            element.element.appendChild(this.element);
    }

    public unmount() : void {
        if (this.element.parentNode !== null)
            this.element.parentNode.removeChild(this.element);
    }

    public insert(array) : void {
        if (!Array.isArray(array)) {
            console.error('Only arrays can be passed to insert.');
            return;
        }

        for (let item in array) {
            if (array.hasOwnProperty(item)) {
                if (array[item] instanceof Supercharge)
                    array[item].mount(this);
                else if (array[item] instanceof HTMLElement)
                    array[item].element.appendChild(array[item]);
                else
                    console.error('Unknown element type in Supercharge.insert.');
            }
        }
    }

    public find(query) {
        return this.element.querySelector(query);
    }
}

/**
 * SuperchargeViewer Class
 *
 * Container class to set
 */
class SuperchargeViewer {
    private parent: Supercharge;
    private currentView: Supercharge[]|Supercharge = undefined;

    constructor(parent) {
        this.parent = parent;
    }

    public setView(view: Supercharge|Array<Supercharge>) : void {
        this.onChangeView(() => {
            // unmount current view
            if (this.currentView != undefined) {
                if (this.currentView instanceof Supercharge)
                    this.currentView.unmount();
                else if (Array.isArray(this.currentView)) {
                    for (let index in this.currentView) {
                        if (this.currentView.hasOwnProperty(index))
                            this.currentView[index].unmount();
                    }
                }
            }

            // set new view
            this.currentView = view;
            if (view instanceof Supercharge)
                view.mount(this.parent);
            else
                this.parent.insert(view);

            this.onViewChanged();
        });
    }

    public getView() {
        return this.currentView;
    }

    public removeView() : void {
        if (this.currentView instanceof Supercharge) {
            this.currentView.unmount();
            this.currentView = undefined;
        }
    }

    // Events
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
    public static build(input, parent = undefined) : Supercharge
    {
        let node;


        // experimental feature
        let parentNode = node;
        if (parent != undefined) parentNode = parent;

        if (input instanceof Supercharge) {
            return input;
        }
        else
        {
            node = new Supercharge(input.tag);

            // TODO: finish build process
            if (typeof input.body == "string") {
                node.element.appendChild(document.createTextNode(input.body));
            }
            else if (typeof input.body == "object") {
                if (Array.isArray(input.body))
                {
                    for (let inputNode in input.body) {
                        if (input.body.hasOwnProperty(inputNode)) {
                            let childNode = this.build(input.body[inputNode], parentNode);
                            node.element.appendChild(childNode.element);
                        }
                    }
                }
                else
                {
                    let childNode = this.build(input.body, parentNode);
                    node.element.appendChild(childNode.element);
                }
            }
        }


        // id, classes and styles
        if (typeof input.id == "string")
            node.setId(input.id);

        if (typeof input.styles == "object") {
            for (let styleName in input.styles) {
                if (input.styles.hasOwnProperty(styleName))
                    node.setStyle(styleName, input.styles[styleName]);
            }
        }

        if (typeof input.classes == "object") {
            for (let className in input.classes) {
                if (input.classes.hasOwnProperty(className))
                    node.addClass(input.classes[className]);
            }
        }

        if (typeof input.attributes == "object") {
            for (let attributeName in input.attributes) {
                if (input.attributes.hasOwnProperty(attributeName))
                    node.setAttribute(attributeName, input.attributes[attributeName]);
            }
        }

        if (typeof input.onClick == "function") node.onClick = input.onClick.bind(parentNode);
        if (typeof input.onMount == "function") node.onMount = input.onMount.bind(parentNode);
        if (typeof input.onCreate == "function") node.onMount = input.onCreate.bind(node);

        // functions
        for (let inputFunction in input.functions) {
            if (input.functions.hasOwnProperty(inputFunction)) {
                parentNode[inputFunction] = input.functions[inputFunction];
                console.log('added to root: ' + inputFunction);
            }
        }

        // owned functions
        // bound to the created node instead of the parent node
        for (let inputFunction in input.owned) {
            if (input.owned.hasOwnProperty(inputFunction)) {
                parentNode[inputFunction] = input.owned[inputFunction].bind(node);
            }
        }

        return node;
    }


    public static buildArray(input : Array<any>, parentNode : Supercharge = undefined) : Supercharge[] {
        let result : Supercharge[] = [];

        for (let inputNode in input) {
            result.push(this.build(input[inputNode], parentNode));
        }

        return result;
    }
}
