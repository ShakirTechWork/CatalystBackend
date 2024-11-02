import { IHub } from "../Interfaces/IHub";
export type UpdateHub = Partial<Omit<IHub, 'readableId' | 'adminMongoId'>>;