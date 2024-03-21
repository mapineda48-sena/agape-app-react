import type * as ORM from "../../orm";

export function createCategory(fullName: string): Promise<void>;

export function deleteCategory(idCategory: number): Promise<void>;

export function findAll(): Promise<IRecord[]>;

/**
 * Types
 */
export interface IRecord extends ORM.Record {
  fullName: string;
  isEnabled: boolean;
}

export type IModel = ORM.Model<IRecord>;

export type IData = ORM.Model<IRecord, "id">;
