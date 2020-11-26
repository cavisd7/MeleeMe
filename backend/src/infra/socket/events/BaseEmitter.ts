//credit: https://rjzaworski.com/2019/10/event-emitters-in-typescript

/*import { EventEmitter } from 'events';

interface Test {
    [x: string]: any
}

type EventMap<T extends string> = Record<T, any>;
type EventKey<T extends EventMap> = string & keyof T;
type EventReceiver<T> = (params: T) => void;

interface Emitter<T extends EventMap<T>> {
    //on <U extends EventKey<T>>(eventName: U, fn: EventReceiver<T[U]>): void;
    emit<U extends EventKey<T>>(eventName: U, params: T[U]): void;
}

class BaseEmitter<Name extends string, Type> implements Emitter<Type> {
    private emitter = new EventEmitter();

    protected on<K extends EventKey<T>>(eventName: K, fn: EventReceiver<T[K]>) {
        this.emitter.on(eventName, fn);
    }

    public emit<K extends EventKey<T>>(eventName: K, params: T[K]) {
        this.emitter.emit(eventName, params);
    };
};

export { BaseEmitter };*/

import { EventEmitter } from 'events';

/**
 * {
 *      [x: string]: any
 * }
 */
type EventMap = Record<string, any>;
type EventKey<T extends EventMap> = string & keyof T;
type EventReceiver<T> = (params: T) => void;

interface Emitter<T extends EventMap> {
    //on <U extends EventKey<T>>(eventName: U, fn: EventReceiver<T[U]>): void;
    emit<U extends EventKey<T>>(eventName: U, params: T[U]): void;
}

class BaseEmitter<T extends EventMap> implements Emitter<T> {
    private emitter = new EventEmitter();

    protected on<K extends EventKey<T>>(eventName: K, fn: EventReceiver<T[K]>) {
        this.emitter.on(eventName, fn);
    }

    public emit<K extends EventKey<T>>(eventName: K, params: T[K]) {
        this.emitter.emit(eventName, params);
    };
};

export { BaseEmitter };