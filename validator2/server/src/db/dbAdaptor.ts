import { mapValues, merge } from "lodash";

type CollectionIndex = string | number;

/**
 * DB connector that allows to write and read from dynamic keys of a type collection
 */
interface CollectionConnector<T> {
  get: (id: CollectionIndex) => T | undefined;
  set: (item: T) => void;
  merge: (item: T) => void;
  getAll: () => T[];
  mergeAll: (items: { [id: string]: T }) => void;
  clearAll: () => void;
}

/**
 * DB connector that allows to write and read from a single static key
 */
interface RegularConnector<T> {
  get: () => T | undefined;
  set: (value: T) => void;
  merge: (value: T) => void;
}
/**
 * Extra type for regular overload with an initial value, so the return
 * of get is never undefined
 */
interface RegularConnectorInitialized<T> extends RegularConnector<T> {
  get: () => T;
}

/**
 * DB object with the key pre-binded
 */
interface DbSlice<T> {
  get: () => T | undefined;
  set: (value: T) => void;
}

/**
 * Curried function that bind a DB to a connector
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DbSliceBuilder<T> = (db: DbSlice<any>) => T;

/**
 * Actual DB to read and write from
 */
interface Db {
  get: <T>(key: CollectionIndex) => T | undefined;
  set: <T>(key: CollectionIndex, value: T) => void;
}

/**
 * DB connector that allows to write and read from dynamic keys of a type collection
 * @param selectId
 */
export function collection<T>(
  selectId: (model: T) => number | string
): DbSliceBuilder<CollectionConnector<T>> {
  return function collectionBuilder(
    db: DbSlice<{ [id: string]: T }>
  ): CollectionConnector<T> {
    const getState = (): { [id: string]: T } => db.get() || {};
    const get = (id: CollectionIndex): T | undefined => getState()[id];
    const set = (item: T): void => {
      db.set({ ...getState(), [selectId(item)]: item });
    };
    return {
      get,
      set,
      merge: (item: T): void => set(merge(get(selectId(item)) || {}, item)),
      getAll: (): T[] => Object.values(getState()),
      mergeAll: (items: { [id: string]: T }): void =>
        db.set(merge(getState(), items)),
      clearAll: (): void => db.set({})
    };
  };
}

export function regular<T>(
  initialValue: T
): DbSliceBuilder<RegularConnectorInitialized<T>>;
export function regular<T = undefined>(): DbSliceBuilder<RegularConnector<T>>;

/**
 * DB connector that allows to write and read from a single static key
 * @param initialValue
 */
export function regular<T = undefined>(
  initialValue?: T
): DbSliceBuilder<RegularConnector<T>> {
  return function collectionBuilder(db: DbSlice<T>): RegularConnector<T> {
    const get = (): T | undefined => db.get() || initialValue;
    const set = (value: T): void => db.set(value);
    return {
      get,
      set,
      merge: (item: T): void => set(merge(get() || {}, item))
    };
  };
}

/**
 * Creates a DB instance given key value pairs of slice builders
 * @param db
 * @param sliceBuilders
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createDb<SBs extends { [K: string]: DbSliceBuilder<any> }>(
  db: Db,
  sliceBuilders: SBs
): { [K in keyof SBs]: ReturnType<SBs[K]> } {
  return mapValues(sliceBuilders, (sliceBuilder, key) =>
    sliceBuilder({
      get: () => db.get(key),
      set: <T>(value: T) => db.set(key, value)
    })
  );
}
