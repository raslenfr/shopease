const { Eureka } = require('eureka-js-client');

const EUREKA_ENABLED = process.env.EUREKA_ENABLED !== 'false';
const APP_NAME = process.env.EUREKA_APP_NAME || 'ORDER-SERVICE';
const INSTANCE_HOSTNAME = process.env.EUREKA_INSTANCE_HOSTNAME || 'order-service';
const INSTANCE_IP = process.env.EUREKA_INSTANCE_IP || '127.0.0.1';
const INSTANCE_PORT = parseInt(
  process.env.EUREKA_INSTANCE_PORT || process.env.PORT || '8082',
  10
);

const EUREKA_HOST = process.env.EUREKA_HOST || 'eureka-server';
const EUREKA_PORT = parseInt(process.env.EUREKA_PORT || '8761', 10);
const EUREKA_SERVICE_PATH = process.env.EUREKA_SERVICE_PATH || '/eureka/apps/';
const EUREKA_MAX_RETRIES = parseInt(process.env.EUREKA_MAX_RETRIES || '5', 10);
const EUREKA_RETRY_DELAY = parseInt(process.env.EUREKA_RETRY_DELAY || '2000', 10);

const statusUrl =
  process.env.EUREKA_STATUS_PAGE_URL || `http://${INSTANCE_HOSTNAME}:${INSTANCE_PORT}/health`;
const healthUrl =
  process.env.EUREKA_HEALTHCHECK_URL || `http://${INSTANCE_HOSTNAME}:${INSTANCE_PORT}/health`;
const homeUrl = process.env.EUREKA_HOME_PAGE_URL || `http://${INSTANCE_HOSTNAME}:${INSTANCE_PORT}/`;

const client = new Eureka({
  instance: {
    app: APP_NAME,
    instanceId: `${APP_NAME}:${INSTANCE_HOSTNAME}:${INSTANCE_PORT}`,
    hostName: INSTANCE_HOSTNAME,
    ipAddr: INSTANCE_IP,
    preferIpAddress: false,
    port: {
      $: INSTANCE_PORT,
      '@enabled': true
    },
    vipAddress: APP_NAME.toLowerCase(),
    secureVipAddress: APP_NAME.toLowerCase(),
    statusPageUrl: statusUrl,
    healthCheckUrl: healthUrl,
    homePageUrl: homeUrl,
    dataCenterInfo: {
      '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
      name: 'MyOwn'
    }
  },
  eureka: {
    host: EUREKA_HOST,
    port: EUREKA_PORT,
    servicePath: EUREKA_SERVICE_PATH,
    maxRetries: EUREKA_MAX_RETRIES,
    requestRetryDelay: EUREKA_RETRY_DELAY
  }
});

let started = false;

const startEurekaClient = () =>
  new Promise((resolve) => {
    if (!EUREKA_ENABLED) {
      console.log('Eureka client disabled (EUREKA_ENABLED=false)');
      return resolve();
    }

    if (started) {
      return resolve();
    }

    client.start((error) => {
      if (error) {
        console.error('Eureka registration failed:', error.message || error);
      } else {
        started = true;
        console.log(`Eureka registration successful: ${APP_NAME} -> ${EUREKA_HOST}:${EUREKA_PORT}`);
      }
      resolve();
    });
  });

const stopEurekaClient = () =>
  new Promise((resolve) => {
    if (!started) {
      return resolve();
    }

    client.stop(() => {
      started = false;
      console.log('Eureka client stopped');
      resolve();
    });
  });

module.exports = {
  startEurekaClient,
  stopEurekaClient
};
