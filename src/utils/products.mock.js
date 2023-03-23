import { faker } from "@faker-js/faker";

faker.locale = "es";

export const generateProducts = () => {
  return {
    _id: faker.database.mongodbObjectId(),
    title: faker.commerce.productName(),
    descripcion: faker.commerce.productDescription(),
    price: faker.commerce.price(),
    code: faker.random.numeric(i),
    status: true,
    stock: faker.random.numeric(i),
    category: faker.commerce.department(),
    thumbail: faker.image.imageUrl(),
  };
};
