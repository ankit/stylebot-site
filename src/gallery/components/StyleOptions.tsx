import { Fragment } from 'preact';

import { type StyleOption } from '@/gallery/lib/styleOptions';

import { type Translate } from '@/i18n/t';

import StyleOptionChoices from './StyleOptionChoices';

import './StyleOptions.css';

type Props = { options: Array<StyleOption>; t: Translate };

/**
 * The options a style offers beyond light and dark, each under its author's
 * label with its choices and default.
 */
export default function StyleOptions({ options, t }: Props) {
  return (
    <section class="style-options" aria-labelledby="style-options-title">
      <h2 id="style-options-title">
        {
          // i18n: Heading over the settings a style offers, such as its accent color, chosen in Stylebot's popup.
          t('Options', { context: 'style' })
        }
      </h2>

      <dl>
        {options.map((option) => (
          <Fragment key={option.name}>
            <dt>{option.label || option.name}</dt>

            <dd>
              <StyleOptionChoices option={option} t={t} />
            </dd>
          </Fragment>
        ))}
      </dl>

      <p>
        {
          // i18n: Under a style's options on its gallery page.
          t('Choose in Stylebot’s popup.')
        }
      </p>
    </section>
  );
}
