import api from "./api";

// Get grouped inbox
export const getInbox = async (category) => {

    const response = await api.get(
        `/messages/inbox?category=${category}`
    );

    return response.data;
};


// Get sender history
export const getInboxHistory = async (
    category,
    senderId,
    page = 1,
    limit = 20
) => {

    const response = await api.get(
        `/messages/inboxhistory?category=${category}&sender=${senderId}&page=${page}&limit=${limit}`
    );

    return response.data;
};