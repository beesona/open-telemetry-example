import { NodeSDK } from '@opentelemetry/sdk-node';
import { ConsoleSpanExporter } from '@opentelemetry/sdk-trace-node';
import { PeriodicExportingMetricReader, ConsoleMetricExporter } from '@opentelemetry/sdk-metrics';
import { Resource } from '@opentelemetry/resources';
import {
    SEMRESATTRS_SERVICE_NAME,
    SEMRESATTRS_SERVICE_VERSION
} from '@opentelemetry/semantic-conventions';

const { NodeTracerProvider } = require('@opentelemetry/sdk-trace-node');
const { registerInstrumentations } = require('@opentelemetry/instrumentation');
const { HttpInstrumentation } = require('@opentelemetry/instrumentation-http');
const { ExpressInstrumentation } = require('@opentelemetry/instrumentation-express');

const sdk = new NodeSDK({
    resource: new Resource({
        [SEMRESATTRS_SERVICE_NAME]: 'Open-Telemetry-Example',
        [SEMRESATTRS_SERVICE_VERSION]: '0.1.0'
    }),
    traceExporter: new ConsoleSpanExporter(),
    instrumentations: [new HttpInstrumentation(), new ExpressInstrumentation()],
    metricReader: new PeriodicExportingMetricReader({
        exporter: new ConsoleMetricExporter()
    })
});

sdk.start();
