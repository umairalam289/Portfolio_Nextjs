export type Point = { x: number; y: number };

export type MaskItem = {
  concerned_area: string | string[];
  class_id: number;
  class_name: string;
  confidence: number;
  mask_points: Point[];
  description?: string;
  image_description?: string;
};

export type CejBonePair = {
  cej_bone_pair: { enamel_point: Point; bone_point: Point };
  distance: number;
  boneloss: boolean;
};

export type Prediction = {
  image_name: string;
  imageWidth: number;
  imageHeight: number;
  ImageType: string;
  tooth_numbering: MaskItem[];
  diagnostic: MaskItem[];
  tooth_structure: MaskItem[];
  bone_loss: CejBonePair[];
  bone_loss_landmark: CejBonePair[];
  key_findings: {
    concerned_area: string[];
    existing_procedures: string[];
    pathalogical_findings: string[];
  }[];
};

export type SegmentationResponse = {
  response: {
    predictions: Prediction[];
    is_successful: boolean;
    metadata?: unknown;
  };
};

export type LayerKey = "tooth_numbering" | "diagnostic" | "tooth_structure" | "bone_loss";

export const LAYER_META: Record<
  LayerKey,
  { label: string; sub: string; color: string; ring: string; soft: string }
> = {
  tooth_numbering: {
    label: "Tooth Numbering",
    sub: "Per-tooth identity & position",
    color: "#22d3ee",
    ring: "ring-cyan-400/40",
    soft: "rgba(34, 211, 238, 0.18)",
  },
  diagnostic: {
    label: "Diagnostics",
    sub: "Crowns · Fillings · Root canal",
    color: "#e879f9",
    ring: "ring-fuchsia-400/40",
    soft: "rgba(232, 121, 249, 0.20)",
  },
  tooth_structure: {
    label: "Tooth Structure",
    sub: "Enamel · Pulp · Bone · Roots",
    color: "#a78bfa",
    ring: "ring-violet-400/40",
    soft: "rgba(167, 139, 250, 0.18)",
  },
  bone_loss: {
    label: "Bone-Loss Landmarks",
    sub: "CEJ → bone distance",
    color: "#5eead4",
    ring: "ring-emerald-300/40",
    soft: "rgba(94, 234, 212, 0.22)",
  },
};

// Distinct colours per individual class so every mask reads as its own thing.
export const CLASS_COLORS: Record<string, string> = {
  // Diagnostics
  Crown: "#fbbf24",
  Filling: "#34d399",
  Rct: "#fb7185",
  "Rct +Post": "#e11d48",
  Impaction: "#c084fc",
  "Periapical Radiolucency": "#38bdf8",
  // Tooth structures
  Enamel: "#22d3ee",
  Bone: "#f59e0b",
  InterRadicular_Bone: "#fb923c",
  Pulp_m: "#ec4899",
  Pulp_s: "#f472b6",
  Eh_L: "#60a5fa",
  Eh_R: "#c084fc",
  Wt: "#94a3b8",
};

// Per-tooth palette indexed by occurrence order — keeps neighbouring teeth distinct.
export const TOOTH_PALETTE = [
  "#22d3ee",
  "#a78bfa",
  "#fbbf24",
  "#5eead4",
  "#e879f9",
  "#60a5fa",
  "#fb7185",
  "#34d399",
];

export function colorForItem(layer: LayerKey, item: MaskItem, idx: number): string {
  if (layer === "tooth_numbering") {
    return TOOTH_PALETTE[idx % TOOTH_PALETTE.length];
  }
  return CLASS_COLORS[item.class_name] ?? LAYER_META[layer].color;
}

export function withAlpha(hex: string, alpha: number): string {
  const a = Math.round(Math.max(0, Math.min(1, alpha)) * 255)
    .toString(16)
    .padStart(2, "0");
  return `${hex}${a}`;
}

