export class DOMService{
    static getElementById<T extends HTMLElement = HTMLElement>(id: string): T {
        const element = document.getElementById(id);
        if (!element) {
            throw new Error(`Required element #${id} not found`);
        }
        return element as T;
    }

    static querySelector<T extends HTMLElement = HTMLElement>(parent: HTMLElement | Document = document, selector: string): T{
        const element = parent.querySelector(selector);
        if (!element) {
            throw new Error(`Required element ${selector} in ${parent} not found`);
        }
        return element as T;
    }
}