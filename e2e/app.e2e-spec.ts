import { AdBoardPage } from './app.po';

describe('ad-board App', () => {
  let page: AdBoardPage;

  beforeEach(() => {
    page = new AdBoardPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
