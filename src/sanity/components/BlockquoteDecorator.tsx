// Custom blockquote style component for the Sanity Studio editor.
// Sanity's default BlockQuote component (from @sanity/ui) wraps editor content
// in <Text as="p"> → <p>, but the Slate editor renders a <TextContainer> div
// inside it. That <div>-inside-<p> is invalid HTML and React 19 throws a
// hydration error. Using <div> here eliminates the nesting violation.
export function BlockquoteDecorator({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        borderLeft: "3px solid #d1d5db",
        paddingLeft: "0.875em",
        margin: "0.25em 0",
        fontStyle: "italic",
        color: "#4b5563",
      }}
    >
      {children}
    </div>
  );
}
