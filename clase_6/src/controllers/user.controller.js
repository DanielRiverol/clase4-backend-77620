import userService from "../services/user.services.js";
const getUsers = (req, res) => {
  try {
    const users = userService.getUsers();

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "error interno del servidor" });
  }
};

export default { getUsers };
