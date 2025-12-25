import { DOMService } from "./Services/DOMService";
export class Registration {
    container;
    form;
    apiService;
    constructor(apiService) {
        this.container = DOMService.getElementById('registration-form-container');
        this.form = DOMService.getElementById('registration-form');
        this.apiService = apiService;
        this.init();
    }
    init() {
        this.form.addEventListener('submit', this.register.bind(this));
    }
    toggleVisibility() {
        this.container.classList.toggle('active');
    }
    async register(e) {
        e.preventDefault();
        const email = DOMService.getElementById('registrationEmailInput').value;
        const password = DOMService.getElementById('registrationPasswordInput').value;
        if (await this.apiService.register(email, password))
            this.form.reset();
    }
}
//# sourceMappingURL=Registration.js.map