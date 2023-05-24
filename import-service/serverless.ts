import type { Serverless } from 'serverless/aws';
import { BUCKET_NAME, REGION } from './constants';

const serverlessConfiguration: Serverless = {
  service: 'import-service',
  frameworkVersion: '3',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true
    }
  },
  // Add the serverless-webpack plugin
  plugins: ['serverless-webpack', 'serverless-dotenv-plugin'],
  provider: {
    name: 'aws',
    runtime: 'nodejs12.x',
    apiGateway: {
      minimumCompressionSize: 1024,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      SQS_URL: '${cf.product-service-dev.SQSUrl}'
    },
    region: REGION,
    stage: 'dev',
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: 's3:ListBucket',
        Resource: `arn:aws:s3:::${BUCKET_NAME}`
      },
      {
        Effect: 'Allow',
        Action: 's3:*',
        Resource: `arn:aws:s3:::${BUCKET_NAME}/*`
      }, {
        Effect: 'Allow',
        Action: 'sqs:*',
        Resource: ['${cf:product-service-dev.SQSArn}']
      }
    ]
  },
  functions: {
    importProductsFile: {
      handler: 'handler.importProductsFile',
      events: [{
        http: {
          method: 'get',
          path: 'import',
          cors: true,
          request: {
            parameters: {
              querystrings: {
                name: true
              }
            }
          }
        }
      }]
    },

    importFileParser: {
      handler: 'handler.importFileParser',
      events: [{
        s3: {
          bucket: BUCKET_NAME,
          event: 's3:ObjectCreated:*',
          rules: [{
            prefix: 'uploaded/'
          }],
          existing: true
        }
      }]
    }
  }
}

module.exports = serverlessConfiguration;
