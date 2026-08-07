// Sprite avatar 8x10 grid (SVG rects, bukan file gambar) — badan tetap, kepala
// pakai topi beda per karakter (male="explorer" fedora coklat, female="pilot"
// cap bulat), kaki punya 2 varian frame (walkFrame 0/1) untuk ilusi jalan.
const SKIN = "#f1c27d";
const HAT_MALE = "#8a5a3b";
const HAT_FEMALE = "#3b2f2f";

function headCells(character: "male" | "female"): [number, number, string][] {
  const hat = character === "male" ? HAT_MALE : HAT_FEMALE;
  const brim: [number, number, string][] =
    character === "male"
      ? [
          [3, 0, hat], [4, 0, hat],
          [1, 1, hat], [2, 1, hat], [3, 1, hat], [4, 1, hat], [5, 1, hat], [6, 1, hat],
        ]
      : [
          [3, 0, hat], [4, 0, hat],
          [2, 1, hat], [3, 1, hat], [4, 1, hat], [5, 1, hat],
        ];
  return [
    ...brim,
    [2, 2, SKIN], [3, 2, SKIN], [4, 2, SKIN], [5, 2, SKIN],
    [2, 3, SKIN], [3, 3, SKIN], [4, 3, SKIN], [5, 3, SKIN],
  ];
}

function torsoCells(outfit: string): [number, number, string][] {
  return [
    [1, 4, outfit], [2, 4, outfit], [3, 4, outfit], [4, 4, outfit], [5, 4, outfit], [6, 4, outfit],
    [2, 5, outfit], [3, 5, outfit], [4, 5, outfit], [5, 5, outfit],
    [1, 6, SKIN], [2, 6, outfit], [3, 6, outfit], [4, 6, outfit], [5, 6, outfit], [6, 6, SKIN],
    [2, 7, outfit], [3, 7, outfit], [4, 7, outfit], [5, 7, outfit],
  ];
}

function legCells(outfit: string, frame: 0 | 1): [number, number, string][] {
  return frame === 0
    ? [
        [2, 8, outfit], [3, 8, outfit], [4, 8, outfit], [5, 8, outfit],
        [2, 9, outfit], [3, 9, outfit], [4, 9, outfit], [5, 9, outfit],
      ]
    : [
        [2, 8, outfit], [3, 8, outfit], [5, 8, outfit], [6, 8, outfit],
        [1, 9, outfit], [2, 9, outfit], [4, 9, outfit], [5, 9, outfit],
      ];
}

const OUTFIT_COLOR: Record<"male" | "female", string> = {
  male: "#3b8ef2",
  female: "#e4364a",
};

export default function AvatarSprite({
  character,
  facing,
  walking,
  walkFrame,
  className = "",
}: {
  character: "male" | "female";
  facing: "left" | "right";
  walking: boolean;
  walkFrame: 0 | 1;
  className?: string;
}) {
  const outfit = OUTFIT_COLOR[character];
  const cells = [...headCells(character), ...torsoCells(outfit), ...legCells(outfit, walking ? walkFrame : 0)];

  return (
    <svg
      viewBox="0 0 8 10"
      className={`pixel-img ${className}`}
      style={{ transform: facing === "left" ? "scaleX(-1)" : undefined }}
    >
      {cells.map(([x, y, color], i) => (
        <rect key={i} x={x} y={y} width={1} height={1} fill={color} />
      ))}
    </svg>
  );
}
