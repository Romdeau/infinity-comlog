/**
 * Theme-independent print styles for the roster readout. Forces a neutral
 * black-on-white palette regardless of the active theme so printed lists are
 * always legible. Rendered once inside the List View page.
 */
export function PrintStyles() {
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
        @media print {
          @page {
            margin: 1cm;
            size: auto;
          }
          body {
            background: white !important;
            color: black !important;
          }
          /* Neutralize themed surfaces for print. */
          .panel-frame,
          .card {
            background: white !important;
            color: black !important;
            border: 1px solid #cbd5e1 !important;
            box-shadow: none !important;
            break-inside: avoid;
          }
          .grid-bg {
            background-image: none !important;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:mt-0 {
            margin-top: 0 !important;
          }
        }
      `,
      }}
    />
  )
}
