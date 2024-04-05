import type { Model } from "sequelize";

export interface IRecord {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

export type IModel<R extends IRecord> = Model<
  Omit<R, "createdAt" | "updatedAt">,
  Omit<R, "createdAt" | "updatedAt" | "id">
>;
