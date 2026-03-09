import userModels from "../models/userModels.js";

const checkAuth = async (id) => {
    try {
        const user = await userModels.findById(id).select("-password");
        return user;
    } catch (error) {
        console.error(error);
    }
}


export default checkAuth;