import { SQSEvent, SQSHandler } from 'aws-lambda';
import { SNS } from 'aws-sdk';
import { insertProduct } from '../database/insert-product';
import { Product } from '../database/product.model';

const sns = new SNS({ region: 'eu-west-1' });

export const catalogBatchProcess: SQSHandler = async (event: SQSEvent): Promise<void> => {
    console.log('Lambda invocation with event: ', event);

    
    const products: Product[] = event.Records.map(({ body }) => JSON.parse(body));
    

    try {
        const res = await Promise.all(products.map(async (product) => insertProduct(product)));
        console.log(res);
        console.log('Products were saved to database');

        await publishNotification(products);
        console.log('Notification sent');
    } catch (error) {
        console.log('Error in batch processing: ', error);
    }
}

function publishNotification(products: Product[]) {
    return sns.publish({
        TopicArn: process.env.SNS_ARN,
        Subject: 'New products have been added',
        Message: JSON.stringify(products)
    }).promise();
}