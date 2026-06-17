export interface ParsedCsv {
  headers: string[];
  rows: string[][];
}

export function parseCsv(text: string, delimiter: string = ","): ParsedCsv {
  const lines = text.split(/\r?\n/).filter((line) => line.trim());
  if (lines.length === 0) {
    return { headers: [], rows: [] };
  }

  const parseRow = (line: string): string[] => {
    const result: string[] = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const nextChar = line[i + 1];

      if (inQuotes) {
        if (char === '"' && nextChar === '"') {
          current += '"';
          i++;
        } else if (char === '"') {
          inQuotes = false;
        } else {
          current += char;
        }
      } else {
        if (char === '"') {
          inQuotes = true;
        } else if (char === delimiter) {
          result.push(current.trim());
          current = "";
        } else {
          current += char;
        }
      }
    }
    result.push(current.trim());
    return result;
  };

  const headers = parseRow(lines[0]);
  const rows = lines.slice(1).map(parseRow);

  return { headers, rows };
}

export function toCsv(
  rows: Record<string, unknown>[],
  columns?: string[],
  headers?: Record<string, string>
): string {
  const cols = columns ?? (rows.length > 0 ? Object.keys(rows[0]) : []);
  const headerRow = cols.map((col) => {
    const header = headers?.[col] ?? col;
    return escapeCsvValue(header);
  });

  const dataRows = rows.map((row) =>
    cols.map((col) => escapeCsvValue(String(row[col] ?? "")))
  );

  const delimiter = ",";
  return [headerRow.join(delimiter), ...dataRows.map((r) => r.join(delimiter))].join("\n");
}

function escapeCsvValue(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function downloadCsv(content: string, filename: string): void {
  const BOM = "\uFEFF";
  const blob = new Blob([BOM + content], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
