import BasePluginConfig from './BasePluginConfig';
const koalas = require('koalas');

class AwsXRayConfig extends BasePluginConfig {

    constructor(options: any) {
        options = options ? options : {};
        super(koalas(options.enabled, false));
    }
}

export default AwsXRayConfig;
