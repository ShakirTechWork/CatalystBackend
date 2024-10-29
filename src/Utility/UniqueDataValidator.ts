import HubModel from "../Models/HubModel";
import AdminModel from "../Models/AdminModel";
import CollectionType from "../Enums/CollectionType"
import KeyType from "../Enums/KeyType";

export async function isUniqueData(collectionType: CollectionType, keyType: KeyType, value: string) {    
    switch (collectionType) {
        case CollectionType.HUB: 
            switch (keyType) {
                case KeyType.NAME: 
                    return await HubModel.findOne({ name: value });
    
                case KeyType.EMAIL:
                    return await HubModel.findOne({ emailId: value });
                
                default:
                    return null
            }

        case CollectionType.ADMIN:
            switch (keyType) {
                case KeyType.NAME: 
                    return await AdminModel.findOne({ name: value });
        
                case KeyType.EMAIL:
                    return await AdminModel.findOne({ emailId: value });
                    
                default:
                    return null
            }

        case CollectionType.TEAM:
            switch (keyType) {
                case KeyType.NAME: 
                    return await AdminModel.findOne({ name: value });
        
                case KeyType.EMAIL:
                    return await AdminModel.findOne({ emailId: value });
                    
                default:
                    return null
            }

        case CollectionType.SALESMEN:
            switch (keyType) {
                case KeyType.NAME: 
                    return await AdminModel.findOne({ name: value });
        
                case KeyType.EMAIL:
                    return await AdminModel.findOne({ emailId: value });
                    
                default:
                    return null
            }

        case CollectionType.LEAD:
            switch (keyType) {
                case KeyType.NAME: 
                    return await AdminModel.findOne({ name: value });
        
                case KeyType.EMAIL:
                    return await AdminModel.findOne({ emailId: value });
                    
                default:
                    return null
            }

        default:
            return null
            
    }
}