import { Span } from 'opentracing';
import ThundraSpanContext from './SpanContext';
import Utils from '../plugins/Utils';
import ThundraTracer from './Tracer';
class ThundraSpan extends Span {
  parentTracer: ThundraTracer;
  operationName: string;
  tags: any;
  startTime: number;
  spanContext: ThundraSpanContext;
  duration: number;
  rootTraceId: string;
  logs: any[];
  className: string;
  domainName: string;

  constructor(tracer: any, fields: any) {
    super();
    fields = fields ? fields : {};
    const startTime = fields.startTime || Date.now();
    const operationName = fields.operationName;
    const parent = fields.parent || null;
    const tags = fields.tags || {};

    this.parentTracer = tracer;
    this.operationName = operationName;
    this.tags = Object.assign({}, tags);
    this.startTime = startTime;
    this.rootTraceId = fields.rootTraceId || null;
    this.spanContext = this._createContext(parent);
    this.logs = [];
    this.className = fields.className;
    this.domainName = fields.domainName;
  }

  getOperationName(): string {
    return this.operationName;
  }

  getTag(key: string): any {
    return this.tags[key];
  }

  _createContext(parent: any) {
    if (!this.parentTracer) {
      return;
    }

    let spanContext;
    if (parent) {
      spanContext = new ThundraSpanContext({
        traceId: parent.traceId,
        spanId: Utils.generateId(),
        parentId: parent.spanId,
        sampled: parent.sampled,
        baggageItems: Object.assign({}, parent.baggageItems),
      });
    } else {
      spanContext = new ThundraSpanContext({
        traceId: this.rootTraceId,
        spanId: Utils.generateId(),
        sampled: this.parentTracer._isSampled(this),
      });
    }

    return spanContext;
  }

  _context() {
    return this.spanContext;
  }

  _tracer() {
    return this.parentTracer;
  }

  _setOperationName(name: string) {
    this.operationName = name;
  }

  _setBaggageItem(key: string | number, value: any) {
    this.spanContext.baggageItems[key] = value;
  }

  _getBaggageItem(key: string | number) {
    return this.spanContext.baggageItems[key];
  }

  _addTags(keyValuePairs: {
    [key: string]: any;
  }) {
    try {
      Object.keys(keyValuePairs).forEach((key) => {
        this.tags[key] = String(keyValuePairs[key]);
      });
    } catch (e) {
      console.log(e);
    }
  }

  _finish(finishTime: number = Date.now()) {
    this.duration = finishTime - this.startTime;
    if (this.spanContext.sampled) {
      this.parentTracer._record(this);
    }
  }

  _log(keyValuePairs: { [key: string]: any; }, timestamp: number = Date.now()): void {
    if (!keyValuePairs && typeof keyValuePairs !== 'object') {
      return;
    }
    keyValuePairs.timestamp = timestamp;
    this.logs.push(keyValuePairs);
  }
}

export enum SpanEvent {
  SPAN_START,
  SPAN_FINISH,
}

export default ThundraSpan;