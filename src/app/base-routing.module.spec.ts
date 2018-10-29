import { BaseRoutingModule } from './base-routing.module';

describe('BaseRoutingModule', () => {
  let baseRoutingModule: BaseRoutingModule;

  beforeEach(() => {
    baseRoutingModule = new BaseRoutingModule();
  });

  it('should create an instance', () => {
    expect(baseRoutingModule).toBeTruthy();
  });
});
