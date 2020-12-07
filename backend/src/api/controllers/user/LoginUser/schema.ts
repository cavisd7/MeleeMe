interface ILoginUserBody {
    username: string;
    password: string;
};

const loginUserSchema = {
    username: {
        presence: true,
        length: {
            minimum: 5,
            maximum: 32, 
            message: "username must be between 5-32 characters long"
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
            minimum: 8,
            message: "password must be at least 8 characters long"
        },
    }
};

export { loginUserSchema, ILoginUserBody };

