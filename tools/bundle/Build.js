const fs = require('fs-extra');
const config_file = process.argv[2];
const config = JSON.parse(fs.readFileSync(__dirname + '/../../' + config_file, 'utf8'));
const env = process.argv[3] || 'qa';
const envConf = config.env[env] || {};

mergeEnvironments(config.env, env);

const constantBuilder = require(__dirname + '/ConstantBuilder').init(config, env);
const actionBuilder = require(__dirname + '/ActionBuilder').init(config.env, env);
const messageBuilder = require(__dirname + '/MessageBuilder').init(config.locale);
const colorBuilder = require(__dirname + '/ColorBuilder').init(config);
if (config.translateOnly) {
    messageBuilder.limitMessagesTo(translateOnly);
}
messageBuilder.buildMessages();

const actions = actionBuilder.getActions();
const messageMap = messageBuilder.getMessages();
const constants = constantBuilder.getVariables();
const scss = colorBuilder.writeSass();

console.log(`Setting constants for ${env}...`);
writeTo(__dirname + '/../../src/constants/variables.json', constants);
console.log(`Done!\n`);

console.log(`Building actions for ${env}...`);
writeTo(__dirname + '/../../src/constants/authorized_actions.json', actions);
console.log(`Done!\n`);

console.log(`Building translations for ${config.locale || process.env.LOCALE}...`);
writeTo(__dirname + '/../../src/constants/translations.json', messageMap);
console.log(`Done!\n`);

console.log(`Creating color palette in SCSS...`);
writeTo(__dirname + '/../../src/ui/css/mixins/_colors.scss', scss, true);
console.log(`Done!\n`);

function writeTo(path, data, noJson) {
    if (!noJson) {
        data = JSON.stringify(data);
    }

    fs.writeFileSync(path, data, {
        flag: 'w+'
    });
}

function mergeEnvironments(configEnv, env) {
    const conf = configEnv[env];

    // Apply attributes from target `env` THAT HAVE NOT BEEN DEFINED IN CURRENT ENV into the target config
    // Priority is in index order i.e. if a config is defined at index 0 and 2, the value from index 0 will win
    if (conf.inherits) {
        inherit(conf.inherits, conf, configEnv);
        delete conf.inherits;
    }
}

function inherit(envArr, insertInto, conf) {
    while (envArr.length) {
        let frum = envArr.shift();
        for (let k in conf[frum]) {
            if (!insertInto.hasOwnProperty(k)) {
                insertInto[k] = conf[frum][k];
            }
        }
    }
}

module.exports = mergeEnvironments;