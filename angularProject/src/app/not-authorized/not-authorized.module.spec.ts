import { NotAuthorizedModule } from './not-authorized.module';

describe('NotFoundModule', () => {
  let notAuthorizedModule: NotAuthorizedModule;

  beforeEach(() => {
    notAuthorizedModule = new NotAuthorizedModule();
  });

  it('should create an instance', () => {
    expect(notAuthorizedModule).toBeTruthy();
  });
});
