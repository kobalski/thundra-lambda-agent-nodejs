import Sampler from './Sampler';
import { envVariableKeys } from '../../Constants';
import Utils from '../../plugins/utils/Utils';
const koalas = require('koalas');

class TimeAwareSampler implements Sampler<null> {
    timeFreq: number;
    latestTime: number;

    constructor(timeFreq?: number) {
        this.timeFreq = koalas(parseInt(Utils.getConfiguration(
            envVariableKeys.THUNDRA_AGENT_TIME_AWARE_SAMPLER_TIME_FREQ), 10), timeFreq, 300000);
        this.latestTime = 0;
    }

    isSampled(): boolean {
        const currentTimeValue = Date.now();
        if (currentTimeValue > this.latestTime + this.timeFreq) {
            this.latestTime = currentTimeValue;
            return true;
        } else {
            return false;
        }
    }
}

export default TimeAwareSampler;
