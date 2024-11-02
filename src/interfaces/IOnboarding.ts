import { CreateAdmin } from "../Types.ts/CreateAdmin";
import { CreateHub } from "../Types.ts/CreateHub";
export interface IOnboarding {
    hub: CreateHub;
    admin: CreateAdmin;
  }