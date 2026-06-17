"use client";

import { useState, useCallback } from "react";
import { Upload, FileText, ArrowRight, Check, AlertCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { parseCsv, downloadCsv, ParsedCsv } from "@/lib/csv";
import { useI18n } from "@/lib/i18n";
import { leads as mockLeads, contacts as mockContacts, companies as mockCompanies } from "@/lib/mock-data";
import { useRouter } from "next/navigation";

type ImportEntity = "lead" | "contact" | "company";

interface ColumnMapping {
  csvColumn: string;
  field: string;
}

export default function ImportPage() {
  const [step, setStep] = useState(1);
  const [entity, setEntity] = useState<ImportEntity>("lead");
  const [file, setFile] = useState<File | null>(null);
  const [parsed, setParsed] = useState<ParsedCsv | null>(null);
  const [mappings, setMappings] = useState<ColumnMapping[]>([]);
  const [dedupeMode, setDedupeMode] = useState<"skip" | "update" | "create">("skip");
  const [result, setResult] = useState<{ success: number; skipped: number; failed: number } | null>(null);
  const { t } = useI18n();
  const router = useRouter();

  const fieldOptions: Record<ImportEntity, string[]> = {
    lead: ["name", "company", "email", "phone", "source", "status", "score"],
    contact: ["name", "company", "email", "phone", "position"],
    company: ["name", "website", "industry", "size", "phone", "address"],
  };

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;

    setFile(f);
    const text = await f.text();
    const parsedData = parseCsv(text);
    setParsed(parsedData);

    const autoMappings: ColumnMapping[] = parsedData.headers.map((header) => {
      const fieldMap: Record<string, string> = {
        "name": "name",
        "full name": "name",
        "company": "company",
        "company name": "company",
        "email": "email",
        "email address": "email",
        "phone": "phone",
        "phone number": "phone",
        "source": "source",
        "status": "status",
        "score": "score",
        "website": "website",
        "industry": "industry",
        "position": "position",
        "address": "address",
      };
      return {
        csvColumn: header,
        field: fieldMap[header.toLowerCase()] || "",
      };
    });
    setMappings(autoMappings);
    setStep(2);
  }, []);

  const handleMappingChange = (csvColumn: string, field: string) => {
    setMappings((prev) =>
      prev.map((m) => (m.csvColumn === csvColumn ? { ...m, field } : m))
    );
  };

  const handleImport = () => {
    if (!parsed) return;

    const validMappings = mappings.filter((m) => m.field);
    let success = 0;
    let skipped = 0;

    parsed.rows.forEach((row) => {
      const record: Record<string, string> = {};
      validMappings.forEach((mapping) => {
        const colIndex = parsed.headers.indexOf(mapping.csvColumn);
        if (colIndex >= 0) {
          record[mapping.field] = row[colIndex] || "";
        }
      });

      if (entity === "lead") {
        const existing = mockLeads.find((l) => l.email === record.email);
        if (existing) {
          if (dedupeMode === "skip") {
            skipped++;
          } else if (dedupeMode === "update") {
            success++;
          }
        } else {
          success++;
        }
      } else if (entity === "contact") {
        const existing = mockContacts.find((c) => c.email === record.email);
        if (existing) {
          if (dedupeMode === "skip") skipped++;
          else success++;
        } else {
          success++;
        }
      } else {
        const existing = mockCompanies.find((c) => c.name === record.name);
        if (existing) {
          if (dedupeMode === "skip") skipped++;
          else success++;
        } else {
          success++;
        }
      }
    });

    setResult({ success, skipped, failed: 0 });
    setStep(3);
  };

  const reset = () => {
    setStep(1);
    setFile(null);
    setParsed(null);
    setMappings([]);
    setResult(null);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-poppins text-text-dark">{t("common.import")}</h1>
        <p className="text-text-muted mt-1">Import data from CSV files</p>
      </div>

      <div className="flex items-center gap-2">
        <div className={`flex items-center gap-2 ${step >= 1 ? "text-primary" : "text-text-muted"}`}>
          <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm">1</div>
          <span>Upload</span>
        </div>
        <ArrowRight className="w-4 h-4 text-text-muted" />
        <div className={`flex items-center gap-2 ${step >= 2 ? "text-primary" : "text-text-muted"}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${step >= 2 ? "bg-primary text-white" : "bg-gray-200"}`}>2</div>
          <span>Map Columns</span>
        </div>
        <ArrowRight className="w-4 h-4 text-text-muted" />
        <div className={`flex items-center gap-2 ${step >= 3 ? "text-primary" : "text-text-muted"}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${step >= 3 ? "bg-primary text-white" : "bg-gray-200"}`}>3</div>
          <span>Result</span>
        </div>
      </div>

      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Select Entity Type</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <RadioGroup value={entity} onValueChange={(v) => setEntity(v as ImportEntity)} className="flex gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="lead" id="lead" />
                <Label htmlFor="lead">{t("nav.leads")}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="contact" id="contact" />
                <Label htmlFor="contact">{t("nav.contacts")}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="company" id="company" />
                <Label htmlFor="company">Companies</Label>
              </div>
            </RadioGroup>

            <div className="border-2 border-dashed border-gray-200 rounded-xl p-12 text-center hover:border-primary transition-colors">
              <Upload className="w-12 h-12 mx-auto text-text-muted mb-4" />
              <p className="text-text-dark font-medium mb-2">Drop your CSV file here</p>
              <p className="text-text-muted text-sm mb-4">or click to browse</p>
              <Input type="file" accept=".csv" onChange={handleFileChange} className="hidden" id="file-upload" />
              <Label htmlFor="file-upload" className="cursor-pointer inline-flex">
                <Button variant="outline">Browse Files</Button>
              </Label>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 2 && parsed && (
        <Card>
          <CardHeader>
            <CardTitle>Map Columns</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label>Deduplication Mode</Label>
              <RadioGroup value={dedupeMode} onValueChange={(v) => setDedupeMode(v as typeof dedupeMode)} className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="skip" id="skip" />
                  <Label htmlFor="skip">Skip duplicates</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="update" id="update" />
                  <Label htmlFor="update">Update existing</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="create" id="create" />
                  <Label htmlFor="create">Create new only</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium">CSV Column</th>
                    <th className="px-4 py-2 text-left font-medium">Map to Field</th>
                  </tr>
                </thead>
                <tbody>
                  {mappings.map((mapping) => (
                    <tr key={mapping.csvColumn} className="border-t">
                      <td className="px-4 py-2">{mapping.csvColumn}</td>
                      <td className="px-4 py-2">
                        <select
                          value={mapping.field}
                          onChange={(e) => handleMappingChange(mapping.csvColumn, e.target.value)}
                          className="w-full p-2 border rounded"
                        >
                          <option value="">-- Select field --</option>
                          {fieldOptions[entity].map((field) => (
                            <option key={field} value={field}>
                              {field}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={reset}>
                Back
              </Button>
              <Button onClick={handleImport}>{t("common.import")}</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 3 && result && (
        <Card>
          <CardHeader>
            <CardTitle>Import Complete</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <Check className="w-8 h-8 mx-auto text-green-600 mb-2" />
                <div className="text-2xl font-bold text-green-600">{result.success}</div>
                <div className="text-sm text-green-600">Success</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <AlertCircle className="w-8 h-8 mx-auto text-yellow-600 mb-2" />
                <div className="text-2xl font-bold text-yellow-600">{result.skipped}</div>
                <div className="text-sm text-yellow-600">Skipped</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <X className="w-8 h-8 mx-auto text-red-600 mb-2" />
                <div className="text-2xl font-bold text-red-600">{result.failed}</div>
                <div className="text-sm text-red-600">Failed</div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={reset}>
                Import Another
              </Button>
              <Button onClick={() => router.push(`/${entity}s`)}>
                Go to {entity}s
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}