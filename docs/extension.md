# The extension

The site doesn't depend on the extension's repo, but borrows from it in two ways:

- **Its wording.** Mock UI on the site uses the extension's own translations, which `yarn run check` checks against `scripts/extension-strings.json`, a snapshot of the extension's strings. `yarn sync:extension-strings` refreshes it from github.com/ankit/stylebot (`--from <ref>` for a branch or tag other than `main`); commit the result.
- **Screenshots.** The screenshots in `src/assets/` are taken from a build of the extension by its `capture:*` scripts, which save them in the extension repo's `captures/`. Copy them here by hand. The gallery's themes live only here, in `src/assets/gallery/<site>/<theme>.css`. The extension's `yarn capture:gallery` reads them from this checkout when it sits beside the extension's, or from the directory after `--themes`; pointing `--out` at the same directory saves each image beside its CSS.
