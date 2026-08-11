"use client";

import { useState } from "react";
import { saveCard } from "@/app/admin/actions";

export type CardFormData = {
  id: string;
  name: string;
  setName: string;
  cardNumber: string;
  rarity: string;
  conditionType: string;
  rawCondition: string | null;
  grader: string | null;
  grade: string | null;
  priceCents: number;
  costCents: number;
  description: string | null;
  featured: boolean;
};

const inputClass =
  "w-full rounded-lg border border-navy-600 bg-navy-800 px-3 py-2.5 text-sm text-ink-100 placeholder:text-ink-500 focus:border-gold-400 focus:outline-none";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-ink-300">{label}</span>
      {children}
    </label>
  );
}

export function CardForm({ card }: { card?: CardFormData }) {
  const [conditionType, setConditionType] = useState(card?.conditionType ?? "RAW");
  const [saving, setSaving] = useState(false);

  return (
    <form
      action={saveCard}
      onSubmit={() => setSaving(true)}
      className="flex max-w-2xl flex-col gap-4"
    >
      {card && <input type="hidden" name="id" value={card.id} />}

      <Field label="Card name *">
        <input
          name="name"
          required
          defaultValue={card?.name ?? ""}
          placeholder="e.g. Charizard ex"
          className={inputClass}
        />
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Set *">
          <input
            name="setName"
            required
            defaultValue={card?.setName ?? ""}
            placeholder="e.g. Obsidian Flames"
            className={inputClass}
          />
        </Field>
        <Field label="Card number">
          <input
            name="cardNumber"
            defaultValue={card?.cardNumber ?? ""}
            placeholder="e.g. 125/197"
            className={inputClass}
          />
        </Field>
      </div>

      <Field label="Rarity">
        <input
          name="rarity"
          list="rarity-options"
          defaultValue={card?.rarity ?? ""}
          placeholder="e.g. Special Illustration Rare"
          className={inputClass}
        />
        <datalist id="rarity-options">
          {[
            "Common",
            "Uncommon",
            "Rare",
            "Holo Rare",
            "Double Rare",
            "Ultra Rare",
            "Illustration Rare",
            "Special Illustration Rare",
            "Hyper Rare",
            "Promo",
          ].map((r) => (
            <option key={r} value={r} />
          ))}
        </datalist>
      </Field>

      {/* Condition */}
      <fieldset className="rounded-xl border border-navy-700/60 bg-navy-900 p-4">
        <legend className="px-1 text-sm font-medium text-ink-300">Condition</legend>
        <div className="flex gap-2">
          {["RAW", "GRADED"].map((t) => (
            <label
              key={t}
              className={`flex-1 cursor-pointer rounded-lg border px-3 py-2.5 text-center text-sm font-semibold transition ${
                conditionType === t
                  ? "border-gold-400 bg-gold-400/10 text-gold-300"
                  : "border-navy-600 text-ink-400 hover:bg-navy-800"
              }`}
            >
              <input
                type="radio"
                name="conditionType"
                value={t}
                checked={conditionType === t}
                onChange={() => setConditionType(t)}
                className="sr-only"
              />
              {t === "RAW" ? "Raw" : "Graded"}
            </label>
          ))}
        </div>

        {conditionType === "RAW" ? (
          <div className="mt-3">
            <Field label="Raw condition">
              <select
                name="rawCondition"
                defaultValue={card?.rawCondition ?? "NM"}
                className={inputClass}
              >
                <option value="NM">Near Mint (NM)</option>
                <option value="LP">Lightly Played (LP)</option>
                <option value="MP">Moderately Played (MP)</option>
              </select>
            </Field>
          </div>
        ) : (
          <div className="mt-3 grid grid-cols-2 gap-4">
            <Field label="Grading company">
              <select name="grader" defaultValue={card?.grader ?? "PSA"} className={inputClass}>
                <option value="PSA">PSA</option>
                <option value="CGC">CGC</option>
                <option value="BGS">BGS</option>
              </select>
            </Field>
            <Field label="Grade">
              <input
                name="grade"
                defaultValue={card?.grade ?? ""}
                placeholder="e.g. 10 or 9.5"
                className={inputClass}
              />
            </Field>
          </div>
        )}
      </fieldset>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Listing price ($) *">
          <input
            name="price"
            type="number"
            step="0.01"
            min={0}
            required
            defaultValue={card ? (card.priceCents / 100).toFixed(2) : ""}
            placeholder="49.99"
            className={inputClass}
          />
        </Field>
        <Field label="What you paid ($)">
          <input
            name="cost"
            type="number"
            step="0.01"
            min={0}
            defaultValue={card ? (card.costCents / 100).toFixed(2) : ""}
            placeholder="Used for profit tracking"
            className={inputClass}
          />
        </Field>
      </div>

      <Field label="Description">
        <textarea
          name="description"
          rows={4}
          defaultValue={card?.description ?? ""}
          placeholder="Centering, surface notes, anything a buyer should know…"
          className={inputClass}
        />
      </Field>

      <Field label="Add photos">
        <input
          name="photos"
          type="file"
          accept="image/*"
          multiple
          className="w-full text-sm text-ink-400 file:mr-3 file:rounded-lg file:border-0 file:bg-navy-700 file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-ink-100 hover:file:bg-navy-600"
        />
        <span className="text-xs text-ink-500">
          JPG/PNG/WebP. Keep the combined upload under ~3.5 MB per save (resize phone photos or
          add them over multiple saves).
        </span>
      </Field>

      <Field label="Or add a photo by URL">
        <input
          name="imageUrl"
          type="url"
          placeholder="https://…"
          className={inputClass}
        />
      </Field>

      <label className="flex items-center gap-2.5 text-sm text-ink-300">
        <input
          type="checkbox"
          name="featured"
          defaultChecked={card?.featured ?? false}
          className="h-4 w-4 accent-gold-400"
        />
        Feature on the homepage
      </label>

      <button
        type="submit"
        disabled={saving}
        className="mt-2 rounded-xl bg-gold-400 px-6 py-3 text-base font-bold text-navy-950 transition hover:bg-gold-300 disabled:opacity-60"
      >
        {saving ? "Saving…" : card ? "Save changes" : "Create listing"}
      </button>
    </form>
  );
}
