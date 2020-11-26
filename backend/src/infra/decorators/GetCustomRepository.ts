import { getFromContainer, getCustomRepository, ConnectionManager } from 'typeorm';

//design:paramtypes
function GetCustomRepo (entityType) {
    return function (target, key, index) {
        const paramTypes = Reflect.getOwnMetadata("design:paramtypes", target, key);
        console.log('paramTypes', paramTypes);
        const type = paramTypes[index];
        console.log('type', type)
        const test = {
            bleh: 'hi',
            type: type,
            object: function () {
                const connectionManager = getFromContainer(ConnectionManager);
                const connection = connectionManager.get('default');
                return connection.getCustomRepository(type);
            }
        }
        getFromContainer(test as any);
        //const conn = getConnection();
        //conn.getCustomRepository(entityType)
    }

    /*const connectionName = 'default';
    console.log('passed', Object.getOwnPropertyDescriptors(entityType))
    return function (target: Object, name, key) {
        console.log(name)
        const meta = Reflect.getOwnMetadata('design', target)
        console.log('reflect', meta)
        //const connectionManager = getConnection();
        //return getConnection().getCustomRepository(entityType)
    };*/
};