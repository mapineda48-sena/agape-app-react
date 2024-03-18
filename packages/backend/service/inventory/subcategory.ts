import type * as ORM from "../orm";

export interface IRecord extends ORM.Record {
  fullName: string;
  isEnabled: boolean;
  categoryId: number;
}

export type IModel = ORM.Model<IRecord>;

export type IData = ORM.Model<IRecord, "id">;