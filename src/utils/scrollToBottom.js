/**
 * Smoothly scroll a React Ref element into view.
 * @param {React.RefObject} ref - The React Ref element
 */
export function scrollToBottom(ref) {
  if (ref && ref.current) {
    ref.current.scrollIntoView({ behavior: "smooth" });
  }
}
