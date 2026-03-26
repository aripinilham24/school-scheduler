import {
  Table, TableBody, TableCaption, TableCell,
  TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Clock } from "lucide-react";
import { teachers } from "@/assets/data/dataTeachers";

const AVATAR_COLORS = [
  { bg: "bg-[rgba(108,99,255,0.12)]", text: "text-[#534AB7]" },
  { bg: "bg-[rgba(29,158,117,0.12)]", text: "text-[#0F6E56]" },
  { bg: "bg-[rgba(216,90,48,0.12)]",  text: "text-[#993C1D]" },
  { bg: "bg-[rgba(212,83,126,0.12)]", text: "text-[#993556]" },
];

function getInitials(name) {
  return name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

export default function Teacher() {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-[17px] font-semibold text-[#08060d] tracking-tight">Teachers</h1>
        <p className="text-xs text-[#6b6375] mt-0.5">Jadwal Mengajar</p>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-[14px] border border-[#E5E7EB] overflow-hidden">
        <Table>
          <TableCaption className="py-2.5 text-[11px] text-[#9ca3af]">
            Daftar jadwal mengajar seluruh guru
          </TableCaption>
          <TableHeader>
            <TableRow className="bg-[#F8FAFC] hover:bg-[#F8FAFC] border-b border-[#E5E7EB]">
              {["Nama Guru", "NUPTK", "Mata Pelajaran"].map((h) => (
                <TableHead key={h} className="text-[11px] font-semibold text-[#9ca3af] uppercase tracking-[0.06em] py-2.5 px-3.5">
                  {h}
                </TableHead>
              ))}
              <TableHead className="text-right text-[11px] font-semibold text-[#9ca3af] uppercase tracking-[0.06em] py-2.5 px-3.5">Jam</TableHead>
              <TableHead className="text-right text-[11px] font-semibold text-[#9ca3af] uppercase tracking-[0.06em] py-2.5 px-3.5">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teachers.map((teacher, ti) =>
              teacher.schedules.map((schedule, si) => {
                const c = AVATAR_COLORS[ti % AVATAR_COLORS.length];
                return (
                  <TableRow
                    key={`${teacher.id}-${si}`}
                    className="border-b border-[#F3F4F6] hover:bg-[rgba(108,99,255,0.03)] transition-colors"
                  >
                    <TableCell className="px-3.5 py-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-[30px] h-[30px] rounded-full ${c.bg} ${c.text} flex items-center justify-center text-[11px] font-semibold shrink-0`}>
                          {getInitials(teacher.name)}
                        </div>
                        <span className="font-medium text-[13px] text-[#08060d]">{teacher.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-3.5 py-2.5 font-mono text-[11px] text-[#9ca3af]">
                      {teacher.nuptk}
                    </TableCell>
                    <TableCell className="px-3.5 py-2.5">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[rgba(108,99,255,0.1)] text-[#534AB7]">
                        {schedule.subject}
                      </span>
                    </TableCell>
                    <TableCell className="px-3.5 py-2.5 text-right">
                      <span className="inline-flex items-center gap-1 text-[12px] text-[#6b6375]">
                        <Clock className="w-3 h-3" />
                        {schedule.time}
                      </span>
                    </TableCell>
                    <TableCell className="px-3.5 py-2.5 text-right">
                      <div className="flex justify-end gap-1.5">
                        <Button variant="outline" size="sm"
                          className="h-7 px-3 text-[11px] font-medium rounded-lg border-[#E5E7EB] text-[#374151] hover:bg-[#F8FAFC] gap-1">
                          <Pencil className="w-3 h-3" /> Edit
                        </Button>
                        <Button size="sm"
                          className="h-7 px-3 text-[11px] font-medium rounded-lg bg-[#FEF2F2] border border-[#FCA5A5] text-[#B91C1C] hover:bg-[#FEE2E2] gap-1">
                          <Trash2 className="w-3 h-3" /> Hapus
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}