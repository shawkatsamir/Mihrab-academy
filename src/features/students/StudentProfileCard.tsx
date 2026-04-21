import { Img } from "@/shared/ui/Image";

interface StudentProfileCardProps {
  name: string;
  id: string;
  ageGroup: string;
  status: "Active" | "Inactive";
  avatar?: string;
}

export function StudentProfileCard({
  name,
  id,
  ageGroup,
  status,
  avatar,
}: StudentProfileCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col items-center text-center">
      <div className="relative mb-4">
        {avatar ? (
          <Img
            src={avatar}
            alt={name}
            width={96}
            height={96}
            className="w-24 h-24 rounded-[32px] object-cover border-4 border-white shadow-sm"
          />
        ) : (
          <div className="w-24 h-24 rounded-[32px] bg-[#EDF3FA] text-[#1A4B7C] flex items-center justify-center font-bold text-3xl border-4 border-white shadow-sm">
            {name.charAt(0)}
          </div>
        )}
      </div>

      <h2 className="text-xl font-bold text-[#1A2B4C] mb-3">{name}</h2>

      <div className="flex flex-wrap items-center justify-center gap-2">
        <span className="px-3 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600">
          {id}
        </span>
        <span className="px-3 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600">
          {ageGroup}
        </span>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium text-white ${
            status === "Active" ? "bg-[#10B981]" : "bg-gray-400"
          }`}
        >
          {status}
        </span>
      </div>
    </div>
  );
}
