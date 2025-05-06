import { PassedInitialConfig } from 'angular-auth-oidc-client';

export const authConfig: PassedInitialConfig = {
  config: {
            authority: 'https://us-east-1stxgyc1au.auth.us-east-1.amazoncognito.com',
            redirectUrl: 'https://d84l1y8p4kdic.cloudfront.net',
            postLogoutRedirectUri: window.location.origin,
            clientId: '6eqo95v4ia4d19lbmnav8e1u9d',
            scope: 'phone openid email',
            responseType: 'code',
            silentRenew: false,
            renewTimeBeforeTokenExpiresInSeconds: 10,
        }
}
