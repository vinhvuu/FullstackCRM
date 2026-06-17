import { Company } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Globe, Phone, Users, TrendingUp } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";

interface CompanyCardProps {
  company: Company;
}

export function CompanyCard({ company }: CompanyCardProps) {
  return (
    <Link href={`/companies/${company.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer group">
        <CardContent className="p-5">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {company.name[0]}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-text-dark group-hover:text-indigo-600 transition-colors truncate">
                {company.name}
              </p>
              {company.industry && (
                <p className="text-xs text-text-muted truncate">{company.industry}</p>
              )}
            </div>
          </div>

          <div className="space-y-2 text-sm">
            {company.website && (
              <div className="flex items-center gap-2 text-text-muted">
                <Globe className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">{company.website}</span>
              </div>
            )}
            {company.phone && (
              <div className="flex items-center gap-2 text-text-muted">
                <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{company.phone}</span>
              </div>
            )}
            {company.size && (
              <div className="flex items-center gap-2 text-text-muted">
                <Users className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{company.size} nhân viên</span>
              </div>
            )}
          </div>

          {(company.contactCount !== undefined || company.openDealCount !== undefined) && (
            <div className="flex gap-4 mt-4 pt-4 border-t border-gray-100 text-xs text-text-muted">
              {company.contactCount !== undefined && (
                <span>{company.contactCount} liên hệ</span>
              )}
              {company.openDealCount !== undefined && company.openDealCount > 0 && (
                <span className="text-green-600 font-medium">
                  {company.openDealCount} deal
                  {company.openDealValue ? ` · ${formatCurrency(company.openDealValue)}` : ""}
                </span>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
