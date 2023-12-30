"use client";
import { useState } from "react";
import React from "react";
import { updateUseTwoPages } from "./functions";
import { faTableColumns } from "@fortawesome/free-solid-svg-icons";
import Checkbox from "@/checkbox";

export default function Preferences({
  user,
}: {
  user: { userSetting: { useTwoPages: boolean } | null };
}) {
  const [useTwoPages, setUseTwoPages] = useState(user.userSetting?.useTwoPages);

  return (
    <div className="flex flex-col max-w-2xl grow">
      <div className="card bg-base-300 rounded-box">
        <div className="items-center card-body">
          <h2 className="card-title">Preferences</h2>
          <div className="w-full">
            <Checkbox
              fa={faTableColumns}
              value={useTwoPages || false}
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
    </div>
  );
}
