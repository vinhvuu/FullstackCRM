import { Company } from "@/types";
import { formatDate } from "@/lib/utils";
import { Building2, Globe, Phone, Users, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface CompanyTableProps {
  companies: Company[];
}

export function CompanyTable({ companies }: CompanyTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-100">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-100">
            <th className="text-left px-4 py-3 font-medium text-text-muted">Tên công ty</th>
            <th className="text-left px-4 py-3 font-medium text-text-muted">Ngành nghề</th>
            <th className="text-left px-4 py-3 font-medium text-text-muted">Quy mô</th>
            <th className="text-left px-4 py-3 font-medium text-text-muted">Liên hệ</th>
            <th className="text-left px-4 py-3 font-medium text-text-muted">Ngày tạo</th>
            <th className="w-10" />
          </tr>
        </thead>
        <tbody>
          {companies.map((company) => (
            <tr
              key={company.id}
              className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
            >
              <td className="px-4 py-3">
                <Link href={`/companies/${company.id}`} className="flex items-center gap-3 group">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                    {company.name[0]}
                  </div>
                  <div>
                    <p className="font-medium text-text-dark group-hover:text-indigo-600 transition-colors">
                      {company.name}
                    </p>
                    {company.website && (
                      <p className="text-xs text-text-muted">{company.website}</p>
                    )}
                  </div>
                </Link>
              </td>
              <td className="px-4 py-3 text-text-muted">
                {company.industry || "—"}
              </td>
              <td className="px-4 py-3 text-text-muted">
                {company.size ? `${company.size} người` : "—"}
              </td>
              <td className="px-4 py-3">
                <span className="text-xs font-medium text-indigo-600">
                  {company.contactCount ?? 0} liên hệ
                </span>
              </td>
              <td className="px-4 py-3 text-text-muted">
                {company.createdAt ? formatDate(company.createdAt) : "—"}
              </td>
              <td className="px-4 py-3">
                <Link href={`/companies/${company.id}`}>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
