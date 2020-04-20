export interface HeaderMapping {
   origHdr: string | undefined;
   newHdr: string;
}

export interface AdditionalPropsType {
   STATE?: string | undefined;
   BEACH?: string | undefined;
   RENTALAGENT?: string | undefined;
}

export interface AssetLabelQueryType {
   ASSETLABEL?: string | undefined;
}

enum Roles {
   admin = "admin",
   user = "user",
}
interface AccessObj {
   chairLocs: boolean;
   maintenance: boolean;
}

interface UserObj {
   role?: Roles;
   canAccess?: AccessObj;
}
