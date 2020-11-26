const toDTO = (raw: any) => {
    return {
        userId: raw.userId,
        username: raw.username,
        avatar: raw.avatar,
        email: raw.email,
        netcode: raw.netcode,
        dateJoined: raw.date_joined,
        matchIds: raw.matchConnection ? raw.matchConnection.map((val) => val.matchId) : [],
    };
};

export { toDTO };