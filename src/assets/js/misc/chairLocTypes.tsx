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
export interface ChairIMEIRentalAgent {
   chair: string;
   imei: string;
   rentalAgent?: string;
}
export interface APIRangeQO {
   pairings: Array<ChairIMEIRentalAgent>;
   range: RangeObject;
   keptHeaders: Array<string>;
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

export interface ICircle {
   x: number;
   y: number;
   dX: number;
   dY: number;
   radius: number;
   colorBank: number;
   colorIndex: number;
   draw: (c: any, cA: Array<string>) => void;
   update: (cW: number, cH: number, c: any, cA: Array<string>) => void;
}

export interface AssetCount {
   asset: string;
   numDistances: number;
}
export interface TaskObj {
   docID: string;
   taskID: string;
   task: string;
   asset: string;
   dateDone: string;
}
