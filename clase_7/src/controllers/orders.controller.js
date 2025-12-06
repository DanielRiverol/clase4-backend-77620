import Order from "../dao/classes/orders.dao.js";
import User from "../dao/classes/users.dao.js";
import Business from "../dao/classes/business.dao.js";
import { v4 as uuid } from "uuid";
const userService = new User();
const businessService = new Business();
const orderService = new Order();

export const getOrders = async (req, res) => {
  try {
    const orders = await orderService.getOrders();
    res.status(200).json({ status: "success", payload: orders });
  } catch (error) {
    return res.status(500).json({ status: "Error", error: error.message });
  }
};
export const getOrderById = async (req, res) => {
  const { oid } = req.params;
  try {
    const order = await orderService.getOrderById(oid);
    res.status(200).json({ status: "success", payload: order });
  } catch (error) {
    return res.status(500).json({ status: "Error", error: error.message });
  }
};
export const createOrder = async (req, res) => {
  const { user, business, products } = req.body;
  try {
    const userFound = await userService.getUserById(user);
    const businessFound = await businessService.getBusinessById(business);
    //traemos los productos que quiero agregar a la orden
    const actualOrders= businessFound.products.filter((prod)=> products.includes(prod.id));
    

    //calcualr el total
    const total = actualOrders.reduce((acc, prod) => acc + prod.price, 0);

    const newOrder= {
      id: uuid(),
      business, 
      user,
      status:"pending",
      products: actualOrders.map((prod)=> prod.id), 
      totalPrice:total
    }

    //Guardamos la orden
    const createdOrder = await orderService.createOrder(newOrder);
//Actualizamos el usuario y el negocio con la nueva orden
userFound.orders.push(createdOrder._id);
await userService.updateUser(userFound._id, userFound);
    res.status(201).json({ status: "success", payload: createdOrder });
  } catch (error) {
    return res.status(500).json({ status: "Error", error: error.message });
  }
};
export const resolveOrder = async (req, res) => {
  res.status(201).json({ status: "success", payload: "ResolveOrder" });
};

