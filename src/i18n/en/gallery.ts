/*
 * Strings for gallery.stylebot.dev, where people share and install styles.
 * Same rules as site.ts: keep inline HTML and {placeholders} intact.
 * Objects with `one` and `other` are plural forms, picked by count: a
 * translation lists the forms its language needs (zero, one, two, few, many,
 * other) and must include `other`.
 */
export default {
  meta: {
    title: 'Browse Styles',
    // Every gallery page's title; {title} is the page's own, such as a style's name.
    titleSuffix: '{title} | Stylebot',
    description:
      'Styles people made with Stylebot for the sites they use. Pick one and install it in a click.',
  },
  header: {
    home: 'Stylebot gallery home',
    // Set next to the Stylebot logo, naming this part of the site.
    tag: 'Gallery',
  },
  browse: {
    title: 'Styles for the sites you use',
    search: 'Search a website or style name',
    // Tooltip on the key hint in the search field.
    searchKey: 'Press / to search',
    sites: 'Top sites',
    sort: 'Sort',
    popular: 'Popular',
    new: 'New',
    // Feed heading when sorted by Popular.
    mostInstalled: 'Most installed',
    // Feed heading when sorted by New.
    recent: 'Recently updated',
    // Feed heading for a search; {query} is what was searched for.
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
    // Screenshot alt text: {site} is a hostname, {name} the style's name.
    alt: '{site} with the {name} style',
    zoom: 'View larger',
    install: 'Install',
    installing: 'Installing…',
    installed: 'Installed',
    installedTitle: 'Added as a profile. Manage it from the Stylebot popup.',
    // Shown as the author of a style whose author has no display name.
    anonymous: 'Anonymous',
    // {date} is relative, such as "3 days ago".
    updated: 'Updated {date}',
    installFailed: 'Couldn’t install. Try again',
  },
  count: {
    styles: { one: '{count} style', other: '{count} styles' },
    installs: { one: '{count} install', other: '{count} installs' },
    lines: { one: '{count} line', other: '{count} lines' },
  },
  site: {
    back: 'All styles',
    // Label of the chips that filter a site's styles by hostname, such as
    // en.wikipedia.org and es.wikipedia.org.
    hosts: 'Hostnames',
    // The chip that shows styles for every hostname of the site.
    allHosts: 'All',
    getStylebot: 'Get Stylebot to install',
    addedAsProfile: 'Added as a profile',
    // Tooltip on addedAsProfile; {site} is a hostname.
    profileTitle:
      'Profile “{name}”. Switch or remove it from the Stylebot popup on {site}.',
  },
  style: {
    back: 'All styles for {site}',
    fullSize: 'View full size',
    // {site} is the hostname it installs for, such as github.com.
    installFor: 'Install for {site}',
    installedOn: 'Installed on {site}',
    // Followed by the hostname the style will install for, in bold.
    installsOn: 'Installs on',
    // Label of the field for another hostname to install the style for.
    installOn: 'Install on',
    change: 'Change',
    save: 'Save',
    cancel: 'Cancel',
    // When the hostname is a pattern like *.wikipedia.org.
    allSubdomains: '{site} and all its subdomains',
    // Shown after picking another site; {site} is the one the style was made for.
    madeFor: 'Made for {site}, so it may not match other sites.',
    reset: 'Reset',
    installNote:
      'Adds a profile to your style for {site}. Your own edits stay as they are.',
    installedNote:
      'Added to {site} as a new profile, “{name}”. You can switch profiles from the Stylebot popup on that site.',
    // Link to the site the style was installed on.
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
    // Copy CSS's label for a moment after copying.
    copied: 'Copied',
    safe: 'Styles only change how a page looks. They can’t read or send what’s on it.',
    moreForSite: 'More for {site}',
    notFound: 'Style not found',
    notFoundBody:
      'It may have been taken down by its author, or hidden after reports.',
  },
  versions: {
    title: 'Versions',
    // {version} is a number.
    version: 'Version {version}',
    // Badge on the version installs get now.
    current: 'Current',
    showChanges: 'See changes',
    hideChanges: 'Hide changes',
    // Shown when a version changed the screenshot, name or notes but not the CSS.
    noChanges: 'The CSS didn’t change.',
    // Alt text of a version's screenshot; {version} is a number.
    screenshot: 'Screenshot of version {version}',
  },
  // {name} is the profile Stylebot saved the style as; {site} a hostname.
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
    // Label of the menu under the signed-in person's name.
    menu: 'Account',
    yourStyles: 'Your styles',
    signOut: 'Sign out',
    signInFailed: 'Couldn’t sign in. Try again',
  },
  mine: {
    title: 'Your styles',
    signedOut:
      'Sign in with Google to see the styles you’ve published and how many people use them. Installing doesn’t need an account.',
    // {name} is the signed-in person's author name.
    signedInAs: 'Published as {name}',
    editName: 'Change name',
    // Label of the field for the name shown as the author of your styles.
    name: 'Author name',
    save: 'Save',
    cancel: 'Cancel',
    empty: 'You haven’t published any styles yet.',
    publishHint:
      'To publish a style, open Stylebot on the site and publish it from the editor. People who install it get your updates.',
    // Badge on a style hidden after people reported it.
    hidden: 'Hidden after reports',
    unpublish: 'Unpublish',
    // {name} is the style's name.
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
