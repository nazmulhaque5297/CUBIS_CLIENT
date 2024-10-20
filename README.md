## create module

Run `ng generate module modules/accounting --route modules/accounting --module app.module` for a dev server. Official document `https://angular.io/guide/lazy-loading-ngmodules`. To lazy load Angular modules, use loadChildren (instead of component) in your AppRoutingModule routes configuration as follows.



1. ngrx 
ng g store State --root --module app.module.ts


for create new Store 
ng g action actions/User 
ng g reducer reducers/User --reducers reducers/index.ts
ng g selector selector/User
ng g effect effects/User --root -m app.module.ts
