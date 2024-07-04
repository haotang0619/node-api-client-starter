import { BaseResource } from './base';

export class CallerResource extends BaseResource {
  public get instance() {
    return this.INSTANCE;
  }
}
