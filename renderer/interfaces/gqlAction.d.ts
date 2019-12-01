import { Course, StringKey, TmpNonPossible } from '.';

/**
 * Query<Paged>, Mutation, Subscription
 */

export type ActionResult<T, KEY = 'updated'> = {
  [key in KEY]: T;
};

/**
 * pick base key
 */
export type PickBase<T, PKey = 'id'> = Exclude<
  StringKey<TmpNonPossible<T>, string | number>,
  PKey
>;

/**
 * generate possible key Object
 */

export type UpdateDto<T> = {
  [key in PickBase<T>]?: T[key];
};

/**
 * generate update payload type
 */
export type MutateUpdatePayload<T, IDType = 'number'> = {
  id: number;
  data: UpdateDto<T>;
};
