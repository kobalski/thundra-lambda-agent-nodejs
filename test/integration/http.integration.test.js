import HttpIntegration from '../../dist/plugins/integrations/HttpIntegration';
import ThundraTracer from '../../dist/opentracing/Tracer';
import Http from './utils/http.integration.utils';

describe('HTTP integration', () => {
    test('should instrument HTTP calls ', () => {
        const integration = new HttpIntegration({});
        const sdk = require('http');

        integration.wrap(sdk, {});

        const tracer = new ThundraTracer();

        return Http.get(sdk).then(() => {
            const span = tracer.getRecorder().spanList[0];

            expect(span.className).toBe('HTTP');
            expect(span.domainName).toBe('API');

            expect(span.tags['operation.type']).toBe('CALL');
            expect(span.tags['http.method']).toBe('GET');
            expect(span.tags['http.host']).toBe('jsonplaceholder.typicode.com');
            expect(span.tags['http.path']).toBe('/users/1');
            expect(span.tags['http.url']).toBe('jsonplaceholder.typicode.com/users/1?q=123');
            expect(span.tags['http.query_params']).toBe('q=123');
            expect(span.tags['http.status_code']).toBe(200);
        });
    });
});