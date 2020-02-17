Get Started
=====================

### Project Structure 
```text
peppa
├── configuration
│   └── Main
│       ├── ui.json
│       ├── another.ui.json
│       └── ServiceA
│           ├── Main_XXXXCommand.json
│           └── xxxx.json
├── docs/
├── mock
│   └── data
|       ├── Main_XXXXCommand.json
│       └── xxxx.json
├── tools
│   └── Peppa/
└── ui/
    └── src
        └── assets
            └── application.json
            └── commands.json
```

As above:

* `configuration` used to save source command defintions and ui definitions.
* `mock/data` used to define mock data for command response.
* `tools/Peppa` Peppa client
* `ui` Angular web app
* `application.json` UI definitions exported by Peppe client
* `commands.json` Command definitions exported by Peppe client

### Start Peppa Client

```bash
npm install
npm run ng:start // start ui
npm run electron:start:serve // start client with developer tools
```

### Start UI web app with SSL
```bash
# for Mac/Linux
npm install
npm run starts

# for Windows
npm install
npm run startsw 

```

### Build UI
Run below command to build a production UI package which will be placed in `ui/dist/quick-app`, please go to offical angular site for more details about this deployment.

> Please DON'T forget to update the endpoint in `ui/dist/quick-app/assets/global.config.json` 

```bash
npm install
npm build
```