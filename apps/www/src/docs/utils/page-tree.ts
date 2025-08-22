import type { FolderNode, PageNode, TreeNode } from '../source'

function flattenTree(nodes: TreeNode[]): PageNode[] {
  const list: PageNode[] = []
  for (const node of nodes) {
    if (node.type === 'page') {
      list.push(node)
    }
    else if (node.type === 'folder') {
      if (node.index) {
        list.push(node.index)
      }
      list.push(...flattenTree(node.children))
    }
  }
  return list
}

export function findNeighbour(
  tree: FolderNode,
  url: string,
): {
  previous?: PageNode
  next?: PageNode
} {
  const list = flattenTree(tree.children)

  const idx = list.findIndex(item => item.url === url)
  if (idx === -1)
    return {}

  return {
    previous: list[idx - 1],
    next: list[idx + 1],
  }
}
