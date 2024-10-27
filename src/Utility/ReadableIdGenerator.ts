import OrganizationModel from '../Models/OrganizationModel';
import { CatalystConstants } from '../Constants/CatalystConstants';
import CollectionType from '../enums/CollectionType';
import AdminModel from '../Models/AdminModel';

export function generateReadableId(): string {
    let result = '';
    
    for (let i = 0; i < CatalystConstants.READABLE_ID_LENGTH; i++) {
        const randomIndex = Math.floor(Math.random() * CatalystConstants.RANDOM_ID_CHARACTERS.length);
        result += CatalystConstants.RANDOM_ID_CHARACTERS[randomIndex];
    }
    
    return result;
}

export async function createUniqueId(collectionType: CollectionType): Promise<string> {
    let uniqueId: string = "";
    let isUnique = false;

    while (!isUnique) {
        uniqueId = generateReadableId();
        const result = await findCollectionByType(collectionType, 'readableId');
        if (!result) {
            isUnique = true;
        }
    }

    return uniqueId;
}

async function findCollectionByType(collectionType: CollectionType, uniqueId: string) {
    switch (collectionType) {
        case CollectionType.ORGANIZATION: 
            return await OrganizationModel.findOne({ readableId: uniqueId });

        case CollectionType.ADMIN:
            return await AdminModel.findOne({ readableId: uniqueId });

        case CollectionType.TEAM:
            return null
            // return await TeamModel.findOne({ readableId: uniqueId });

        case CollectionType.SALESMEN:
            return null
            // return await SalesmenModel.findOne({ readableId: uniqueId });

        case CollectionType.LEAD:
            return null
            // return await LeadModel.findOne({ readableId: uniqueId });

        default:
            return null; // Handle the case where collectionType doesn't match any cases
    }
}

