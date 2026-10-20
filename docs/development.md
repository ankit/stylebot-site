# Development

Uses Node 24 (see `.nvmrc`).

```
yarn install
yarn dev          # stylebot.dev
yarn dev:gallery  # gallery.stylebot.dev, on port 4400
```

## Build

```
yarn build            # stylebot.dev, into dist/
yarn preview          # serves dist/ locally
yarn build:gallery    # the gallery, into dist-gallery/
yarn preview:pages    # builds the gallery and serves it with its Pages Functions
yarn run check        # type check, translations against the code, and extension wording
```

Use `yarn run check`, not `yarn check`, which is Yarn's own command.
