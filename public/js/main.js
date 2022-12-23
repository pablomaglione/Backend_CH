const socket = io();

const productsContainer = document.getElementById("table-products");
const createProdForm = document.getElementById("create-product-form");

socket.on("products", (products) => {
  const allProducts = products
    .map(
      (product) => `
    <tr>
        <td>${product.code}</td>
        <td>${product.title}</td>
        <td>${product.description}</td>
        <td>${product.price}</td>
        <td>${product.stock}</td>
        <td>${product.category}</td>
        <td><img height="50px" width="50px" src=${product.thumbnail} /></td>
    </tr>
        `
    )
    .join(" ");

  productsContainer.innerHTML = allProducts;
});

createProdForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(createProdForm);

  const product = {};

  for (const field of formData.entries()) {
    product[field[0]] = field[1];
  }

  const resp = await fetch('/api/products',{
    body: JSON.stringify(product),
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const respJson = await resp.json();
  console.log(respJson);
  //socket.emit("addProducts", product);
 
});
