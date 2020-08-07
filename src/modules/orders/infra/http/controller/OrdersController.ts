import { Request, Response } from 'express';

import { container } from 'tsyringe';

import CreateOrderService from '@modules/orders/services/CreateOrderService';
import FindOrderService from '@modules/orders/services/FindOrderService';

export default class OrdersController {
  public async show(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    const findOrder = container.resolve(FindOrderService);

    const order = await findOrder.execute({ id });

    return res.json(order);
  }

  public async create(req: Request, res: Response): Promise<Response> {
    const { customer_id, products } = req.body;

    const createOrder = container.resolve(CreateOrderService);
    const { customer, order_products, ...order } = await createOrder.execute({
      customer_id,
      products,
    });

    return res.json({
      customer,
      order_products,
      ...order,
    });
  }
}
