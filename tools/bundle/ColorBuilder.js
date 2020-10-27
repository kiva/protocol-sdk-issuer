const colorMap = {
    "$primary-color": "#24778b",
    "$primary-offset": "white",

    "$secondary-color": "#e7e7e7",
    "$secondary-offset": "#333",

    "$error-color": "#b65f57",
    "$error-offset": "white",

    "$warning-color": "#fff625",
    "$warning-offset": "#000"
};

class ColorBuilder {
    static init(conf) {
        return new ColorBuilder(conf);
    }

    constructor(conf) {
        this.conf = conf.colorMap || {};
        this.colorMap = this.overrideColors();
    }

    overrideColors() {
        for (let key in colorMap) {
            if (this.conf.hasOwnProperty(key)) {
                colorMap[key] = this.conf[key];
            }
        }

        return colorMap;
    }

    getColors() {
        return this.colorMap;
    }

    writeSass() {
        let ret = "";
        for (let def in this.colorMap) {
            ret += `${def}: ${this.colorMap[def]};\n`;
        }
        return ret;
    }
}

module.exports = ColorBuilder;