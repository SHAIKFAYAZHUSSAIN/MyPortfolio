import { Children, cloneElement, isValidElement, type ReactNode, type ReactElement } from "react";

/** Semantic text stays intact; React owns every mask, with no DOM splitting library. */
export function MotionText({ children, calm = false }: { children: ReactNode; calm?: boolean }) {
  const split = (nodes: ReactNode): ReactNode => Children.map(nodes, child => {
    if (typeof child === "string" || typeof child === "number") {
      return String(child).split(/(\s+)/).map((word, i) => /\s/.test(word) ? word :
        <span className="motion-mask" key={`${word}-${i}`}><span className="motion-word">{word}</span></span>);
    }
    if (isValidElement<{ children?: ReactNode }>(child) && child.props.children) {
      return cloneElement(child as ReactElement<{ children?: ReactNode }>, {}, split(child.props.children));
    }
    return child;
  });
  return <span className="motion-text" data-motion-calm={calm || undefined}>{split(children)}</span>;
}
