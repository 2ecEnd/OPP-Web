import type { ApiService } from "./Services/ApiService";
import { DOMService } from "./DOMService";

export class Login{
    private container: HTMLElement;
    private form: HTMLFormElement;
    private apiService: ApiService;

    constructor(apiService: ApiService){
        this.container = DOMService.getElementById('authentication-form-container');
        this.form = DOMService.getElementById('authentication-form') as HTMLFormElement;
        this.apiService = apiService;

        this.init();
    }

    init(): void{
        this.form.addEventListener('submit', this.login.bind(this));
    }

    toggleVisibility(): void{
        this.container.classList.toggle('active');
    }

    async login(e: Event): Promise<void>{
        e.preventDefault();

        const email = (DOMService.getElementById('authenticationEmailInput') as HTMLInputElement).value;
        const password = (DOMService.getElementById('authenticationPasswordInput') as HTMLInputElement).value;

        if(await this.apiService.login(email, password)) this.form.reset();
    }
}
