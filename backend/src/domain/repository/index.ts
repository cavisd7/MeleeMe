export default interface Repository<T> {
    exists(id: string): Promise<boolean>;
    //delete(t: T): Promise<any>;
    delete (userId: string): Promise<any>
    save(t: T): Promise<any>;
};