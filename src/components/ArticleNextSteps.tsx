import { Children, Fragment, cloneElement, isValidElement, type ReactNode } from "react";
import { parseDocument } from "htmlparser2";
import render from "dom-serializer";
import NastaSteg from "@/components/NastaSteg";
import { articleBuyingStep } from "@/lib/inquirySelection";

/** Preserve article nodes/citations, inserting only between top-level blocks. */
export default function ArticleNextSteps({ content, topic }: { content: ReactNode; topic: string }) {
  const step = articleBuyingStep(topic);
  const block = <NastaSteg typ="kunskapsartikel" articleStep={step} />;
  const flatten = (node: ReactNode): ReactNode[] => Children.toArray(node).flatMap(child => {
    if (isValidElement<{ children?: ReactNode }>(child) && child.type === Fragment) return flatten(child.props.children);
    return [child];
  });
  const nodes = flatten(content);
  // Word articles use an HTML container; split with a parser, not a browser-only DOM.
  const insert = (node: ReactNode): ReactNode => {
    if (!isValidElement<{ children?: ReactNode; dangerouslySetInnerHTML?: { __html: string } }>(node)) return <>{node}{block}</>;
    const html = node.props.dangerouslySetInnerHTML?.__html;
    if (typeof html === "string") {
      const parts = parseDocument(html).children;
      const at = Math.max(1, Math.ceil(parts.length / 3));
      return <>{cloneElement(node, { dangerouslySetInnerHTML: { __html: render(parts.slice(0, at)) } })}{block}{cloneElement(node, { dangerouslySetInnerHTML: { __html: render(parts.slice(at)) } })}</>;
    }
    const children = flatten(node.props.children);
    if (children.length === 1 && isValidElement(children[0])) return cloneElement(node, {}, insert(children[0]));
    const at = Math.max(1, Math.ceil(children.length / 3));
    return cloneElement(node, {}, <>{children.slice(0, at)}{block}{children.slice(at)}</>);
  };
  const at = Math.max(1, Math.ceil(nodes.length / 3));
  return <>{nodes.length === 1 ? insert(nodes[0]) : <>{nodes.slice(0, at)}{block}{nodes.slice(at)}</>}{block}</>;
}