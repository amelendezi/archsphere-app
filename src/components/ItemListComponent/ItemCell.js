import React from 'react';

function ItemCell({ value, width, cellStyle, item, column }) {
  let conditionalStyles = {};
  if (column && column.cellConditionalStyle) {
    conditionalStyles = column.cellConditionalStyle(item, column.key);
  }

  const cellContentStyle = {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    width: width ? `${width}px` : 'auto',
    ...cellStyle,
    ...conditionalStyles,
  };

  return (
    <div style={cellContentStyle} title={value}>
      {value}
    </div>
  );
}

export default ItemCell;
