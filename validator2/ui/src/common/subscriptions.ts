export interface SubscriptionsTypes {
  value: (arg: string) => void;
}

export type Subscriptions = {
  [K in keyof SubscriptionsTypes]: {
    /**
     * Emit event
     */
    emit: SubscriptionsTypes[K];
    /**
     * Subscribe to event`
     */
    on: (handler: SubscriptionsTypes[K]) => void;
  };
};

export const subscriptionsData: { [P in keyof Subscriptions]: {} } = {
  value: {},
};

// DO NOT REMOVE
// Enforces that each route is a function that returns nothing
export type SubscriptionsArguments = {
  [K in keyof SubscriptionsTypes]: Parameters<SubscriptionsTypes[K]>;
};
