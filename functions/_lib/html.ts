const ENTITIES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&apos;',
};

/**
 * Text that's safe in HTML or XML, as content or a quoted attribute.
 */
export const escape = (text: string) =>
  text.replace(/[&<>"']/g, (c) => ENTITIES[c]!);

/**
 * A JSON-LD script, with `<` escaped so the data can't close it.
 */
export const jsonLd = (data: object) =>
  `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;
