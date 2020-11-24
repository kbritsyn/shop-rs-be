import type { Serverless } from 'serverless/aws';

const serverlessConfiguration: Serverless = {
  service: {
    name: 'product-service',
    // app and org for use with dashboard.serverless.com
    // app: your-app-name,
    // org: your-org-name,
  },
  frameworkVersion: '2',
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
      SNS_ARN: {
        Ref: 'SNSTopic'
      }
    },
    region: 'eu-west-1',
    stage: 'dev',
    iamRoleStatements: [{
      Effect: 'Allow',
      Action: 'sqs:*',
      Resource: {
        "Fn::GetAtt": ["SQSQueue", "Arn"]
      }
    }, {
      Effect: 'Allow',
      Action: 'sns:*',
      Resource: {
        Ref: 'SNSTopic'
      }
    }]
  },
  resources: {
    Resources: {
      SQSQueue: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName: 'product-service-queue'
        }
      },
      SNSTopic: {
        Type: 'AWS::SNS::Topic',
        Properties: {
          TopicName: 'product-service-topic'
        }
      },
      SNSSubscription: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Endpoint: 'kiril.britsyn@gmail.com',
          Protocol: 'email',
          TopicArn: {
            Ref: 'SNSTopic'
          }
        }
      }
    },
    Outputs: {
      SQSUrl: {
        Value: {
          "Ref": "SQSQueue"
        }
      },
      SQSArn: {
        Value: {
          "Fn::GetAtt": ["SQSQueue", "Arn"]
        }
      }
    }
  },
  functions: {
    getAllProducts: {
      handler: 'handler.getAllProducts',
      events: [
        {
          http: {
            method: 'get',
            path: 'products',
            cors: true
          }
        }
      ]
    },
    getProductById: {
      handler: 'handler.getProductById',
      events: [
        {
          http: {
            method: 'get',
            path: 'products/{productId}',
            request: {
              parameters: {
                paths: {
                  productId: true
                }
              }
            }
          }
        }
      ]
    },
    createProduct: {
      handler: 'handler.createProduct',
      events: [
        {
          http: {
            method: 'post',
            path: 'products',
            cors: true
          }
        }
      ]
    },
    catalogBatchProcess: {
      handler: 'handler.catalogBatchProcess',
      events: [{
        sqs: {
          batchSize: 5,
          arn: {
            "Fn::GetAtt": ["SQSQueue", "Arn"]
          }
        }
      }]
    }
  }
}

module.exports = serverlessConfiguration;