const PRETTY: Record<string, string> = {
  lower_1st_molar: "Lower 1st molar",
  lower_2nd_molar: "Lower 2nd molar",
  lower_3rd_molar: "Lower 3rd molar",
  lower_1st_premolar: "Lower 1st premolar",
  lower_2nd_premolar: "Lower 2nd premolar",
  upper_1st_molar: "Upper 1st molar",
  upper_2nd_molar: "Upper 2nd molar",
  upper_3rd_molar: "Upper 3rd molar",
  Crown: "Crown",
  Filling: "Filling",
  Rct: "Root canal treatment",
  "Rct +Post": "Root canal + post",
  Impaction: "Impaction",
  "Periapical Radiolucency": "Periapical radiolucency",
  Enamel: "Enamel",
  Bone: "Bone",
  InterRadicular_Bone: "Inter-radicular bone",
  Pulp_m: "Pulp (main)",
  Pulp_s: "Pulp (secondary)",
  Eh_L: "Enamel height (L)",
  Eh_R: "Enamel height (R)",
  Wt: "Whole tooth",
};

export function prettyClass(name: string) {
  return PRETTY[name] ?? name.replace(/_/g, " ");
}

export function pointsToPath(points: Point[], w: number, h: number) {
  if (!points.length) return "";
  const scaled = points.map((p) => `${(p.x * w).toFixed(2)},${(p.y * h).toFixed(2)}`);
  return `M${scaled.join(" L")} Z`;
}

export function centroid(points: Point[]) {
  if (!points.length) return { x: 0, y: 0 };
  let sx = 0;
  let sy = 0;
  for (const p of points) {
    sx += p.x;
    sy += p.y;
  }
  return { x: sx / points.length, y: sy / points.length };
}

// ---------------------------------------------------------------------------
// Demo configuration — the segmentation canvas is driven entirely by one of
// these, so the periapical and OPG demos share a single rendering engine.
// ---------------------------------------------------------------------------

export type DemoLayerConfig = { key: LayerKey; defaultOn: boolean };

export type DemoConfig = {
  /** DOM id / anchor target for the section. */
  id: string;
  /** Small mono eyebrow, e.g. "04 / Live demo". */
  eyebrow: string;
  /** Heading split so the accent word can be gradient-filled. */
  titlePre: string;
  titleAccent: string;
  titlePost: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  dataUrl: string;
  /** Used until the JSON loads (keeps the aspect box stable). */
  fallbackWidth: number;
  fallbackHeight: number;
  /** Shown in the window chrome, e.g. "periapical". */
  imageTypeLabel: string;
  modelLabel: string;
  /** Hex colour for the scroll scan-line + glow. */
  scanColor: string;
  /** Layers available in this demo, in display order, with default state. */
  layers: DemoLayerConfig[];
};

export const PERIAPICAL_DEMO: DemoConfig = {
  id: "segmentation",
  eyebrow: "Live model 01 — Dental segmentation",
  titlePre: "Periapical X-ray, ",
  titleAccent: "decoded",
  titlePost: ".",
  description:
    "Real model output from the dental segmentation pipeline I built at ZIGRON, rendered live on a real radiograph. Toggle layers, hover regions, and scroll to watch a scan-line trace the model's view of the mouth — tooth by tooth.",
  imageSrc: "/dental-xray.jpg",
  imageAlt: "Periapical dental X-ray",
  dataUrl: "/segmentation.json",
  fallbackWidth: 1336,
  fallbackHeight: 1030,
  imageTypeLabel: "periapical",
  modelLabel: "YOLO v8 segmentation",
  scanColor: "#22d3ee",
  layers: [
    { key: "tooth_numbering", defaultOn: true },
    { key: "diagnostic", defaultOn: true },
    { key: "tooth_structure", defaultOn: false },
    { key: "bone_loss", defaultOn: false },
  ],
};

export const OPG_DEMO: DemoConfig = {
  id: "segmentation-opg",
  eyebrow: "Live model 02 — Panoramic OPG",
  titlePre: "Panoramic OPG, ",
  titleAccent: "diagnosed",
  titlePost: ".",
  description:
    "The same pipeline on a full-mouth panoramic radiograph — isolated here to the diagnostic layer: crowns, fillings, root canals, posts, impactions and periapical pathology the model flags across the entire arch. Scroll to reveal each finding as the scan-line sweeps the jaw.",
  imageSrc: "/opg-xray.jpg",
  imageAlt: "Panoramic OPG dental X-ray",
  dataUrl: "/opg-segmentation.json",
  fallbackWidth: 1040,
  fallbackHeight: 519,
  imageTypeLabel: "panoramic OPG",
  modelLabel: "YOLO v8 segmentation",
  scanColor: "#22d3ee",
  layers: [{ key: "diagnostic", defaultOn: true }],
};
