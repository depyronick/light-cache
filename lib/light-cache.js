'use strict';

const extend = require('extend');

class LightCache {
    constructor(storageName) {

        if(!storageName) {
            throw new Error("Storage name is required.");
        }

        this.storageName = storageName;

        this.statsObjectDefault = {
            get         : 0,
            set         : 0,
            mget        : 0,
            mset        : 0,
            exists      : 0,
            mexists     : 0,
            del         : 0,
            mdel        : 0,
            append      : 0,
            prepend     : 0
        };

        this.statsObject = this.statsObjectDefault;

        this.data = {};
        this.data[this.storageName] = {};
    }

    get(key) {
        this.statsObject.get++;

        if(typeof key === "string") {
            return this.data[this.storageName][key];
        } else {
            throw new Error("Key must be type of String.");
        }
    }

    set(key, value) {
        this.statsObject.set++;

        if(typeof key === "string") {
            this.data[this.storageName][key] = value;
        } else {
            throw new Error("Key must be type of String.");
        }
    }

    mget(keys) {
        this.statsObject.mget++;

        let mgetObject = {};

        if(Array.isArray(keys)) {
            for(let key of keys) {
                if(this.exists(key)) {
                    mgetObject[key] = this.data[this.storageName][key];
                } else {
                    mgetObject[key] = undefined;
                }
            }
            return mgetObject;
        } else {
            throw new Error("Keys must be type of Array.");
        }
    }

    mset(keys, values) {
        this.statsObject.mset++;

        if(Array.isArray(keys)) {
            if(Array.isArray(values)) {
                if(keys.length === values.length) {
                    for(let [index, value] of keys.entries()) {
                        this.data[this.storageName][value] = values[index];
                    }
                } else {
                    throw new Error("Keys and values lengths are not equal.");
                }
            } else {
                throw new Error("Values must be type of Array.");
            }
        } else {
            throw new Error("Keys must be type of Array.");
        }
    }

    exists(key) {
        this.statsObject.exists++;

        return this.data[this.storageName].hasOwnProperty(key);
    }

    mexists(keys) {
        this.statsObject.mexists++;

        let existsObject = {};

        if(Array.isArray(keys)) {
            for(let key of keys) {
                if(!existsObject.hasOwnProperty(key)) {
                    existsObject[key] = this.exists(key);
                }
            }
            return existsObject;
        } else {
            throw new Error("Keys must be type of Array.");
        }
    }

    del(key) {
        this.statsObject.del++;

        if(this.data[this.storageName].hasOwnProperty(key)) {
            delete this.data[this.storageName][key];
        } else {
            throw new Error("Cannot delete a key that does not exists.");
        }
    }

    mdel(keys) {
        this.statsObject.mdel++;

        if(Array.isArray(keys)) {
            for(let key of keys) {
                if(this.data[this.storageName].hasOwnProperty(key)) {
                    delete this.data[this.storageName][key];
                } else {
                    throw new Error("Cannot delete a key that does not exists.");
                }
            }
        } else {
            throw new Error("Keys must be type of Array.");
        }
    }

    append(key, value) {
        this.statsObject.append++;

        if(typeof value === "object") {
            this.data[this.storageName][key] = Object.assign(this.data[this.storageName][key], value);
        } else {
            throw new Error("Value must be an Array or an Object.");
        }
    }

    prepend(key, value) {
        this.statsObject.prepend++;
        if(typeof value === "object") {
            this.data[this.storageName][key] = Object.assign(value, this.data[this.storageName][key]);
        } else {
            throw new Error("Value must be an Array or an Object.");
        }
    }

    stats() {
        return this.statsObject;
    }

    flush() {
        this.data[this.storageName] = {};
        this.statsObject = this.statsObjectDefault;
    }
}

module.exports = LightCache;