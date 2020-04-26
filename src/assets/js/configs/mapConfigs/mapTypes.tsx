export interface GeoLoc {
  lat: number;
  lng: number;
}
export interface IWLocObj {
  id?: string;
  assetlabel?: string;
  beach?: string;
  updatetime: string;
  location: GeoLoc;
}

export interface ModifiedIWLocObj {
  id?: string;
  assetlabel?: string;
  beach?: string;
  updatetime: string;
  day?: string;
  shortDate?: string;
  shortTime?: string;
  location: GeoLoc;
}
