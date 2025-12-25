export class DOMService {
    static getElementById(id) {
        const element = document.getElementById(id);
        if (!element) {
            throw new Error(`Required element #${id} not found`);
        }
        return element;
    }
    static querySelector(parent = document, selector) {
        const element = parent.querySelector(selector);
        if (!element) {
            throw new Error(`Required element ${selector} in ${parent} not found`);
        }
        return element;
    }
}
//# sourceMappingURL=DOMService.js.map