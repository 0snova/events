export type InferObjectFieldValues<T> = T extends { [key: string]: infer U } ? U : never;

export type Unionize<T extends Record<string, unknown>> = {
  [P in keyof T]: { [Q in P]: T[P] };
}[keyof T];
