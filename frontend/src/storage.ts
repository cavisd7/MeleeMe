import { User, Token } from "types/user";

const loadStorage = (key: string) => {
    const item = window.localStorage.getItem(key);

    if (item === null) return null;

    try {   
        return JSON.parse(item);
    } catch (err) {
        console.log(`[Storage Error] Could not load from local storage: ${err}`);
        return null;
    };
};

//TODO: store raw value?
const setStorage = (key: string, value: any) => {
    const item = JSON.stringify(value);

    return window.localStorage.setItem(key, item);
};

interface GetAndSet<T> {
    get: () => T;
    set: (value: T) => void;
};

interface Storage {
    user: GetAndSet<User>;
    token: GetAndSet<Token>;
};

const storage: Storage = {
    user: {
        get: () => loadStorage('user'),
        set: (value) => setStorage('user', value)
    },
    token: {
        get: () => loadStorage('token'),
        set: (value) => setStorage('token', value)
    }
};

export { storage };