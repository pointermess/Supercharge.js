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
            else
                this.element.appendChild(body);
        }

        // assign events
        this.element.onclick = (e) => this.onClick(e);
    }


    /*
     * Events
     */
    public onClick(e) {};
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
    public static build(input)
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
                node = new Supercharge(input.tag, input.body);
                node.onClick = input.onClick.bind(node);
            }
            else if (typeof input.body == "object")
            {
                node = new Supercharge(input.tag);
                for (let inputNode in input.body) {
                    if (input.body.hasOwnProperty(inputNode))
                    {
                        let childNode = this.build(input.body[inputNode]);
                        node.element.appendChild(childNode.element);
                    }
                }
            }
        }

        return node;
    }
}
