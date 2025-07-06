import React, { useState, useEffect, useRef } from 'react';
import ItemRow from './ItemRow';

function ItemList({ dataFetcher, columns, listMaxWidth, listStyle, headerStyle, rowStyle, cellStyle, refreshTrigger }) {
  const [items, setItems] = useState([]);
  const [calculatedColumnWidths, setCalculatedColumnWidths] = useState(new Map());
  const listRef = useRef(null);

  const calculateWidths = (containerWidth) => {
    if (!containerWidth || !columns || columns.length === 0) {
      setCalculatedColumnWidths(new Map());
      return;
    }

    let totalMinWidth = 0;
    let totalFlexGrow = 0;
    const newWidths = new Map();

    // First pass: calculate minWidths and total flexGrow
    columns.forEach(col => {
      let minPxWidth = 0;
      if (col.minWidth) {
        if (typeof col.minWidth === 'string' && col.minWidth.endsWith('px')) {
          minPxWidth = parseFloat(col.minWidth);
        } else if (typeof col.minWidth === 'string' && col.minWidth.endsWith('%')) {
          minPxWidth = (parseFloat(col.minWidth) / 100) * containerWidth;
        } else {
          minPxWidth = col.minWidth; // Assume number in px
        }
      }
      newWidths.set(col.key, minPxWidth);
      totalMinWidth += minPxWidth;
      totalFlexGrow += (col.flexGrow || 0);
    });

    let remainingWidth = containerWidth - totalMinWidth;

    // Second pass: distribute flexGrow and apply maxWidth
    columns.forEach(col => {
      let colWidth = newWidths.get(col.key);
      if (col.flexGrow && totalFlexGrow > 0) {
        colWidth += (remainingWidth * (col.flexGrow / totalFlexGrow));
      }

      let maxPxWidth = Infinity;
      if (col.maxWidth) {
        if (typeof col.maxWidth === 'string' && col.maxWidth.endsWith('px')) {
          maxPxWidth = parseFloat(col.maxWidth);
        } else if (typeof col.maxWidth === 'string' && col.maxWidth.endsWith('%')) {
          maxPxWidth = (parseFloat(col.maxWidth) / 100) * containerWidth;
        } else {
          maxPxWidth = col.maxWidth; // Assume number in px
        }
      }
      newWidths.set(col.key, Math.min(colWidth, maxPxWidth));
    });

    // Adjust if total width exceeds container after maxWidth clamping
    let currentTotalWidth = Array.from(newWidths.values()).reduce((sum, w) => sum + w, 0);
    if (currentTotalWidth > containerWidth) {
      let overflow = currentTotalWidth - containerWidth;
      // Simple proportional reduction for now, can be more sophisticated
      columns.forEach(col => {
        let colWidth = newWidths.get(col.key);
        newWidths.set(col.key, colWidth - (overflow * (colWidth / currentTotalWidth)));
      });
    }
    // Adjust if total width is less than container
    else if (currentTotalWidth < containerWidth) {
      let underflow = containerWidth - currentTotalWidth;
      // Add the remaining space to the last column
      if (columns.length > 0) {
        const lastColKey = columns[columns.length - 1].key;
        newWidths.set(lastColKey, newWidths.get(lastColKey) + underflow);
      }
    }

    setCalculatedColumnWidths(newWidths);
  };

  useEffect(() => {
    const fetchItems = async () => {
      if (dataFetcher) {
        const data = await dataFetcher();
        setItems(data);
      }
    };
    fetchItems();
  }, [dataFetcher, refreshTrigger]); // refreshTrigger added to re-fetch data

  useEffect(() => {
    const observer = new ResizeObserver(entries => {
      for (let entry of entries) {
        if (entry.target === listRef.current) {
          calculateWidths(entry.contentRect.width);
        }
      }
    });

    if (listRef.current) {
      observer.observe(listRef.current);
    }

    // Initial calculation
    if (listRef.current && listRef.current.offsetWidth) {
      calculateWidths(listRef.current.offsetWidth);
    }

    return () => {
      if (listRef.current) {
        observer.unobserve(listRef.current);
      }
    };
  }, [columns, listMaxWidth]); // Recalculate on column or max width changes

  return (
    <div ref={listRef} style={{ width: listMaxWidth, ...listStyle }}>
      <div style={{ display: 'flex' }}>
        {columns.map((col) => (
          <div
            key={col.key}
            style={{
              width: calculatedColumnWidths.get(col.key) ? `${calculatedColumnWidths.get(col.key)}px` : 'auto',
              fontWeight: 'bold',
              border: '1px solid #ddd',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              ...headerStyle
            }}
          >
            {col.header}
          </div>
        ))}
      </div>
      {items.map((item, index) => (
        <ItemRow
          key={item.ID || index} // Assuming ID exists, fallback to index
          item={item}
          columns={columns}
          columnWidths={calculatedColumnWidths}
          rowStyle={rowStyle}
          cellStyle={cellStyle}
        />
      ))}
    </div>
  );
}

export default ItemList;
