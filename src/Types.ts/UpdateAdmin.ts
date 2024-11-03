import { IAdmin } from "../Interfaces/IAdmin";
export type UpdateAdmin = Partial<Omit<IAdmin, 'readableId' | 'hubMongoId'>>;