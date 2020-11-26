interface IDeleteUserBody {
    //userId: string;
    passwordConfirmation: string;
};

const deleteUserSchema = {
    /*userId: {
        presence: true,
    },*/
    passwordConfirmation: {
        presence: true,
    }
};

export { deleteUserSchema, IDeleteUserBody };

