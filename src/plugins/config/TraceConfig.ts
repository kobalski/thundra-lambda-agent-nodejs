import BasePluginConfig from './BasePluginConfig';
import TraceOption from './TraceOption';
import { TRACE_DEF_KEY_PREFIX } from '../../Constants';
const koalas = require('koalas');

class TraceConfig extends BasePluginConfig {
    disableRequest: boolean;
    disableResponse: boolean;
    tracerConfig: any;
    traceDef: TraceOption[];
    maskRequest: (request: any) => any;
    maskResponse: (response: any) => any;
    integrations: string[];

    constructor(options: any) {
        options = options ? options : {};
        super(koalas(!options.disableTrace, false));
        this.disableRequest = koalas(process.env.thundra_lambda_trace_request_skip, options.disableRequest, false);
        this.disableResponse = koalas(process.env.thundra_lambda_trace_response_skip, options.disableResponse, false);
        this.maskRequest = koalas(options.maskRequest, null);
        this.maskResponse = koalas(options.maskResponse, null);
        this.integrations = koalas(options.integrations, []);
        this.tracerConfig = koalas(options.tracerConfig, {});
        this.traceDef = [];
        for (const key of Object.keys(process.env)) {
            if (key.startsWith(TRACE_DEF_KEY_PREFIX)) {
                try {
                    this.traceDef.push(this.parseTraceDefEnvVariable(process.env[key]));
                } catch (ex) {
                    console.error(`Cannot parse trace def ${key}`);
                }
            }
        }
        if (options.traceDef) {
            this.traceDef.push(... options.traceDef);
        }
    }

    parseTraceDefEnvVariable(value: string): TraceOption {
        const args = value.substring(value.indexOf('[') + 1, value.indexOf(']')).split(',');
        const pattern = value.substring(0, value.indexOf('['));
        const option: any = new TraceOption(pattern);
        for (const arg of args) {
            const tupple = arg.split('=');
            const argKey = tupple[0];
            const argValue = tupple[1];
            option[argKey] = argValue;
        }
        return option;
    }
}

export default TraceConfig;