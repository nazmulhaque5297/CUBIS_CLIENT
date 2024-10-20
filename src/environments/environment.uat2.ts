// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // baseUrl : "https://cculbdevapi.azurewebsites.net/",
  // reportUrl: 'https://cculbreport.azurewebsites.net/?'
  baseUrl: 'http://103.142.67.219:55774/',
  //baseUrl: 'https://cculbdevapi.azurewebsites.net/',
  // reportUrl: 'http://localhost:59108/?',
  reportUrl: 'http://103.142.67.219:55775//ExecuteReport.aspx?',
  //reportUrl: 'http://localhost:62132//ExecuteReport.aspx?',
  // reportUrl: 'https://cculbreport.azurewebsites.net/?',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
