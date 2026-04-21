import { User, Calendar, Phone, MapPin } from "lucide-react";

interface PersonalInfoCardProps {
  gender: string;
  dateOfBirth: string;
  phone: string;
  address: string;
}

export function PersonalInfoCard({
  gender,
  dateOfBirth,
  phone,
  address,
}: PersonalInfoCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
      <h3 className="text-[#1A2B4C] font-semibold mb-6">Personal Info</h3>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-gray-500">
            <User className="w-4 h-4" />
            <span className="text-sm">Gender</span>
          </div>
          <span className="text-sm font-medium text-gray-900">{gender}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-gray-500">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">Date of Birth</span>
          </div>
          <span className="text-sm font-medium text-gray-900">
            {dateOfBirth}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-gray-500">
            <Phone className="w-4 h-4" />
            <span className="text-sm">Phone Number</span>
          </div>
          <span className="text-sm font-medium text-gray-900">{phone}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-gray-500">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">Address</span>
          </div>
          <span
            className="text-sm font-medium text-gray-900 text-right max-w-[150px] truncate"
            title={address}
          >
            {address}
          </span>
        </div>
      </div>
    </div>
  );
}
