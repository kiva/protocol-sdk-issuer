# Bundling

## Creating static variables

The SDK relies on certain variables in order to run, but the value of these variables change based on environment. Rather than try to maintain multiple `.env` files or try to determine values at run-time, we use build-time scripts in order to generate static files.

### ActionBuilder.js
This script returns an object that defines strings to be received in a cross-window message event, as well as the object that will be used to update the internal state of the application.

### MessageBuilder.js
This script translates strings and creates a flat key-value map that will be used by the [I18n utility](https://github.com/kiva/protocol-sdk-verifier/blob/master/src/ui/utils/I18n.ts).

You can read more about translations in the [language directory](https://github.com/kiva/protocol-sdk-verifier/tree/master/tools/language).

### ColorBuilder.js
This creates a SCSS file that defines mixins that are used throughout the application. The defaults are these, [but they can be overridden in the configuration file used for a specific build](https://github.com/kiva/protocol-sdk-verifier/tree/master/config#colorMap).

```
$primary-color: #24778b;
$primary-offset: white;
$secondary-color: #e7e7e7;
$secondary-offset: #333;
$error-color: #b65f57;
$error-offset: white;
$warning-color: #fff625;
$warning-offset: #000;
```

### ConstantBuilder.js
This converts configuration keys in [the configuration JSON file](https://github.com/kiva/protocol-sdk-verifier/tree/master/config) into Typescript variables.

### ImageConverter.js
This creates Base64 strings out of the images found in `./public/images`.

### static_file_generator
This file accepts an environment type and passes it to `Build.js` in order to build files out of the data defined in the scripts outlined above.

## Creating a bundle
### create_bundle
This script accepts two parameters.

One is an environment name: either `--prod`, `--sandbox` or `--dev`. These will be used to set the value passed to the `static_file_generator` script, and then to the `Build.js` script. If this option isn't provided, the default value for the environment is `qa`.

The second is a string that is a path to a configuration JSON file. You can [read more about configuration files here](https://github.com/kiva/protocol-sdk-verifier/tree/master/config).

### Changing configuration files for development
When running `npm run start` to start the application locally, you can change which configuration file you're pointing to by setting a new value for the `$CONF_FILE` environment variable on your local machine.