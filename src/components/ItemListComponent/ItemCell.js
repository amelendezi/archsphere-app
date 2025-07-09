import React, { useState } from 'react';

function ItemCell({ value, width, cellStyle, item, column, tooltipValue }) {
  const [showTooltip, setShowTooltip] = useState(false);

  let conditionalStyles = {};
  if (column && column.cellConditionalStyle) {
    conditionalStyles = column.cellConditionalStyle(item, column.key);
  }

  const cellContentStyle = {
    boxSizing: 'border-box',
    width: width ? `${width}px` : 'auto',
    position: 'relative', // Needed for absolute positioning of tooltip
    ...cellStyle,
    ...conditionalStyles,
  };

  const innerTextStyle = {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  };

  const tooltipStyle = {
    width: '250px',
    backgroundColor: '#E0E0E0',
    color: '#000',
    textAlign: 'left',
    borderRadius: '6px',
    padding: '10px',
    position: 'absolute',
    zIndex: '9999', // High z-index to ensure it's on top
    bottom: 'calc(100% + 5px)', // Position 5px above the cell
    left: '50%',
    transform: 'translateX(-50%)', // Center horizontally
    opacity: showTooltip ? '1' : '0',
    visibility: showTooltip ? 'visible' : 'hidden',
    transition: 'opacity 0.375s',
    border: '1px solid #E0E0E0',
    boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
    fontSize: '0.8em',
  };

  return (
    <div
      style={cellContentStyle}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div style={innerTextStyle}>
        {value}
      </div>
      {showTooltip && tooltipValue && (
        <span style={tooltipStyle}>
          {tooltipValue}
        </span>
      )}
    </div>
  );
}

export default ItemCell;
