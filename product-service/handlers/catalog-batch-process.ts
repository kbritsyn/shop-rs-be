import { ProductDTO } from './../product.model';
import { SQSEvent, SQSHandler } from 'aws-lambda';
import { SNS } from 'aws-sdk';
import { insertProduct } from '../db/insert-product';

export const catalogBatchProcess: SQSHandler = (event: SQSEvent): void => {
  console.log('Lambda invocation with event: ', event);

  const sns = new SNS({ region: 'eu-west-1' });
  const products: ProductDTO[] = event.Records.map(({ body }) => JSON.parse(body));

  try {
    products.forEach(async (p) => {
      await insertProduct(p);
    });
    publishNotification(sns, products);
  } catch (error) {
    console.error('Error in batch processing: ', error);
  }
}

function publishNotification(sns: SNS, products: ProductDTO[]) {
  sns.publish({
    TopicArn: process.env.SNS_ARN,
    Subject: 'New products have been added',
    Message: JSON.stringify(products)
  }, err => {
    if (err) {
      console.error('Failed to send SNS notification: ', err);
      return;
    }
    console.log('Notification sent');
  });
}
