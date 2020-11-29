import type { Serverless } from 'serverless/aws';

const serverlessConfiguration: Serverless = {
  service: {
    name: 'import-service',
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
      SQS_URL: '${cf.eu-west-1:product-service-dev.SQSUrl}'
    },
    region: 'eu-west-1',
    stage: 'dev',
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: 's3:ListBucket',
        Resource: 'arn:aws:s3:::rs-image-host'
      },
      {
        Effect: 'Allow',
        Action: 's3:*',
        Resource: 'arn:aws:s3:::rs-image-host/*'
      }, {
        Effect: 'Allow',
        Action: 'sqs:*',
        Resource: ['${cf:product-service-dev.SQSArn}']
      }
    ]
  },
  resources: {
    Resources: {
      GatewayResponse: {
        Type: 'AWS::ApiGateway::GatewayResponse',
        Properties: {
          ResponseType: 'ACCESS_DENIED',
          RestApiId: { Ref: 'ApiGatewayRestApi' },
          ResponseParameters: {
            'gatewayresponse.header.Access-Control-Allow-Origin': `'*'`,
            'gatewayresponse.header.Access-Control-Allow-Headers': `'*'`,
          }
        }
      },
      GatewayResponseUnauthorized: {
        Type: 'AWS::ApiGateway::GatewayResponse',
        Properties: {
          ResponseType: 'UNAUTHORIZED',
          RestApiId: { Ref: 'ApiGatewayRestApi' },
          ResponseParameters: {
            'gatewayresponse.header.Access-Control-Allow-Origin': `'*'`,
            'gatewayresponse.header.Access-Control-Allow-Headers': `'*'`,
          }
        }
      }
    }
  },
  functions: {
    importProductsFile: {
      handler: 'handler.importProductsFile',
      events: [{
        http: {
          method: 'get',
          path: 'import',
          cors: true,
          authorizer: {
            name: 'tokenAuthorizer',
            arn: '${cf.eu-west-1:authorization-service-dev.basicAuthorizerArn}',
            type: 'token',
            resultTtlInSeconds: 0,
            identitySource: 'method.request.header.Authorization'
          },
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
          bucket: 'rs-image-host',
          event: 's3:ObjectCreated:*',
          rules: [{
            prefix: 'uploaded/',
            suffix: ''
          }],
          existing: true
        }
      }]
    }
  }
}

module.exports = serverlessConfiguration;
