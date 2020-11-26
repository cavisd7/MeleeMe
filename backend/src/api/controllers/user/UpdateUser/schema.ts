interface IUpdateUserBody {
    username: string;
    email: string;
    netcode: string;
    passwordConfirmation: string;
};

const updateUserSchema = {
    username: {
        presence: true,
        length: {
            minimum: 2, //TODO: change back to 5
            maximum: 32, 
            message: "Username must be between 5-32 characters long"
        },
    },
    passwordConfirmation: {
        presence: true,
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

export { updateUserSchema, IUpdateUserBody };

