import User from '../models/User.js'
const user =new User()

const getUsers = () => {

  return user.getUsers();
};

export default { getUsers };
