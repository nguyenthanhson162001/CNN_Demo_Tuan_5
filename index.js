const express = require("express");
const app = express();
const port = 3000;
const ProducService = require("./service/ProductService");
require("dotenv/config");

app.set("view engine", "ejs");
app.set("views", "./views");
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());

app.get("/", async (req, res, next) => {
  const products = await ProducService.getproducts();
  console.log(products);
  res.render("index", {
    result: { products: products || [] },
  });
});

app.post("/products/delete/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    if (id) await ProducService.deleteProduct(id);
  } catch (error) {
    console.log(error);
  }
  res.redirect("/");
});

app.post("/products", async (req, res, next) => {
  const { name, id, quantity } = req.body;
  var error = [];

  if (!name || !name.trim()) {
    error.push("name is invalid ");
  }
  if (!quantity || !quantity.trim() || isNaN(quantity)) {
    error.push("quantity is invalid ");
  }

  try {
    error.length == 0 && (await ProducService.addproduct(id, name, quantity));
  } catch (e) {
    error.push(e);
  }

  const result = {};
  if (error.length) result.error = error;

  result.products = await ProducService.getproducts();
  res.render("index", {
    result: result,
  });
});

app.listen(port, () => console.log(`Server start on http://localhost:${port}`));
