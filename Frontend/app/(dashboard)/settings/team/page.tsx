"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plus, MoreHorizontal, Mail, Phone } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const teamMembers = [
  {
    id: "1",
    name: "Hoàng An",
    email: "hoangan@company.com",
    phone: "0901234567",
    role: "Admin",
    status: "online",
    avatar: "HA",
  },
  {
    id: "2",
    name: "Minh Tuấn",
    email: "mintuan@company.com",
    phone: "0902345678",
    role: "Sales",
    status: "online",
    avatar: "MT",
  },
  {
    id: "3",
    name: "Thu Hà",
    email: "thuha@company.com",
    phone: "0903456789",
    role: "Sales",
    status: "offline",
    avatar: "TH",
  },
  {
    id: "4",
    name: "Đức Thắng",
    email: "ducthang@company.com",
    phone: "0904567890",
    role: "Manager",
    status: "online",
    avatar: "DT",
  },
];

export default function TeamPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-poppins text-text-dark">Team</h1>
          <p className="text-text-muted mt-1">Manage your team members</p>
        </div>
        <Button variant="cta" className="gap-2">
          <Plus className="w-4 h-4" />
          Add Member
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teamMembers.map((member) => (
          <Card key={member.id} className="hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-primary text-white font-semibold">
                        {member.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                        member.status === "online" ? "bg-cta" : "bg-gray-400"
                      }`}
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-dark">{member.name}</h3>
                    <Badge variant="default" className="text-xs mt-1">
                      {member.role}
                    </Badge>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="w-8 h-8">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem>Change Role</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">Remove</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-text-muted">
                  <Mail className="w-4 h-4" />
                  <span>{member.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-text-muted">
                  <Phone className="w-4 h-4" />
                  <span>{member.phone}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
