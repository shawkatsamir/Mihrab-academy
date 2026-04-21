"use client";
import { X, Upload } from "lucide-react";

interface AddSupervisorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddSupervisorDrawer({
  isOpen,
  onClose,
}: AddSupervisorDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-[400px] bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">Add Supervisor</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Photo Upload */}
          <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group">
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-3 shadow-sm group-hover:text-blue-600 transition-colors">
              <Upload className="w-6 h-6 text-gray-400 group-hover:text-blue-600 transition-colors" />
            </div>
            <span className="text-sm font-medium text-gray-900">
              Upload profile photo
            </span>
          </div>

          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-900">
              Full Name
            </label>
            <input
              type="text"
              placeholder="e.g. Yusuf M."
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-900">
              Email Address
            </label>
            <input
              type="email"
              placeholder="yusuf@miharab.com"
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        <div className="p-6 border-t border-gray-100">
          <button className="w-full py-2.5 bg-[#1A2B4C] hover:bg-[#0f192d] text-white text-sm font-medium rounded-lg transition-colors">
            Create Supervisor
          </button>
        </div>
      </div>
    </div>
  );
}
