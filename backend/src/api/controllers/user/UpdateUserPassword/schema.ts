interface IUpdateUserPasswordBody {
    newPassword: string;
    passwordConfirmation: string;
}

const updateUserPasswordSchema = {
    newPassword: {
        presence: true,
        length: {
            minimum: 4, //TODO: change back to 8
            message: "Password must be at least 8 characters long"
        },
    },
    passwordConfirmation: {
        presence: true,
    },
};

export { updateUserPasswordSchema, IUpdateUserPasswordBody };

