import React from 'react';

function ItemCell({ value, width, cellStyle }) {
  const cellContentStyle = {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    width: width ? `${width}px` : 'auto',
    ...cellStyle,
  };

  return (
    <div style={cellContentStyle} title={value}>
      {value}
    </div>
  );
}

export default ItemCell;
