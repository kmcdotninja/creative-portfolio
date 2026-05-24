import { Children, cloneElement, isValidElement } from 'react'

// Akkordeon weights mapped via @font-face in index.css.
const WEIGHTS = [200, 400, 600, 800]

// Deterministic, position-aware weight pick. Same string renders the same
// pattern every time — no flicker on re-render.
function pickWeight(ch, i) {
  const code = ch.charCodeAt(0)
  return WEIGHTS[(code * 7 + i * 13 + 3) & 3]
}

// Walk children, wrap each character of every string node in a <span> with a
// per-char font weight. Preserves whitespace, <br>, nested elements, etc.
function transform(node, counter) {
  if (node == null || node === false) return node
  if (typeof node === 'number') node = String(node)

  if (typeof node === 'string') {
    const out = []
    for (let k = 0; k < node.length; k++) {
      const ch = node[k]
      if (/\s/.test(ch)) {
        out.push(ch)
      } else {
        const w = pickWeight(ch, counter.i++)
        out.push(
          <span
            key={`c-${counter.k++}`}
            style={{ fontWeight: w }}
            className="wm__c"
          >
            {ch}
          </span>,
        )
      }
    }
    return out
  }

  if (Array.isArray(node)) {
    return node.map((child) => transform(child, counter))
  }

  if (isValidElement(node)) {
    const children = node.props?.children
    if (children == null) return node
    const newChildren = transform(children, counter)
    return cloneElement(node, { key: node.key }, newChildren)
  }

  return node
}

export default function WeightMix({ children, as: Tag = 'span', ...rest }) {
  const counter = { i: 0, k: 0 }
  const content = Children.map(children, (child) => transform(child, counter))
  return <Tag {...rest}>{content}</Tag>
}
