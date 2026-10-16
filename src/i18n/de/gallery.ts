import type { GalleryMessages } from '..';

const gallery: GalleryMessages = {
  meta: {
    title: 'Browse Styles',
    titleSuffix: '{title} | Stylebot',
    description:
      'Styles people made with Stylebot for the sites they use. Pick one and install it in a click.',
  },
  header: {
    home: 'Stylebot gallery home',
    tag: 'Gallery',
  },
  browse: {
    title: 'Styles for the sites you use',
    search: 'Search a website or style name',
    searchKey: 'Press / to search',
    sites: 'Top sites',
    sort: 'Sort',
    popular: 'Popular',
    new: 'New',
    mostInstalled: 'Most installed',
    recent: 'Recently updated',
    results: 'Results for “{query}”',
    noResults:
      'No styles match “{query}” yet. Make one with Stylebot and publish it.',
    empty: 'No styles yet. Make one with Stylebot and publish it.',
    more: 'Load more',
  },
  missing: {
    title: 'Stylebot isn’t installed in this browser.',
    body: 'Add it to install styles in one click. You can browse everything without it.',
    cta: 'Get Stylebot',
  },
  card: {
    alt: '{site} with the {name} style',
    zoom: 'View larger',
    install: 'Install',
    installing: 'Installing…',
    installed: 'Installed',
    installedTitle: 'Added as a profile. Manage it from the Stylebot popup.',
    anonymous: 'Anonymous',
    updated: 'Updated {date}',
    installFailed: 'Couldn’t install. Try again',
  },
  count: {
    styles: {
      one: '{count} style',
      other: '{count} styles',
    },
    installs: {
      one: '{count} install',
      other: '{count} installs',
    },
    lines: {
      one: '{count} line',
      other: '{count} lines',
    },
  },
  site: {
    back: 'All styles',
    hosts: 'Hostnames',
    allHosts: 'All',
    getStylebot: 'Get Stylebot to install',
    addedAsProfile: 'Added as a profile',
    profileTitle:
      'Profile “{name}”. Switch or remove it from the Stylebot popup on {site}.',
  },
  style: {
    back: 'All styles for {site}',
    fullSize: 'View full size',
    installFor: 'Install for {site}',
    installedOn: 'Installed on {site}',
    installsOn: 'Installs on',
    installOn: 'Install on',
    change: 'Change',
    save: 'Save',
    cancel: 'Cancel',
    allSubdomains: '{site} and all its subdomains',
    madeFor: 'Made for {site}, so it may not match other sites.',
    reset: 'Reset',
    installNote:
      'Adds a profile to your style for {site}. Your own edits stay as they are.',
    installedNote:
      'Added to {site} as a new profile, “{name}”. You can switch profiles from the Stylebot popup on that site.',
    open: 'Open {site}',
    uninstall: 'Uninstall',
    uninstalling: 'Uninstalling…',
    uninstalled: 'Removed from {site}.',
    uninstallFailed:
      'Couldn’t uninstall. Remove it from the Stylebot popup on {site}.',
    copyLink: 'Copy link',
    linkCopied: 'Link copied',
    installs: 'Installs',
    updated: 'Updated',
    version: 'Version',
    css: 'CSS',
    copyCss: 'Copy CSS',
    copied: 'Copied',
    safe: 'Styles only change how a page looks. They can’t read or send what’s on it.',
    moreForSite: 'More for {site}',
    notFound: 'Style not found',
    notFoundBody:
      'It may have been taken down by its author, or hidden after reports.',
  },
  versions: {
    title: 'Versions',
    version: 'Version {version}',
    current: 'Current',
    showChanges: 'See changes',
    hideChanges: 'Hide changes',
    noChanges: 'The CSS didn’t change.',
    screenshot: 'Screenshot of version {version}',
  },
  toast: {
    installed: 'Added as profile “{name}” on {site}.',
  },
  zoom: {
    close: 'Esc to close',
    open: 'View style',
  },
  report: {
    open: 'Report this style',
    title: 'Report this style',
    body: 'Tell us what’s wrong. Styles reported by several people are hidden until someone looks at them.',
    reason: 'What’s wrong? (optional)',
    submit: 'Report',
    cancel: 'Cancel',
    done: 'Thanks. We’ll review this style.',
    failed: 'Couldn’t send the report. Try again',
  },
  account: {
    signIn: 'Sign in with Google',
    menu: 'Account',
    yourStyles: 'Your styles',
    signOut: 'Sign out',
    signInFailed: 'Couldn’t sign in. Try again',
  },
  mine: {
    title: 'Your styles',
    signedOut:
      'Sign in with Google to see the styles you’ve published and how many people use them. Installing doesn’t need an account.',
    signedInAs: 'Published as {name}',
    editName: 'Change name',
    name: 'Author name',
    save: 'Save',
    cancel: 'Cancel',
    empty: 'You haven’t published any styles yet.',
    publishHint:
      'To publish a style, open Stylebot on the site and publish it from the editor. People who install it get your updates.',
    hidden: 'Hidden after reports',
    unpublish: 'Unpublish',
    confirmUnpublish:
      'Unpublish “{name}”? It leaves the gallery, and people who installed it keep it.',
    unpublished:
      '“{name}” is no longer listed. People who installed it keep it.',
    failed: 'Something went wrong. Try again',
  },
  error: {
    load: 'Couldn’t load styles.',
    retry: 'Try again',
  },
};

export default gallery;
