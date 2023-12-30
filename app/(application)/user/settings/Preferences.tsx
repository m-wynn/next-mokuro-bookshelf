"use client";
import { useState } from "react";
import React from "react";
import { Role } from "@prisma/client";
import { faTableColumns } from "@fortawesome/free-solid-svg-icons";
import Checkbox from "@/checkbox";

export default function Preferences({ user, updateUseTwoPages }) {
  const [useTwoPages, setUseTwoPages] = useState(user.userSetting?.useTwoPages);

  return (
    <div className="flex flex-col max-w-4xl grow">
      <div className="card bg-base-300 rounded-box">
        <div className="items-center card-body">
          <h2 className="card-title">Preferences</h2>
          <Checkbox
            fa={faTableColumns}
            value={useTwoPages}
            set={(checked) => {
              updateUseTwoPages(checked);
              setUseTwoPages(checked);
            }}
          >
            Display Two Pages
          </Checkbox>
        </div>
      </div>
    </div>
  );
}
