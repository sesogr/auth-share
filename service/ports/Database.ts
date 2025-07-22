export type Userinfo = {
  name: string;
  passwort: string;
  email: string;
  twofaref: string;
};
export interface Database {
  getUserinfoList(): Userinfo[];
  getUserinfoByName([string]: string): Userinfo;
}
