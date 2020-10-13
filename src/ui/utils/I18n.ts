import {translationKeys} from "../../constants/constants";

export default class I18n {
    static getKey(key: string): string {
        return translationKeys[key] || '';
    }

    // TODO: Create a TranslationMap interface
    static computeKey(map: any, key: string): string {       
        const valueToParse: any = resolvePath(key, translationKeys);
        if (!valueToParse) return key;

        const matches: string[] = valueToParse.match(/\{\{([A-Za-z1-9]\.?)+\}\}/g) || [];

        if (!matches) return valueToParse;

        const parsedValues = matches.map((template: string) => {
            let inject: string | boolean = resolvePath(template.slice(2, -2), map);
            return inject !== '' ? inject : template;
        });

        return interpolateData(matches, parsedValues, valueToParse);
    }
}

function interpolateData(templates: string[], replacements: string[], originalString: string): string {
    let ret = originalString;
    for (let i = 0; i < templates.length; i++) {
        ret = ret.replace(templates[i], replacements[i]);
    }

    return ret;
}

function resolvePath(path: string, map: any): string {
    if (path.indexOf('.') === -1) {
        return map.hasOwnProperty && map.hasOwnProperty(path) ? map[path] : '';
    }

    const pathSteps = path.split('.');
    let ret: any = map,
        key: string | undefined = '';
    while (pathSteps.length) {
        key = pathSteps.shift();
        if (key && ret.hasOwnProperty(key)) {
            ret = ret[key];
        } else {
            return '';
        }
    }

    return 'string' ===  typeof ret ? ret : '';
}