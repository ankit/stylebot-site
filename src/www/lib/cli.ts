export const CLI_PACKAGE = '@stylebot/cli';

export const CLI_INSTALL = `npm install -g ${CLI_PACKAGE}`;

export const CLI_EXAMPLES = [
  { id: 'open', command: 'stylebot open news.ycombinator.com' },
  { id: 'outline', command: 'stylebot outline 54432929' },
  { id: 'css', command: 'stylebot css set news.ycombinator.com < dark.css' },
  { id: 'screenshot', command: 'stylebot screenshot 54432929 -o page.png' },
] as const;
