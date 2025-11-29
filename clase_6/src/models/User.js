import users from "../database/db.js";

class User {
  constructor(email, pass) {
    this.email = email;
    this.pass = pass;
  }
  getUsers = () => {
    return users;
  };

  createUser =({email,pass})=>{
    const newUser = {}
    users.push()
  }

}

export default User;
