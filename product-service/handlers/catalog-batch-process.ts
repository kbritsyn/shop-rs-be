import { ProductDTO } from './../product.model';
import { SQSEvent, SQSHandler } from 'aws-lambda';
import { SNS } from 'aws-sdk';
import { insertProduct } from '../db/insert-product';

export const catalogBatchProcess: SQSHandler = async (event: SQSEvent): Promise<void> => {
  console.log('Lambda invocation with event: ', event);

  const sns = new SNS({ region: 'eu-west-1' });
  const products: ProductDTO[] = event.Records.map(({ body }) => JSON.parse(body));

  try {
    await Promise.all(products.map(async (product) => insertProduct(product)));
    console.log('Products were saved to database');

    await publishNotification(sns, products);
    console.log('Notification sent');
  } catch (error) {
    console.log('Error in batch processing: ', error);
  }
}

function publishNotification(sns: SNS, products: ProductDTO[]) {
  return sns.publish({
    TopicArn: process.env.SNS_ARN,
    Subject: 'New products have been added',
    Message: JSON.stringify(products)
  }).promise();
}
