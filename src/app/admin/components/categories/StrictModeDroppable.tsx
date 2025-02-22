'use client';

import { useEffect, useState } from 'react';
import { Droppable, DroppableProps } from 'react-beautiful-dnd';

// Definimos los valores por defecto usando parámetros de JavaScript
export function StrictModeDroppable({
  children,
  direction = 'vertical',
  type = 'DEFAULT',
  mode = 'standard',
  ...props
}: DroppableProps) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));
    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);

  if (!enabled) {
    return null;
  }

  return (
    <Droppable
      direction={direction}
      type={type}
      mode={mode}
      {...props}
    >
      {children}
    </Droppable>
  );
} 