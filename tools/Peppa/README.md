# PeppaStudio

This is a electron based application for OnDemand Group Management
 
 ### Development
 1. Clone repo
 2. Install deps
 3. Run commands:

  ```js
 npm run ng:start
 npm run electron:start:serve
 ```
 
 ### Build and release
 
 Try to run 
 
 ```js
npm run electron:build
```

The app will be build to `/release` folder,  update load below files to blob

* Peppa Studio Setup 0.0.2.exe
* Peppa Studio Setup 0.0.2.exe.blockmap
* latest.yml


### Azure Blob
Resource Group: odgm-dev-peppa-studio
blob: https://odgmpeppastudio.blob.core.windows.net/peppa-studio-releases
