interface IRegisterUserBody {
    username: string;
    password: string;
    email: string;
    netcode: string;
};

const registerUserSchema = {
    username: {
        presence: true,
        length: {
            minimum: 2, //TODO: change back to 5
            maximum: 32, 
            message: "Username must be between 5-32 characters long"
        },
        /*format: {
            pattern: "[a-z0-9]+",
            flags: "i",
            message: "username can only contain a-z and 0-9"
        }*/
    },
    password: {
        presence: true,
        length: {
            minimum: 4, //TODO: change back to 8
            message: "Password must be at least 8 characters long"
        },
    },
    email: {
        presence: true,
        length: {
            maximum: 40,
            message: "Email can not be longer than 40 characters"
        },
    },
    netcode: {
        presence: true,
        length: {
            maximum: 8,
            message: "Netcode can not be longer than 8 characters"
        },
    },
};

export { registerUserSchema, IRegisterUserBody };
