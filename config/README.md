# Configurations in Depth

## Why?
The SDK uses [`create-react-app`](https://create-react-app.dev) in order to create optimized production builds for production. By default, the package only supports `development` and `production` as environment definition flags.

Rather than use other environment variables to control values that should be tied to environment definition and maintaining multiple `.env` files, we have decided to create configuration files that contain some definitions that apply to all environments, as well as values that only apply to specific environments.

This allows us to modify just one file when we need to make changes and makes it easy to control inheritance between environments.

## Environment-specific variables
### `token`
Bearer token required to authenticate the backend API.

### `ekycURI`
This the URL that will be used to make backend requests.

### `permittedOrigins`
The SDK uses cross-window messaging as part of its business logic to set state for certain components. The `permittedOrigins` string is a comma-separated list of origins whose MessageEvents will be honored.

### `actions`
Rather than adjusting internal state of components based on an object sent as part of a cross-window message, the SDK has a pre-defined list of strings that correspond to `setState` parameters. You can see this list in the [ActionBuilder.js file](https://github.com/kiva/Protocol-EKYC-SDK/blob/master/tools/bundle/ActionBuilder.js).

If you define an `actions` object, you can limit which strings will be honored in the MessageEvent listener.

### `permittedIframeHosts`
This array is used to add `Content-Security-Policy` and `X-Frame-Options` headers to Firebase host configurations if you're using the [add_firebase_project](https://github.com/kiva/Protocol-EKYC-SDK/blob/master/tools/deploy/add_firebase_project.sh) script to configure a new host.

This is important, because attempting to host the SDK in an iframe on a host that isn't defined in these headers will result in a broken iframe.

### `permittedOriginPatterns`
This key, if defined, allows you to define wildcard patterns in addition to the values defined in `permittedOrigins`.

### `inherits`
This array allows you to define environments whose configurations will be added. Inherited values will not override values defined within an environment.

## Globally scoped variables
### `locale`
This variable controls which translation file is used for populating text fields in the SDK. For certain languages, it can also control the text direction of the app (for example, setting `locale="ar"` will change the class of the `#root` HTML element of the app from `ltr` to `rtl`).

For more information on translations, you can look at the [language directory](https://github.com/kiva/protocol-sdk-verifier/tree/master/tools/language).

### `verification_options`
This array controls which authentication options to enable for a given version of the application. For example, fingerprint scans may not be appropriate for certain customers, and `verification_options` is meant to make it easy to disable this option.

This configuration is an array of `AuthOption` objects, which contain the following keys:

* `id`: A unique ID for the authentication type. This must correspond to a key in `request_attributes`.
* `title`: This is the title text used in the menu for selecting which authentication method to use
* `description`: Descriptive text used in the menu for selecting which authentication method to use
* `guardian`: A boolean to indicate whether the eKYC verification requires a third party in order to succeed, or whether the verification method can (but does not necessarily have to) rely completely on agent-to-agent communication.
* `sequence`: This is an array of IDs that determines the order of navigation for the application. Each ID should have a corresponding React component in the [ScreenDictionary component](https://github.com/kiva/protocol-sdk-verifier/blob/master/src/ui/screens/ScreenDictionary.tsx).

### `pii_map`
This map defines the pieces of PII (Personally Identifiable Information) which will be requested as part of an organization's eKYC verification. ([More information about PII can be found here](https://en.wikipedia.org/wiki/Personal_data))

This is an object which assigns metadata to the values that will be returned from a successful eKYC request, and is used to verify that the backend response is complete and genuine.

* `name`: This value is used for text values throughout the app, especially the Results page and the User Consent page.

### `colorMap`
This allows for defining a color scheme. If this object is undefined, these are the default values that will be added to the application as a SCSS file:

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

You can redefine colors for any color by adding it to the `colorMap` object. Keys that are not included in `colorMap` will use the default color.
