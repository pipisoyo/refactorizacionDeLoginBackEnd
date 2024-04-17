import userModel from '../models/users.js';

export default class usersManager {

    addUsers = async (email, newUser) => {

        let result = await userModel.find({ email: email }).limit(limit).lean();

        if (!result) {
            result = await userModel.create(newUser)
        } else {
            return error

        }
    }
}