import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

export function useClipDragAndDrop(clipId: string, enabled: boolean = false) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: clipId,
    disabled: !enabled,
  })

  const style = enabled
    ? {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
      }
    : undefined

  const dragProps = enabled
    ? {
        ref: setNodeRef,
        style,
        ...attributes,
        ...listeners,
      }
    : {}

  return {
    dragProps,
    isDragging,
  }
}
