const AWS = require("aws-sdk");
require("dotenv/config");
class ProductService {
  dynamoDB;
  tableName = "products";

  constructor() {
    this.products = [];
    // config AWS
    AWS.config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });
    this.dynamoDB = new AWS.DynamoDB.DocumentClient();
  }

  async addproduct(id, name, quantity) {
    const params = {
      TableName: this.tableName,
      Item: {
        id: id,
        name: name,
        quantity,
      },
    };
    const data = await this.dynamoDB.put(params).promise();
    return { id: id, name: name };
  }

  async deleteProduct(id) {
    const params = {
      TableName: this.tableName,
      Key: {
        id,
      },
    };
    return await this.dynamoDB.delete(params).promise();
  }
  async getproducts() {
    const params = {
      TableName: this.tableName,
    };
    const data = await this.dynamoDB.scan(params).promise();
    return data.Items;
  }
}
module.exports = new ProductService();
