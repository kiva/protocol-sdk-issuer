const translator = require('@boost/translate');
const fs = require('fs-extra');

const messageMap = {
    // Site specific items
    SITE_TITLE: "DeployKeys.title",
    AUTH_AGENCY: "DeployKeys.authAgency",
    AGENCY_ACRONYM: "DeployKeys.authAgencyAcronym",
    // Default items
    OR: "Standard.or",
    BACK: "Standard.back",
    //TODO: NEXT probably won't hold up in other languages. I'll need to rethink it at some point.
    NEXT: "Standard.next",
    ACCEPT: "Standard.accept",
    POWERED_BY: "Standard.poweredBy",
    SUPPORTED_BY: "Standard.supportedBy",
    SANDBOX_MODE: "Standard.sandboxMode",
    REQUIRED: "Standard.required",
    USE: "Standard.use",
    RECORD: "Standard.record",
    DID_FULL: "Standard.digitalId_full",
    ID_NUMBER: "Standard.idNumber",
    EKYC_ID_NORMAL: "Standard.ekycId_normal",
    VERIFY: "Standard.verify",
    REQ_IN_PROGRESS: "Standard.requestInProgress",
    // Confirmation Screen
    AGREEMENT_1: "ConfirmationScreen.text.agreement-1",
    AGREEMENT_2: "ConfirmationScreen.text.agreement-2",
    INFO_INCLUDES: "ConfirmationScreen.text.infoShareIncludes",
    REVIEW: "ConfirmationScreen.text.pleaseReview",
    // Error Messages
    NO_INVITE_URL: "Errors.qr.noInviteUrl",
    QR_CONNECTION_ERROR: "Errors.qr.connectionError",
    QR_NO_CONNECTION_NOTIFY: "Errors.qr.notConnected",
    QR_NOT_FOUND: "Errors.qr.noConnectionFound",
    // Details Screen
    PLACE_OF_BIRTH: "PII.birthPlace",
    CREDENTIALING_AGENCY: "Details.credentialingAgency",
    // QR Code
    RETRIEVING_QR: "QR.text.retrieving",
    SCAN_QR: "QR.text.scanQR",
    CONNECTION_ESTABLISHED: "QR.text.connected",
    RESET_FLOW: "QR.text.resetConnection",
    CREDENTIAL_ISSUANCE_REQUESTED: "QR.text.credentialIssuanceRequested"
};

class MessageBuilder {
    static init(locale, requiredMessages = false) {
        return new MessageBuilder(locale, MessageBuilder);
    }

    constructor(locale, requiredMessages) {
        this.locale = locale;
        this.fallbacks = this.createFallbacks(locale);
        this.messages = messageMap;
        this.translator = translator.createTranslator(['default'], __dirname + '/../language', {
            locale,
            fallbackLocale: this.fallbacks,
            resourceFormat: 'json',
            autoDetect: false
        });
    }

    getMessages() {
        return this.messages;
    }

    limitMessagesTo(requiredMessages) {
        this.messages = this.pruneTo(requiredMessages);
    }

    // TODO: Make this more elegant
    createFallbacks(locale) {
        const localeParts = locale.split('-');
        const fallbacks = [];

        // Don't need the last index for fallbacks, because that's covered in 'locale'
        localeParts.pop();

        while (localeParts.length) {
            let fallback = localeParts.join('-');
            fallbacks.push(fallback);

            localeParts.pop();
        }
        return fallbacks;
    }

    pruneTo(messageList) {
        for (let k in messageMap) {
            if (messageList.indexOf(k) === -1) {
                delete messageMap[k];
            }
        }
        return messageMap;
    }

    buildMessages() {
        if (!process.env.CI) {
            this.translate();
        } else {
            this.translateCI();
        }
    }

    translate() {
        for (let k in this.messages) {
            // Could also just use spread syntax to make the dot-notation values the keys
            // This would mean that we didn't need to change the keys used in the app if we ever
            // wanted to do this at runtime
            this.messages[k] = this.translator(this.messages[k], null, {
                skipInterpolation: true
            });
        }
    }

    translateCI() {
        // To avoid the Github actions bug
        const directories = [this.locale, ...this.fallbacks];
        while (directories.length) {
            let lang = directories.shift(),
                translations = fs.readFileSync(__dirname + '/../language/' + lang + '/default.json', 'utf8');

            translations = JSON.parse(translations);

            this.recursiveFind(translations);
        }
    }

    recursiveFind(translations, dotNotation) {
        let keys = Object.keys(translations),
            newDot;

        for (let currentKey in keys) {
            // Object.keys creates an array, and so currentKey starts out as an index rather than the key string. We fix that.
            currentKey = keys[currentKey];

            // If dotNotation is empty or undefined, then the current key should be the start of the
            // next recursion's dot notation string
            newDot = !dotNotation ? currentKey : dotNotation + '.' + currentKey;

            // Found a string? Then that's what we need to add to messageMap
            if ('string' === typeof translations[currentKey]) {
                // Find the dotNotation in messageMap, do the thing, replace it with the string from 'translations'
                // Also cool because it prevents lower-priority locales from overriding the messageMap key
                for (let k in this.messages) {
                    if (this.messages[k] === newDot) {
                        this.messages[k] = translations[currentKey];
                    }
                }
            } else {
                // It's an object. Let's do it again.
                this.recursiveFind(translations[currentKey], newDot);
            }
        }
    }
}

module.exports = MessageBuilder;