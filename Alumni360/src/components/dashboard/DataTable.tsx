import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

interface Column<T> {
  key: string;
  label: string;
  render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  title: string;
  icon?: React.ElementType;
  data: T[];
  columns: Column<T>[];
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  pageSize?: number;
  actions?: (item: T) => React.ReactNode;
  emptyMessage?: string;
}

function DataTable<T extends Record<string, any>>({
  title,
  icon: Icon,
  data,
  columns,
  searchPlaceholder = 'Search...',
  onSearch,
  pageSize = 10,
  actions,
  emptyMessage = 'No data found.'
}: DataTableProps<T>) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const filteredData = onSearch ? data : data.filter(item =>
    columns.some(col => {
      const val = item[col.key];
      return val && String(val).toLowerCase().includes(search.toLowerCase());
    })
  );

  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = filteredData.slice((page - 1) * pageSize, page * pageSize);

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
    if (onSearch) onSearch(value);
  };

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="flex items-center gap-2">
            {Icon && <Icon className="w-5 h-5 text-primary" />}
            {title}
            <Badge variant="secondary" className="ml-2">{filteredData.length}</Badge>
          </CardTitle>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              value={search}
              onChange={e => handleSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {paginatedData.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">{emptyMessage}</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    {columns.map(col => (
                      <th key={col.key} className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        {col.label}
                      </th>
                    ))}
                    {actions && (
                      <th className="text-right py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((item, idx) => (
                    <tr key={idx} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      {columns.map(col => (
                        <td key={col.key} className="py-3 px-4 text-sm text-foreground">
                          {col.render ? col.render(item) : String(item[col.key] ?? '—')}
                        </td>
                      ))}
                      {actions && (
                        <td className="py-3 px-4 text-right">
                          {actions(item)}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
                <p className="text-xs text-muted-foreground">
                  Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, filteredData.length)} of {filteredData.length}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => setPage(p => p - 1)}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="text-sm font-medium">{page} / {totalPages}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= totalPages}
                    onClick={() => setPage(p => p + 1)}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default DataTable;
