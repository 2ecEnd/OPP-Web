import type { ApiService } from "./Services/ApiService.js";
export declare class Login {
    private container;
    private form;
    private apiService;
    constructor(apiService: ApiService);
    init(): void;
    toggleVisibility(): void;
    login(e: Event): Promise<void>;
}
//# sourceMappingURL=Login.d.ts.map