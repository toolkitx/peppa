Intergration
=====================

Peppa only requests one endpoint as below:

```
POST https://your-command-endpoint/{COMMAND NAME}

```

Both request payload and response are optional, all responses should be 

```json
{
    "state": "Completed/OtherState",
    "output": "any objects"
}

```



### Query Data with Paging

The UI only support server side paging, please support below input/output if the command support paging.

Request payload:
``` json
{"skip":0,"take":10,"filter":"{{PQL_STRING}}"}
```

The filter based on [Peppa Query Language(PQL)](../ui/grammar.md#peppa-query-language-pql), click to get more details.

Response:
``` json
{
    "state": "Completed",
    "output": {
        "total": 9,
        "results": [...]
    }
}
```

### Common Example

There is a command definition as below.

```json
{
	"name": "Main_GetAdminConsentUrlCommand",
	"type": "Public",
	"securityRole": "Anonymous",
	"feature": "common",
	"inputSchema": {
		"type": "object",
		"properties": {
			"redirectUrl": {
				"type": "string"
			}
		},
		"required": [
			"redirectUrl"
		]
	},
	"outputSchema": {
		"type": "object",
		"properties": {
			"consentUrl": {
				"type": "string"
			}
		}
	}
}
```

The UI web app will send below request to endpoint:
```bash
POST https://your-command-endpoint/Main_GetAdminConsentUrlCommand

{
    redirectUrl: 'https://web-app-host'
}

```
and expect response
```json
{
    "state": "Completed",
    "output": {
        "consentUrl": "https://consent-url-from-backend"
    }
}
```



