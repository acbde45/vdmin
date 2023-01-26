import { Ref, ComputedRef } from 'vue';

export type Lazy<T> = () => Promise<T>;
export type Pojo<T = any> = Record<string, T>;
export type DynamicProps<T extends Pojo> = {
  [P in keyof T]: Ref<T[P]> | T[P] | ComputedRef<T[P]>;
};
export type Fn<T = any, R = T> = {
  (...arg: T[]): R;
};
export type PromiseFn<T = any, R = T> = {
  (...arg: T[]): Promise<R>;
};
