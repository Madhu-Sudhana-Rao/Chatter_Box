import { axiosInstance } from "./axios";

// ✅ Signup
export const signup = async (signupData) => {
    const response = await axiosInstance.post("/auth/signup", signupData);
    return response.data;
};

// ✅ Login
export const login = async (loginData) => {
    const response = await axiosInstance.post("/auth/login", loginData);
    return response.data;
};

// ✅ Logout
export const logout = async () => {
    const response = await axiosInstance.post("/auth/logout");
    return response.data;
};

// ✅ Get Authenticated User
export const getAuthUser = async () => {
    try {
        const response = await axiosInstance.get("/auth/me");
        return response.data.user;
    } catch (error) {
        console.log("Error in getAuthUser:", error);
        return null;
    }
};

// ✅ Complete Onboarding
export const completeOnboarding = async (userData) => {
    const response = await axiosInstance.post("/auth/onboard", userData);
    return response.data.user;
};



// ==============================
// ✅ FRIENDSHIP RELATED APIs
// ==============================

// ✅ Get Your Friends
export const getUserFriends = async () => {
    const response = await axiosInstance.get("/users/friends");
    return response.data;
};

// ✅ Get Recommended Users
export const getRecommendedUsers = async () => {
    const response = await axiosInstance.get("/users");
    return response.data;
};

// ✅ Get Outgoing Friend Requests (Requests you sent)
export const getOutgoingFriendReqs = async () => {
    const response = await axiosInstance.get("/users/outgoing-friend-requests");
    return response.data;
};

// ✅ Get Incoming Friend Requests (Requests you received)
export const getFriendRequests = async () => {
    const response = await axiosInstance.get("/users/friend-requests");
    return response.data;
};

// ✅ Send a Friend Request
export const sendFriendRequest = async (userId) => {
    const response = await axiosInstance.post(`/users/friend-request/${userId}`);
    return response.data;
};

// ✅ Accept a Friend Request
export const acceptFriendRequest = async (requestId) => {
    const response = await axiosInstance.put(`/users/friend-request/${requestId}/accept`);
    return response.data;
};

// ✅ Reject a Friend Request
export const rejectFriendRequest = async (requestId) => {
    const response = await axiosInstance.put(`/users/friend-request/${requestId}/reject`);
    return response.data;
};



// ==============================
// ✅ CHAT RELATED APIs
// ==============================

// ✅ Get Chat Stream Token
export const getStreamToken = async () => {
    const response = await axiosInstance.get("/chat/token");
    return response.data;
};
