# Esendex Push

This is a consumer proof of concept implementation of the [Esendex Push Notifications](http://developers.esendex.com/APIs/Push-Notifications) in NodeJS.
It was written to be hosted on the [Red Hat OpenShift](https://www.openshift.com/) platform but can be modified easily to host on other platforms such as [heroku](https://www.heroku.com) with little effort.

### Example App
This app is currently hosted at [push-codesleuth.rhcloud.com](http://push-codesleuth.rhcloud.com). This will echo all push notifications to the client, regardless of which account, and therefore you may see push notifications for other users who are on the site at the same time. I hope to change this very soon to limit the pushes by account ID, so bear with it!

### Setting Up
Clone the repository and install the dependency modules with:
```
npm install
```

### Tests
The tests can be run with npm by first installing the dev dependencies and then running the npm test suite with mocha. This has been added to the package as a test script which means you can run the following:
```
npm test
```

You may have to first install `mocha` into the global scope with:
```
npm install -g mocha
```

### OpenShift
The OpenShift `nodejs` cartridge documentation can be found at:

https://github.com/openshift/origin-server/tree/master/cartridges/openshift-origin-cartridge-nodejs/README.md
