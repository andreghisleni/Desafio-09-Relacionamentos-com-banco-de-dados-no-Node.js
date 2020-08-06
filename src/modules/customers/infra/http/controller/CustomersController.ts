import { Request, Response } from 'express';

import CreateCustomerService from '@modules/customers/services/CreateCustomerService';

import { container } from 'tsyringe';

export default class CustomersController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { name, email } = req.body;

    const createCustomer = container.resolve(CreateCustomerService);
    const customer = await createCustomer.execute({ name, email });

    return res.json(customer);
  }
}
