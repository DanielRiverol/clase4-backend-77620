import { Router } from "express";

const router = Router();
let books = [
  { id: "1001", title: "El Señor de los Anillos", author: "J.R.R. Tolkien" },
  { id: "2002", title: "It (Eso)", author: "Stephen King" },
  { id: "3003", title: "Los tres mosqueteros", author: "Alejandro Dumas" },
];
const ID_REGEX = /^[0-9]{4,6}$/;
router.get("/", (req, res) => {
  res.send(books);
});
// router.get("/:id", (req, res) => {
//   const { id } = req.params;
//   if (!ID_REGEX.test(id)) {
//     return res
//       .status(400)
//       .json({ error: "Formato de id invalido, Debe ser de 4 a 6 digitos" });
//   }
//   const book = books.find((book) => book.id === id);
//   if (!book) {
//     return res.status(404).json({ error: "Libro no encontrado" });
//   }
//   res.send(book);
// });
// router.put("/:id", (req, res) => {
//   const { id } = req.params;
//   if (!ID_REGEX.test(id)) {
//     return res
//       .status(400)
//       .json({ error: "Formato de id invalido, Debe ser de 4 a 6 digitos" });
//   }
//   const book = books.find((book) => book.id === id);
//   if (!book) {
//     return res.status(404).json({ error: "Libro no encontrado" });
//   }

//   //   Logica de actulizar

//   // respouesta
//   res.send(book);
// });

// router param
router.param("id", (req, res, next, id) => {
  if (!ID_REGEX.test(id)) {
    return res
      .status(400)
      .json({ error: "Formato de id invalido, Debe ser de 4 a 6 digitos" });
  }
  const book = books.find((book) => book.id === id);
  if (!book) {
    return res.status(404).json({ error: "Libro no encontrado" });
  }
  req.book = book;
  next();
});

// rouert avanzado\

router
  .route("/:id")
  .get((req, res) => {
    res.status(200).json({ message: "libro encontrado", payload: req.book });
  })
  .put((req, res) => {
    const { title } = req.body;
    const bookFound = req.book;
    // logica de la actualizacion
  })
  .delete((req, res) => {
    // logica de la elminacion
    const bookFound = req.book;
    const books = books.filter((b) => b.id !== bookFound.id);
    res.json({ message: "Libro eliminado", payload: books });
  });
export default router;
