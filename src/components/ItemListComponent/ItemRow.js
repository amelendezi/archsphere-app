import ItemCell from './ItemCell';

function ItemRow({ item, columns, columnWidths, rowStyle, cellStyle, actionsColumn }) {
  return (
    <div style={{ display: 'flex', ...rowStyle }}>
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
