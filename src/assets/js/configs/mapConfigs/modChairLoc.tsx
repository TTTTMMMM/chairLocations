import { IWLocObj, ModifiedIWLocObj } from "./mapTypes";

export const modChairLoc = (cLo: IWLocObj): ModifiedIWLocObj => {
   let mClo: ModifiedIWLocObj = JSON.parse(JSON.stringify(cLo));
   let date = new Date(cLo.updatetime);
   let eee = date.toDateString().split(" ");
   mClo.day = eee[0];
   mClo.shortDate = `${eee[1]} ${eee[2]} ${eee[3]}`;
   mClo.shortTime = `${date.getHours().toLocaleString("en-US", {
      minimumIntegerDigits: 2,
   })}:${date
      .getMinutes()
      .toLocaleString("en-US", { minimumIntegerDigits: 2 })}`;
   return mClo;
};

export interface LatestUpdateObj {
   id: string;
   latestUpdate: string;
}
