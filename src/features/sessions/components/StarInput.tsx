"use client";

import { Star } from "lucide-react";

interface Props {
  value: number;
  onChange: (value: number) => void;
  readOnly?: boolean;
  size?: number;
}

export function StarInput({ value, onChange, readOnly, size = 24 }: Props) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          onClick={() => !readOnly && onChange(star)}
          className={`transition-colors ${
            readOnly ? "cursor-default" : "cursor-pointer hover:scale-110"
          }`}
        >
          <Star
            size={size}
            className={
              star <= value
                ? "fill-amber-400 text-amber-400"
                : "fill-gray-100 text-gray-300"
            }
          />
        </button>
      ))}
    </div>
  );
}
