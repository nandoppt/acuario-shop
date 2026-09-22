"use client";

import { useMemo } from "react";

import { ECUADOR_LOCATIONS } from "@/data/ecuador-locations";

type LocationSelectProps = {
  province: string;
  canton: string;
  parish: string;
  onProvinceChange: (value: string) => void;
  onCantonChange: (value: string) => void;
  onParishChange: (value: string) => void;
};

export function LocationSelect({
  province,
  canton,
  parish,
  onProvinceChange,
  onCantonChange,
  onParishChange,
}: LocationSelectProps) {
  const selectedProvince = useMemo(
    () =>
      ECUADOR_LOCATIONS.find(
        (item) => item.name === province,
      ),
    [province],
  );

  const selectedCanton = useMemo(
    () =>
      selectedProvince?.cantons.find(
        (item) => item.name === canton,
      ),
    [selectedProvince, canton],
  );

  const cantons =
    selectedProvince?.cantons ?? [];

  const parishes =
    selectedCanton?.parishes ?? [];

  const urbanParishes = parishes.filter(
    (parish) => parish.type === "urbana",
  );

  const ruralParishes = parishes.filter(
    (parish) => parish.type === "rural",
  );

  return (
    <>
      {/* Provincia */}
      <div>
        <label
          htmlFor="province"
          className="mb-2 block text-sm font-medium"
        >
          Provincia
        </label>

        <select
          id="province"
          required
          value={province}
          onChange={(event) =>
            onProvinceChange(event.target.value)
          }
          className="h-12 w-full rounded-xl border border-border bg-background px-4 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
        >
          <option value="">
            Selecciona una provincia
          </option>

          {ECUADOR_LOCATIONS.map((item) => (
            <option
              key={item.code}
              value={item.name}
            >
              {item.name}
            </option>
          ))}
        </select>
      </div>

      {/* Cantón */}
      <div>
        <label
          htmlFor="canton"
          className="mb-2 block text-sm font-medium"
        >
          Cantón
        </label>

        <select
          id="canton"
          required
          value={canton}
          disabled={!province}
          onChange={(event) =>
            onCantonChange(event.target.value)
          }
          className="h-12 w-full rounded-xl border border-border bg-background px-4 outline-none transition disabled:cursor-not-allowed disabled:opacity-50 focus:border-primary focus:ring-2 focus:ring-primary/20"
        >
          <option value="">
            {province
              ? "Selecciona un cantón"
              : "Selecciona primero una provincia"}
          </option>

          {cantons.map((item) => (
            <option
              key={item.code}
              value={item.name}
            >
              {item.name}
            </option>
          ))}
        </select>
      </div>

      {/* Parroquia */}
      <div className="md:col-span-2">
        <label
          htmlFor="parish"
          className="mb-2 block text-sm font-medium"
        >
          Parroquia
        </label>

        <select
          id="parish"
          required
          value={parish}
          disabled={!canton}
          onChange={(event) =>
            onParishChange(event.target.value)
          }
          className="h-12 w-full rounded-xl border border-border bg-background px-4 outline-none transition disabled:cursor-not-allowed disabled:opacity-50 focus:border-primary focus:ring-2 focus:ring-primary/20"
        >
          <option value="">
            {canton
              ? "Selecciona una parroquia"
              : "Selecciona primero un cantón"}
          </option>

          {urbanParishes.length > 0 && (
            <optgroup label="Urbanas">
              {urbanParishes.map((item) => (
                <option
                  key={item.code}
                  value={item.name}
                >
                  {item.name}
                </option>
              ))}
            </optgroup>
          )}

          {ruralParishes.length > 0 && (
            <optgroup label="Rurales">
              {ruralParishes.map((item) => (
                <option
                  key={item.code}
                  value={item.name}
                >
                  {item.name}
                </option>
              ))}
            </optgroup>
          )}
        </select>
      </div>
    </>
  );
}