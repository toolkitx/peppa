# Data structure
The structure of the mock must be as below:
```js
/*Success*/
{
    "state": "Completed",
    "output": [YOUR_RESPONSE]
}
```
or 
```js
/*Other states*/
{
    "state": "OTHER STATE",
    "output": [YOUR_RESPONSE]
}
```
# Notes
Based on the architecture, below mock data files are required:

| File  | Description |
|-------|-------------|
|Main_GetModuleInfoCommand.json|UI configurations|
|Main_GetPublicCommandInfosCommand.json| public ommand definitions|

Please be sure that you have the correct mock for them, please use Peppa Studio to re-generate it if you mash it up.

# Mock in Peppa Studio

Start mock server from /data