import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
}

// `T extends object` (not `Record<string, unknown>`) deliberately — a plain
// interface like `{ _id: string; name: string }` does not structurally
// satisfy a `Record<string, unknown>` generic constraint (TS requires an
// explicit index signature for that), even though every property is
// unknown-compatible. Property access below goes through an internal cast
// instead, so callers keep their real, precise types.
function asRecord(item: object): Record<string, unknown> {
  return item as Record<string, unknown>;
}

function rowKey(item: object, index: number): string {
  const record = asRecord(item);
  const id = record._id ?? record.id;
  return typeof id === 'string' ? id : String(index);
}

function cellValue(item: object, key: string): React.ReactNode {
  const value = asRecord(item)[key];
  if (value === null || value === undefined) return null;
  if (typeof value === 'string' || typeof value === 'number') return value;
  return String(value);
}

export function DataTable<T extends object>({
  data,
  columns,
  emptyMessage = "No results found.",
  onRowClick
}: DataTableProps<T>) {
  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead key={col.key}>{col.header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            data.map((item, i) => (
              <TableRow
                key={rowKey(item, i)}
                onClick={() => onRowClick && onRowClick(item)}
                className={onRowClick ? "cursor-pointer hover:bg-gray-50" : ""}
              >
                {columns.map((col) => (
                  <TableCell key={`${rowKey(item, i)}-${col.key}`}>
                    {col.render ? col.render(item) : cellValue(item, col.key)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
