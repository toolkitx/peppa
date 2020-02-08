# Peppa UI render  grammer
# Get values
## $query(key)
Get value from query string, for example:
```js
// Current location: http://your-url?id=ID_STRING
$query(id) === 'ID_STRING';
```
## $fragment(key)
Get value from fragment.
```js
// Current location: http://your-url#id_token=ID_TOKEN&state=1111
$fragment(id_token) === 'ID_TOKEN';
$fragment(state) === '1111';

```
## $cache(key)
Get value from local cache.
Built-in cache

| KEY | Data Type| 
|----- |---------|
| CACHE_KEY_CURRENT_REGION_NAME | `string`| 
| CACHE_KEY_AUTH_TOKEN | `string`| 
| CACHE_KEY_ORGANIZATION_ID | `string`| 
| CACHE_KEY_DIRECTORY_ID | `string`| 
| CACHE_KEY_USER_SESSION | `{exp;principalId;domainName;organizationId;directoryId;name;email;securityRole;aud;}`| 

## $location(view_name)
Return router of view.
```js
$location(home) === 'http://your-url/display/home'
```

## $value
Current value, use in **form** or **input**.
```js
// current value 
$value === {id: '1', name: 'test'}
$value === 'cat 2'
```
~~Return property key of $value, **NOT SUPPORTED**.~~

```js
// current value {id: '1', name: 'test'}
// Current used in Oauth and register widget, consider to use $form or $context instead
$value(id) === '1'
```

## $form 
The form object of current form, only available in `CustomForm` widget.

```js
// Reture property of form object
// Will also subscribe the changes of this categoryId
// Should handle this kind of sentences in CustomFormControlWidget
$form(categoryId)
```

## $context
Get current context, current this only works in Popup views.

* Popup a delete confirm view of specified row in table widget, the context will be the current row object
* Popup a action view of a action, the context will be selected state or current object.

Also support `$context(key)` to get specified property of context.

Special context attributes

| Widget | Actions | 
| ------ |---------|
| Table (widget level actions)  |  `$filter`, `$selectedIds` |
| CustomForm  |  The $context will be current object when updating an object. <br/> `$context` = `{[objectProperty]: value, [extendProperty]: value}` |


# Do Actions

## $view(view, {params}?)
Navigate to the specified view
###  View Name
```js
$view(categories) // navigate to `/display/categories`
```
### View with params
```js
$view(categories, {id: '1'}) // navigate to `/display/categories?id=1`
```

## $popup(view, {result_actions}?)
Popup views, and handle callback, each popup views should return results.

For example, delete a category from table widget, the table widget support
```js
// Popup `delete-category` view
// this view contains two type of result: [ok, cancel]
// $context will be the object of selected row
$popup(delete-category, {ok: 'reload'})

```
> Should determine specific callback based on specific components.
>
> | Widget | Actions | 
> | ------ |---------|
> | Table  |  reload |


# Peppa Query Language (PQL)


A simple query in PQL consists of a field, followed by an operator, followed by one or more values or functions. 
A query has three basic parts: fields, operators, and values.

```
Field - Operator - Value
```

* *Field* – Fields are different types of information in the system. Jira fields include priority, fixVersion, issue type, etc.
* *Operator* – Operators are the heart of the query. They relate the field to the value. Common operators include equals (=), in (in), etc.
* *Value* – Values are the actual data in the query. They are usually the item for which we are looking.

For example:
```
 name = "TEST"
```
```
 state != "Pending"
```
```
 name ~ "TEST" AND categoryId = "xxxx-xxxx-xxx"
```
More complex queries might look like these:

```
name = "TEST" AND privacy in ("Private", "Public")
```
```
name = "TEST" AND count between (10, 30)
```
```
name = "TEST" AND created between (null, 1567731749485)
```

## Query

| Description | Reference | 
| ------ |---------|
| Operators  |  `EQUALS(=)`, `NOT EQUALS(!=)`, `IN(in)`, `CONTAINS(~)`, `BETWEEN(between)`|
| Keywords  |  `AND`|

UI will convert PQL to object array as below:
```js
[
    {field: "name", operator: "=", value: "TEST"},
    {field: "state", operator: "!=", value: "Pending"},
    {field: "categoryId", operator: "=", value: "xxxx-xxxx-xxx"},
    {field: "privacy", operator: "in", value: ["Private", "Public"]},
    {field: "count", operator: "between", value: ["10", "30"]},
    {field: "created", operator: "between", value: ["", "1567731749485"]} // null will be converted to empty string
]
```

## Condition Programing
Below are operators are used to do some condition programing.

| Description | Reference | 
| ------ |---------|
| Operators  |  `IS`, `IS NOT`, `GREATER THAN(>)`, `GREATER THAN EQUALS(>=)`, `LESS THAN(<)`, `LESS THAN EQUALS(<=)`|
| Keywords  |  `AND`|

>
> xxx IS "a"
> xxx IS EMPTY
>
> xxx IS NULL
>
> The "IS NOT" operator can only be used with EMPTY or NULL
>
> xxx IS NOT EMPTY
>
> xxx IS NOT NULL
>


