export const createMetaData = (imageUri: string, description: string, treatType: string, expiry: string, additionaAttributes: any) => {
    return {
            "description": description, 
            "external_url": "https://tokentreat.xyz", 
            "image": imageUri, 
            "name": "TokenTreat",
            "background_color": "000000",
            "attributes": [
                {
                    "trait_type": "issuer",
                    "value": "TokenTreat"
                },
                {
                    "trait_type": "treat_type",
                    "value": treatType
                },
                {
                    "trait_type": "treat_expiry",
                    "value": expiry
                }
            ]
    }
}