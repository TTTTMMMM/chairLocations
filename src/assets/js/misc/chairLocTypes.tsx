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

export enum Roles {
   admin = "admin",
   uploader = "uploader",
   lurker = "lurker",
   maintenance = "maintenance",
}
export interface AccessObj {
   chairLocsRead?: boolean;
   chairLocsWrite?: boolean;
   maintenance?: boolean;
}

export interface UserObj {
   username: string;
   role: Roles;
   canAccess: AccessObj;
}
