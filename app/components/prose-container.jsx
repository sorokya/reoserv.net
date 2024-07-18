export function ProseContainer({ children, className = '' }) {
  return <article className={`prose ${className}`}>{children}</article>;
}
