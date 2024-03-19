import type * as ORM from "../../orm";

export function create(category: IData): Promise<void>;
export function findAll(): Promise<IRecord[]>;

export interface IRecord extends ORM.Record {
  fullName: string;
  isEnabled: boolean;
}

export type IModel = ORM.Model<IRecord>;

export type IData = ORM.Model<IRecord, "id">;
