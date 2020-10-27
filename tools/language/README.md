# Translations

## How It Works
Because we want the SDK to be as lightweight as possible, we try to avoid importing libraries that we don't need.

While we do need the SDK to support internationalization, the SDK typically does not work with dynamic data, so the text used in the application is mostly static.

Given this, we have created a system to leverage the [i18next](https://www.i18next.com) package in order to create a map of translated keys at build time. This allows us to use `i18next`'s fallback handling to avoid duplicating files, while still allowing us to avoid adding bytes to our production bundle.

### Translation files
The names of our translation directories begin with a lowercase language code (`en` for English, `es` for Spanish, `ar` for Arabic, etc.) followed by a `-` and then an uppercase country code (such as `SL` for Sierra Leone).

We allow additional keys to be appended to the name as long as the keys are separated by a `-`. We will build translations by first searching for the directory that matches a code exactly, then popping elements off the string and searching for directories whose name matches the truncated string.

For example, if we wanted to build translations for `en-UK-Hogwarts`, we would:

1. Try to find `en-UK-Hogwarts/default.json`
2. Then try to find `en-UK/default.json`
3. Then find `en/default.json`
4. Then find `dev/default.json`

For each search, we will process the keys in the file found [using our MessageBuilder script](https://github.com/kiva/Protocol-EKYC-SDK/tree/master/tools/bundle) and attach them to a shorter key to create a flat map of keys to translations, and then publish those to `./src/constants/translations.json`.

### How we use translations
We have built [a util file called `I18n`](https://github.com/kiva/Protocol-EKYC-SDK/blob/master/src/ui/utils/I18n.ts). This class consumes the short keys that are used in our translations JSON file and prints out the corresponding value using the `getKey()` method.

```
I18n.getKey('UKNOWN_ERROR'); // prints "An unknown error occurred."
```

We also have the option of interpolating strings using the `computeKey()` method.

```
INPUT_LENGTH_ERROR: "Input must be between {{minimum}} and {{maximum}} characters"

I18n.computeKey({
    minimum: 1,
    maximum: 50
}, 'INPUT_LENGTH_ERROR'); // prints "Input must be between 1 and 50 characters"
```