// src/app/core/config/aws-exports.ts
const awsConfig = {
  Auth: {
    Cognito: {
      region: 'us-east-1',
      userPoolId: 'us-east-1_AFBRtRa6i',
      userPoolClientId: '194309nda964k3khcloo53p16e',

      loginWith: {
        oauth: {
          domain: 'us-east-1stxgyc1au.auth.us-east-1.amazoncognito.com',
          scope: ['email', 'openid', 'profile'],
          redirectSignIn: ['https://d84l1y8p4kdic.cloudfront.net/'],
          redirectSignOut: ['https://d84l1y8p4kdic.cloudfront.net/'],
          responseType: 'code'
        }
      }
    }
  },
  Storage: {
    S3: {
      region: 'us-east-1',
      bucket: 'plazoleta-pragma',
    }
  }
};

export default awsConfig;
