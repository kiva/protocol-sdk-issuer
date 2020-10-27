# Protocol Issuer
Web SDK to embed SSI credential issuance capabilities in existing applications.

![Build Status](https://github.com/kiva/protocol-sdk-issuer/workflows/build-main/badge.svg)

# Microfrontend application
This module can be embedded as an iframe into your existing application to issue credentials out of the box or used as a standalone credential issuance tool.

## Before You Start
​
This SDK is designed to be flexible enough to accommodate either an Aries agent running locally on your machine, or a cloud agent. If you already have one of these set up, you can skip this section, but if you don't and would still like to try out the platform, keep reading.
​
An easy option for making the SDK work out of the box is to set up the Kiva Aries backend locally. You'll need to [install Docker](https://docs.docker.com/get-docker/), but otherwise you should [be able to follow the steps in our `protocol-demo` repo to get an agent running quickly](https://github.com/kiva/protocol-demo#working-with-protocol-using-aries).
​
## Setting up your config file
​
This SDK relies on a configuration file (you can read more about why that's the case, and how the file is used, [here](https://github.com/kiva/protocol-sdk-verifier/tree/master/config)), and for convenience's sake we've created a [sample config that you can use to get started right away](https://github.com/kiva/protocol-sdk-verifier/tree/master/config/get_started.json).
​
There's plenty of stuff you can do to customize your UI using the config, which you can read about [here](https://github.com/kiva/protocol-sdk-verifier/tree/master/config), but here are the important points for getting started.
​
1. Modify `controllerUrlBase` to use the base URL for whatever endpoint you're using for a Cloud agent. By default, we are using `http://localhost:3014`, because that's the default port that the Kiva cloud agent uses when you're using the backend locally.
2. If you are running a local agent on your machine, you can instead modify the `agent_port` config to point to the localhost port where your agent is running.
​
## Getting Started
​
Ok, at last: How do you actually run this?
​
First step is to install the NPM dependencies, which you can do from the root directory of this repo by running:
​
```
npm install
```
​
Once that's done, you can build and serve a development version of the application using the `get_started` config file by running:
​
```
npm run start
```
​
If you've ever used the `create-react-apps` NPM package, this should feel pretty familiar.
​
Please note that, while the `run start` command uses `get_started.json` by default, you can easily change the configuration file you're using by running the following.
​
```
export CONF_FILE=path/to/your/config.json
```
​
To create an optimized build package, we recommend you run the following command.
​
```
npm run createQaBundle
```
​
To serve the package locally, you can run
​
```
serve -s build
```
