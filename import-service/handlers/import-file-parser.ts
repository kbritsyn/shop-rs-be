import { S3Handler } from 'aws-lambda';
import { S3, SQS } from 'aws-sdk';
import * as csv from 'csv-parser';
import { BUCKET_NAME, REGION, SQS_URL } from '../constants';


export const importFileParser: S3Handler = async (event) => {
    console.log('Lambda invocation with event: ', event);

    try {
        const s3 = new S3({ region: REGION, signatureVersion: 'v4' });
        const sqs = new SQS({ region: REGION });

        const eventCompletionPromises = event.Records.map(async record => {
            const fileName = record.s3.object.key;

            const s3Stream = s3.getObject({
                Bucket: BUCKET_NAME,
                Key: fileName
            }).createReadStream();

            console.log(`Processed data from ${fileName}:`);

            return new Promise<void>((resolve, reject) => {
                s3Stream.pipe(csv())
                    .on('data', data => {
                        sendMessage(sqs, data);
                    })
                    .on('error', error => {
                        console.log(error.message);
                        reject(error);
                    })
                    .on('end', async () => {
                        await onStreamEnd(s3, fileName);
                        resolve();
                    });
            });
        });

        await Promise.all(eventCompletionPromises);

    } catch (error) {
        console.log(error);
    }
};

function sendMessage(sqs: SQS, data: any) {
    console.log(SQS_URL);

    sqs.sendMessage({
      MessageBody: JSON.stringify(data),
      QueueUrl: SQS_URL!
    }, error => {
      if (error) {
        console.log('Failed to send SQS message: ', error);
      }
      console.log('Message sent');
    });
  }

async function onStreamEnd(s3: S3, fileName: string) {
    console.log('Data end');

    await s3.copyObject({
        Bucket: BUCKET_NAME,
        CopySource: `${BUCKET_NAME}/${fileName}`,
        Key: fileName.replace('uploaded', 'parsed')
    }).promise();

    await s3.deleteObject({
        Bucket: BUCKET_NAME,
        Key: fileName
    }).promise();

    console.log(`Object was moved into 'parsed' folder`);
}
