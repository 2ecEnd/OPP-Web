import { Registration } from "./Registration.js";
import { DOMService } from "./Services/DOMService.js";
import { Login } from "./Login.js";
import { apiService } from "./Services/ApiService.js";
class ChooseAuthOption {
    container;
    loginOption;
    registerOption;
    registrationMenu;
    loginMenu;
    constructor() {
        this.container = DOMService.getElementById('option-choice-container');
        this.loginOption = DOMService.getElementById('option-authentication');
        this.registerOption = DOMService.getElementById('option-registration');
        this.registrationMenu = new Registration(apiService);
        this.loginMenu = new Login(apiService);
        this.init();
    }
    init() {
        this.loginOption.addEventListener('click', this.openLoginMenu.bind(this));
        this.registerOption.addEventListener('click', this.openRegisterMenu.bind(this));
    }
    openLoginMenu() {
        this.toggleVisibility();
        this.loginMenu.toggleVisibility();
    }
    openRegisterMenu() {
        this.toggleVisibility();
        this.registrationMenu.toggleVisibility();
    }
    toggleVisibility() {
        this.container.classList.toggle('active');
    }
}
export const chooseAuthOption = new ChooseAuthOption();
//# sourceMappingURL=ChooseAuthOption.js.map