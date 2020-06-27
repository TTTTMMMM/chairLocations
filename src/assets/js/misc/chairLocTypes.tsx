import { IWLocObj } from "../configs/mapConfigs/mapTypes";

export interface HeaderMapping {
   origHdr: string | undefined;
   newHdr: string;
}

export interface AdditionalPropsType {
   STATE?: string | undefined;
   BEACH?: string | undefined;
   RENTALAGENT?: string | undefined;
}
export interface AssetRangeQO {
   asset: string | undefined;
   range: RangeObject;
}
export interface ViewReportRangeQO {
   assets: Array<string>;
   range: RangeObject;
}
export interface ChairIMEI {
   chair: string;
   imei: string;
}
export interface APIRangeQO {
   pairings: Array<ChairIMEI>;
   range: RangeObject;
}

export interface AssetLabelQueryType {
   ASSETLABEL?: string | undefined;
}

export enum Roles {
   admin = "admin",
   uploader = "uploader",
   lurker = "lurker",
   maintenance = "maintenance",
   notloggedin = "notloggedin",
}

export const rolesArray = Object.keys(Roles);
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

let aa: AccessObj = {
   chairLocsRead: true,
   chairLocsWrite: true,
   maintenance: true,
};

let al: AccessObj = {
   chairLocsRead: true,
   chairLocsWrite: false,
   maintenance: false,
};

let au: AccessObj = {
   chairLocsRead: true,
   chairLocsWrite: true,
   maintenance: true,
};

let am: AccessObj = {
   chairLocsRead: false,
   chairLocsWrite: false,
   maintenance: true,
};

export let accessPrivsObj: any = {
   admin: aa,
   lurker: al,
   uploader: au,
   maintenance: am,
};

export enum CallingFrom {
   cleanAndUploadFiles = "cleanAndUploadFiles",
   chairResultsSide = "chairResultsSide",
   generateDistanceReport = "generateDistanceReport",
}

export interface RangeObject {
   startDate: string;
   endDate: string;
}

export interface GeoPoint {
   lat: number;
   lng: number;
}

export interface DateGeoObj {
   geoDate: string;
   geo: GeoPoint;
}

export interface DistanceObj {
   inMeters: number;
   inFeet: number;
   inMiles: number;
}
export interface CumDistDaily {
   asset: string;
   rentalAgent: string;
   dailyDate: string;
   distObj: DistanceObj;
   period: string;
}

export interface AuthProps {
   auth2: string;
   googleToken: string;
   isSignedIn: boolean;
   isLoggedInToFirebase: boolean;
   usrObjFmServer: UserObj;
   changeGoogleLoginStatus: any;
}

export interface AssetGeoLocs {
   [asset: string]: Array<IWLocObj>;
}
