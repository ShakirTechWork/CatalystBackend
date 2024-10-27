import OrganizationModel from "../Models/OrganizationModel";
import AdminModel from "../Models/AdminModel";
import CollectionType from "../enums/CollectionType"
import KeyType from "../enums/KeyType";

export async function isUniqueData(collectionType: CollectionType, keyType: KeyType, value: string) {
    /*if (collectionType == CollectionType.ORGANIZATION) {
        switch (keyType) {
            case KeyType.NAME: 
                return await OrganizationModel.findOne({ name: value });
    
            case KeyType.EMAIL:
                return await OrganizationModel.findOne({ emailId: value });
                
            default:
                return null
        }
    } else if (collectionType == CollectionType.ADMIN) {
        switch (keyType) {
            case KeyType.NAME: 
                return await AdminModel.findOne({ name: value });
    
            case KeyType.EMAIL:
                return await AdminModel.findOne({ emailId: value });
                
            default:
                return null
        }
    }*/
    
    switch (collectionType) {
        case CollectionType.ORGANIZATION: 
            switch (keyType) {
                case KeyType.NAME: 
                    return await OrganizationModel.findOne({ name: value });
    
                case KeyType.EMAIL:
                    return await OrganizationModel.findOne({ emailId: value });
                
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