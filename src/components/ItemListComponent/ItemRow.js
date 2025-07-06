import ItemCell from './ItemCell';

function ItemRow({ item, columns, columnWidths, rowStyle, cellStyle }) {
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
        />
      ))}
    </div>
  );
}

export default ItemRow;
