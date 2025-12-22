import { Registration } from "./Registration";
import { DOMService } from "./DOMService";
import { Login } from "./Login";
import { apiService, type ApiService } from "./Services/ApiService";

class ChooseAuthOption {
    private container: HTMLElement;
    private loginOption: HTMLElement;
    private registerOption: HTMLElement;
    private registrationMenu: Registration;
    private loginMenu: Login;

    constructor() {
        this.container = DOMService.getElementById('option-choice-container');
        this.loginOption = DOMService.getElementById('option-authentication');
        this.registerOption = DOMService.getElementById('option-registration');
        this.registrationMenu = new Registration(apiService);
        this.loginMenu = new Login(apiService);

        this.init();
    }
    
    private init(): void {
        this.loginOption.addEventListener('click', this.openLoginMenu.bind(this));
        this.registerOption.addEventListener('click', this.openRegisterMenu.bind(this));
    }

    private openLoginMenu(): void {
        this.toggleVisibility();
        this.loginMenu.toggleVisibility();
    }

    private openRegisterMenu(): void {
        this.toggleVisibility();
        this.registrationMenu.toggleVisibility();
    }

    private toggleVisibility(): void {
        this.container.classList.toggle('active');
    }
}

export const chooseAuthOption = new ChooseAuthOption();