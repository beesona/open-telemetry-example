import { NodeSDK } from '@opentelemetry/sdk-node';
import { ConsoleSpanExporter } from '@opentelemetry/sdk-trace-node';
import {
    PeriodicExportingMetricReader,
    ConsoleMetricExporter
} from '@opentelemetry/sdk-metrics';
import { Resource } from '@opentelemetry/resources';
import {
    SEMRESATTRS_SERVICE_NAME,
    SEMRESATTRS_SERVICE_VERSION
} from '@opentelemetry/semantic-conventions';
const {
    OTLPTraceExporter
} = require('@opentelemetry/exporter-trace-otlp-http');
const {
    OTLPMetricExporter
} = require('@opentelemetry/exporter-metrics-otlp-http');
const { OTLPLogExporter } = require('@opentelemetry/exporter-logs-otlp-http');
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { SequelizeInstrumentation } from 'opentelemetry-instrumentation-sequelize';
import { PinoInstrumentation } from '@opentelemetry/instrumentation-pino';

const sdk = new NodeSDK({
    resource: new Resource({
        [SEMRESATTRS_SERVICE_NAME]: 'Open-Telemetry-Example',
        [SEMRESATTRS_SERVICE_VERSION]: '0.1.0'
    }),
    traceExporter: new OTLPTraceExporter({
        url: 'http://localhost:4318/v1/traces'
    }),
    instrumentations: [
        new PinoInstrumentation({
            logHook: (span, record, level) => {
                record['resource.service.name'] =
                    process.env.SERVICE_NAME || 'business-service';
            },
            logKeys: {
                traceId: 'traceId',
                spanId: 'spanId',
                traceFlags: 'traceFlags'
            }
        }),
        new HttpInstrumentation(),
        new ExpressInstrumentation(),
        new SequelizeInstrumentation()
    ],
    metricReader: new PeriodicExportingMetricReader({
        exporter: new OTLPMetricExporter({
            url: 'http://localhost:4318/v1/metrics'
        })
    })
});

sdk.start();
