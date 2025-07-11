import React, { useState } from 'react';
import ItemCell from './ItemCell';

function ItemRow({ item, columns, columnWidths, rowStyle, cellStyle, actionsColumn, onRowClick, selectedItem }) {
  const [isHovered, setIsHovered] = useState(false);

  const isSelected = selectedItem && selectedItem.ID === item.ID; // Assuming 'ID' is unique

  return (
    <div 
      style={{
        display: 'flex',
        marginBottom: '8px', /* Vertical separation */
        backgroundColor: isSelected ? '#90CAF9' : (isHovered ? '#BBDEFB' : '#E3F2FD'), /* Highlight if selected, then hover, then default */
        borderRadius: '8px', /* Rounded corners */
        cursor: 'pointer', /* Indicate clickable */
        ...rowStyle,
        transition: 'background-color 0.3s ease', /* Smooth transition for hover */
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onRowClick && onRowClick(item)} /* Call onRowClick when clicked */
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