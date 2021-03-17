export type AnyFn = (...args: any) => any;

export type InferObjectFieldValues<T> = T extends { [key: string]: infer U } ? U : never;
/* Extract return types of all function fields of an object */
export type InferObjectFunctionFields<T> = T extends { [key: string]: (...args: any) => infer U } ? U : never;

export type Unionize<T extends Record<string, unknown>> = {
  [P in keyof T]: { [Q in P]: T[P] };
}[keyof T];
