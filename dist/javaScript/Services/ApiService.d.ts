import type { UserDto } from "../Dto/DtoTypes";
export declare class ApiService {
    private api;
    private saved;
    constructor();
    register(email: string, password: string): Promise<boolean>;
    login(email: string, password: string): Promise<boolean>;
    getUserData(): Promise<UserDto | undefined>;
    saveUserData(user: UserDto): Promise<Response | undefined>;
}
export declare const apiService: ApiService;
//# sourceMappingURL=ApiService.d.ts.map