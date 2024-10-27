import { IAdmin } from "./IAdmin";
import { IOrganization } from "./IOrganization";
export interface IOnboarding {
    organization: IOrganization;
    admin: IAdmin;
}