# ember-deploy-rest-index

This [ember-cli-deploy](https://github.com/ember-cli/ember-cli-deploy) index adapter uses HTTP REST commands to handle all operations pertaining to the index.html deploy process. The server is, therefore, responsible for managing index.html revisions.

## Purpose

This adapter is intended for those who have an existing REST API and would like to leverage it to manage their index.html revisions. It is ideal for internal system environments (not in the cloud) or in the case that adding additional components such as a NoSQL is prohibitive. For such environments, this adapter will enable the usage of the existing infrastructure to accommodate, still, a **Lightning Fast Deployments** process.

## To use
`npm install ember-deploy-rest-index`

## Commands

The adapter implements the following commands as per the `ember-cli-deploy` interface:

* `deploy` - Makes a POST to upload the index.html information with the following payload:  
  * The revision id
  * The entirety of the index.html file  


* `deploy:list` - Makes a GET call to get all uploaded revisions
* `deploy:activate` - Makes a PUT call to activate the specified revisions

## Config

Sample config in your deploy.js file:
```
store: {
  type: 'REST',
  serviceHost: 'http://leojh.com',
  serviceNamespace: 'api',
  serviceIndexVersionResource: 'ember-revisions'
}

```
* `type` - Must be 'REST' to use this adapter
* `serviceHost` - the root URL for the service
* `serviceNamespace` - path to the service
* `serviceIndexVersionResource` - the name of your resource responsible for handling your revisions

The combination of config settings will help construct the target URLs for calling your service. For example, given the config above, the `deploy:list` command will result in: `GET http://leojh.com/api/ember-revisions`

## TODOs:

1. Authentication header
2. Cleanup of old revisions
2. Tests (I know, they should come first)
3. Multipart?
4. A REST adapter for assets?
