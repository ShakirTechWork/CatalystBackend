import { IHub } from "../Interfaces/IHub";
export type CreateHub = Omit<IHub, 'readableId' | 'adminMongoId'>;