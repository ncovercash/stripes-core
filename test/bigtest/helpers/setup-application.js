import { beforeEach } from '@bigtest/mocha';
import { setupAppForTesting, visit, location } from '@bigtest/react';
import localforage from 'localforage';
import { reset } from '@folio/stripes-connect';
import * as defaultConfig from 'stripes-config';

// load these styles for our tests
import '@folio/stripes-components/lib/global.css';

import startMirage from '../network/start';

import App from '../../../src/App';

import {
  withModules,
  clearModules,
  withConfig,
  clearConfig,
  setCookies,
  clearCookies,
} from './stripes-config';

const { assign } = Object;

// const baseConfig = {
//   "okapi": {
//       "url": "http://localhost:9130",
//       "tenant": "diku"
//   },
//   "config": {
//       "logCategories": "core,path,action,xhr",
//       "logPrefix": "--",
//       "showPerms": false,
//       "hasAllPerms": true,
//       "languages": [
//           "en"
//       ]
//   },
//   "modules": {
//       "app": []
//   },
//   "branding": {
//       "logo": {
//           "src": "http://localhost:9876/absoluteC:/Users/JCoburn/AppData/Local/Temp/_karma_webpack_458856/dac39e3c6f7847571b4f53924e6f7ed4.svg",
//           "alt": "FOLIO"
//       },
//       "favicon": {
//           "src": "http://localhost:9876/absoluteC:/Users/JCoburn/AppData/Local/Temp/_karma_webpack_458856/263e09c855f69ec7ec8ebaa498f9a4e5.svg"
//       }
//   },
//   "errorLogging": {},
//   "translations": {
//       "en": "./absoluteC:\\Users\\JCoburn\\AppData\\Local\\Temp\\_karma_webpack_458856/translations/en-1654092551753.json"
//   },
//   "metadata": {},
//   "icons": {}
// }

export default function setupApplication({
  disableAuth = true,
  modules = [],
  translations = {},
  permissions = {},
  stripesConfig,
  mirageOptions = {},
  scenarios,
  currentUser = {},
  userLoggedIn = false,
  initialState = {},
  cookies = {},
} = {}) {
  beforeEach(async function () {
    // construct/override default config...
    // this config will be passed to App as a prop...

    // reshape modules to conform to what the app wants...
    const configModules = {};
    const moduleTypes = new Set();
    modules.forEach((m) => moduleTypes.add(m.type));
    moduleTypes.forEach((t) => {
      if (!configModules[t]) {
        configModules[t] = [];
      }
      modules.forEach((m) => {
        if (m.type === t) {
          const { module: getModule, name: module, ...rest } = m;
          const resModule = {
            fullName: undefined,
            getModule,
            module,
            ...rest,
          };

          configModules[t].push(resModule);
        }
      });
    });

    const stripesTestConfig = {
      ...defaultConfig,
      configModules,
      translations,
      ...stripesConfig,
      hasAllPerms: true,
    };

    // when auth is disabled, add a fake user to the store
    if (disableAuth) {
      initialState.okapi = {
        token: 'test',
        currentUser: assign({
          id: 'test',
          username: 'testuser',
          firstName: 'Test',
          lastName: 'User',
          email: 'user@folio.org',
          addresses: [],
          servicePoints: []
        }, currentUser),
        currentPerms: permissions
      };
    }

    // mount the app
    this.app = await setupAppForTesting(App, {
      mountId: 'testing-root',

      props: {
        initialState,
        defaultTranslations: translations,
        config: stripesTestConfig
      },

      setup: () => {
        this.server = startMirage(scenarios, mirageOptions);
        this.server.logging = false;

        if (userLoggedIn) {
          localforage.setItem('okapiSess', {
            token: initialState.okapi.token,
            user: initialState.okapi.currentUser,
            perms: initialState.okapi.currentPerms,
          });
        }

        setCookies(cookies);
        withModules(modules);
        withConfig({ logCategories: '', ...stripesTestConfig });
      },

      teardown: () => {
        clearConfig();
        clearModules();
        clearCookies(cookies);
        reset();
        localforage.clear();
        this.server.shutdown();
        this.server = null;
        this.app = null;
      }
    });

    // set the root to 100% height
    document.getElementById('testing-root').style.height = '100%';

    // setup react validators
    Object.defineProperties(this, {
      visit: { value: visit },
      location: { get: location },
    });
  });
}
