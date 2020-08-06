import { Request, Response } from 'express';

import { container } from 'tsyringe';
import CreateProductService from '@modules/products/services/CreateProductService';

export default class ProductsController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { name, price, quantity } = req.body;

    const createProduct = container.resolve(CreateProductService);
    const product = await createProduct.execute({ name, price, quantity });

    return res.json(product);
  }
}
