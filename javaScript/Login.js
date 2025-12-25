import { DOMService } from "./Services/DOMService";
export class Login {
    container;
    form;
    apiService;
    constructor(apiService) {
        this.container = DOMService.getElementById('authentication-form-container');
        this.form = DOMService.getElementById('authentication-form');
        this.apiService = apiService;
        this.init();
    }
    init() {
        this.form.addEventListener('submit', this.login.bind(this));
    }
    toggleVisibility() {
        this.container.classList.toggle('active');
    }
    async login(e) {
        e.preventDefault();
        const email = DOMService.getElementById('authenticationEmailInput').value;
        const password = DOMService.getElementById('authenticationPasswordInput').value;
        if (await this.apiService.login(email, password))
            this.form.reset();
    }
}
//# sourceMappingURL=Login.js.map