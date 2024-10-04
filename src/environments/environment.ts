// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

// For Local 
export const environment = {
  production: false,
  PROTOCOL: 'http',
  PRODUCT_NAME: 'Golden Ace Food',
  // FOR IAMGE PATH
  IAMGE_PATH: '',
  // FOR API's
  //  baseURL: '45.8.148.212:8040',
  // baseURL: '192.168.0.102:8025',
  // ROOT_URL: 'localhost', // LOCAL
  baseURL: '45.8.148.212:8025/', // PROD LINK
  ROOT_URL: '45.8.148.212:8080', // ADD PRDO

};