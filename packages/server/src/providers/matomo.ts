import { BaseProvider } from './base';
import MatomoTracker from 'matomo-tracker';
import { MatomoConfig, EventAction, PageAction } from '@blockstack/stats';
import { Request } from 'express';
import { getUserAgent } from '../utils';

export class MatomoProvider extends BaseProvider {
  static async event(eventAction: EventAction, req: Request) {
    const client = this.getClient(eventAction.provider);
    const { eventData, context } = eventAction;
    const { name, ...rest } = eventData;
    /*client.track({
      event: name,
      anonymousId: eventAction.id,
      context: {
        ...context,
        ...this.getUAContext(req),
      },
      properties: {
        ...rest,
      },
    });*/
    client.track({
        action_name: name,
        ua: getUserAgent(req),
        uid:  eventAction.id,

        /*url: 'http://example.com/track/this/url',
        action_name: 'This will be shown in your dashboard',
        ua: 'Node.js v0.10.24',
        cvar: JSON.stringify({
          '1': ['custom variable name', 'custom variable value']
        })*/
      });
    return Promise.resolve();
  }

  static async page(pageAction: PageAction, req: Request) {
    const client = this.getClient(pageAction.provider);
    const { pageData, context } = pageAction;
    const { name, ...rest } = pageData;
    /*client.page({
      context: {
        ...context,
        ...this.getUAContext(req),
      },
      anonymousId: pageAction.id,
      name,
      properties: {
        ...rest,
      },
    });*/
    return Promise.resolve();
  }

  static getClient(provider: MatomoConfig) {
    return new MatomoTracker(provider.id, provider.url);
  }

  static getUAContext(req: Request) {
    const ua = getUserAgent(req);
    if (!ua) {
      return {};
    }
    const os = ua.getOS();
    const device = ua.getDevice();
    return {
      os,
      device: {
        manufacturer: device.vendor,
        model: device.model,
        type: device.type,
      },
    };
  }
}
