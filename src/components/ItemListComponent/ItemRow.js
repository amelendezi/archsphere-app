import React, { useState } from 'react';
import ItemCell from './ItemCell';

function ItemRow({ item, columns, columnWidths, rowStyle, cellStyle, actionsColumn }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      style={{
        display: 'flex',
        marginBottom: '8px', /* Vertical separation */
        backgroundColor: isHovered ? '#BBDEFB' : '#E3F2FD', /* Light blue background, darker on hover */
        borderRadius: '8px', /* Rounded corners */
        ...rowStyle,
        transition: 'background-color 0.3s ease', /* Smooth transition for hover */
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {columns.map((column) => (
        <ItemCell
          key={column.key}
          value={item[column.key]}
          width={columnWidths.get(column.key)}
          cellStyle={cellStyle}
          item={item}
          column={column}
          tooltipValue={column.getTooltipValue ? column.getTooltipValue(item) : undefined}
        />
      ))}
      {actionsColumn && (
        <div
          key="actions-cell"
          style={{
            boxSizing: 'border-box',
            width: columnWidths.get('actions') ? `${columnWidths.get('actions')}px` : 'auto',
            ...cellStyle,
          }}
        >
          {actionsColumn.renderCell(item, (actionType) => actionsColumn.onAction(actionType, item))}
        </div>
      )}
    </div>
  );
}

export default ItemRow;