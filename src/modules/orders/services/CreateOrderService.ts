import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import Order from '../infra/typeorm/entities/Order';
import IOrdersRepository from '../repositories/IOrdersRepository';

interface IProduct {
  id: string;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}

interface IFindProduct {
  id: string;
}

@injectable()
class CreateOrderService {
  constructor(
    @inject('OrdersRepository') private ordersRepository: IOrdersRepository,
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) { } // eslint-disable-line

  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    const foundCustomer = await this.customersRepository.findById(customer_id);

    if (!foundCustomer) {
      throw new AppError('Could not find customer');
    }

    const iFindProductsList = products.map<IFindProduct>(product => ({
      id: product.id,
    }));

    const productsList = await this.productsRepository.findAllById(
      iFindProductsList,
    );

    if (productsList.length !== products.length) {
      throw new AppError('Invalid product in the list.');
    }

    const insuficientProductQuantity = productsList.find(
      ({ quantity: product_quantity }) =>
        products.find(
          ({ quantity: request_product_quantity }) =>
            request_product_quantity > product_quantity,
        ),
    );

    if (insuficientProductQuantity) {
      throw new AppError('Insuficient product quantity.');
    }

    const orders_product = productsList.map((product, product_index) => ({
      product_id: product.id,
      price: product.price,
      quantity: products[product_index].quantity,
    }));

    await this.productsRepository.updateQuantity(products);

    const order = await this.ordersRepository.create({
      customer: { ...foundCustomer },
      products: [...orders_product],
    });

    return order;
  }
}

export default CreateOrderService;
