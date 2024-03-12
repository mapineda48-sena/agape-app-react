export interface Record {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

export type Model<
  T extends Record,
  K extends keyof Omit<T, "createdAt" | "updatedAt"> = keyof object
> = Omit<T, "createdAt" | "updatedAt" | K>;
