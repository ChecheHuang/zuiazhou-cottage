// 房間模式的四個場景，模擬店裡的四個主題場地（照片見 public/photos/rooms）。
// 每個場景都是 400×300 的 SVG；地板一律從 y≈152 開始，
// 物品與嬰兒的位置（RoomScene 的 SPOTS）才能在每個場景都落在地上。

export type RoomThemeId = "galaxy" | "forest" | "cream" | "fortune";

export const ROOM_THEME_IDS: RoomThemeId[] = [
  "galaxy",
  "forest",
  "cream",
  "fortune",
];

const Svg = ({ children }: { children: React.ReactNode }) => (
  <svg
    viewBox="0 0 400 300"
    preserveAspectRatio="none"
    className="absolute inset-0 size-full"
    aria-hidden
  >
    {children}
  </svg>
);

// 拱門背板：底部在 y=bottom，上緣半圓
const arch = (x: number, width: number, top: number, bottom = 152) => {
  const r = width / 2;
  return `M${x} ${bottom} V${top + r} A${r} ${r} 0 0 1 ${x + width} ${top + r} V${bottom} Z`;
};

const Balloon = ({
  cx,
  cy,
  r,
  fill,
}: {
  cx: number;
  cy: number;
  r: number;
  fill: string;
}) => (
  <g>
    <ellipse cx={cx} cy={cy} rx={r} ry={r * 1.12} fill={fill} />
    <ellipse
      cx={cx - r * 0.35}
      cy={cy - r * 0.4}
      rx={r * 0.22}
      ry={r * 0.32}
      fill="#fff"
      opacity="0.5"
    />
  </g>
);

const Leaf = ({ x, y, rot, fill = "#6fa35a" }: { x: number; y: number; rot: number; fill?: string }) => (
  <ellipse
    cx={x}
    cy={y}
    rx="3.2"
    ry="1.6"
    fill={fill}
    transform={`rotate(${rot} ${x} ${y})`}
  />
);

// 垂掛的藤蔓：一串交錯的葉子
const Vine = ({ x, y, length, fill }: { x: number; y: number; length: number; fill?: string }) => (
  <g>
    <path
      d={`M${x} ${y} q3 ${length / 2} -1 ${length}`}
      stroke="#5b8f4a"
      strokeWidth="0.8"
      fill="none"
    />
    {Array.from({ length: Math.floor(length / 5) }, (_, i) => (
      <Leaf
        key={i}
        x={x + (i % 2 ? 2.4 : -2.4) + Math.sin(i) * 0.8}
        y={y + 3 + i * 5}
        rot={i % 2 ? 35 : -35}
        fill={fill}
      />
    ))}
  </g>
);

// 木地板的橫向接縫（越往前越疏，做出透視）
const FloorSeams = ({ color }: { color: string }) => (
  <>
    {[172, 194, 222, 256, 296].map((y) => (
      <line key={y} x1="0" x2="400" y1={y} y2={y} stroke={color} strokeWidth="1" />
    ))}
  </>
);

// ─── 🎆 星河派對屋：白紗、拱門背板、氣球藤蔓花圈、串燈 ─────────
const GalaxyRoom = () => (
  <Svg>
    <defs>
      <linearGradient id="galaxy-floor" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#e7e2df" />
        <stop offset="1" stopColor="#f6f2ef" />
      </linearGradient>
      <pattern id="galaxy-stripe" width="10" height="10" patternUnits="userSpaceOnUse">
        <rect width="10" height="10" fill="#fbf6f5" />
        <rect width="5" height="10" fill="#f4dedd" />
      </pattern>
    </defs>

    <rect width="400" height="152" fill="#f8f5f3" />
    {/* 左邊窗戶的白紗簾 */}
    <rect x="0" y="40" width="46" height="112" fill="#fdfbf8" />
    <path d="M0 40 q20 60 6 112 M14 40 q16 60 6 112 M28 40 q14 60 8 112" stroke="#ece6e0" strokeWidth="1" fill="none" />

    {/* 拱門背板：白、粉、條紋 */}
    <path d={arch(62, 88, 54)} fill="#fbfaf9" stroke="#efe9e6" />
    <path d={arch(146, 92, 46)} fill="#f3d9d8" />
    <path d={arch(234, 90, 54)} fill="url(#galaxy-stripe)" />
    <path d={arch(326, 70, 64)} fill="#fbfaf9" stroke="#efe9e6" />
    <text
      x="106"
      y="104"
      textAnchor="middle"
      fill="#e39a9a"
      fontSize="11"
      fontStyle="italic"
      style={{ fontFamily: "var(--font-display)" }}
    >
      Happy
    </text>
    <text
      x="110"
      y="117"
      textAnchor="middle"
      fill="#e39a9a"
      fontSize="11"
      fontStyle="italic"
      style={{ fontFamily: "var(--font-display)" }}
    >
      Birthday
    </text>

    {/* 串燈：從花圈垂下的小燈 */}
    {[80, 96, 112, 128, 168, 186, 204, 222, 254, 270, 286, 302].map((x, i) => (
      <g key={x}>
        <line x1={x} y1="34" x2={x} y2={86 + (i % 3) * 14} stroke="#e8e0d8" strokeWidth="0.5" />
        {[0, 1, 2, 3].map((k) => (
          <circle
            key={k}
            cx={x}
            cy={46 + k * 12 + (i % 2) * 5}
            r="1.3"
            fill="#ffe7a3"
            opacity="0.95"
          />
        ))}
      </g>
    ))}

    {/* 天花板的白紗與粉紗 */}
    <path d="M0 0 Q90 46 200 6 Q300 46 400 0 V-2 H0z" fill="#fff" opacity="0.92" />
    <path d="M0 4 Q70 52 160 18" stroke="#f3cdd2" strokeWidth="7" fill="none" opacity="0.75" />
    <path d="M400 4 Q330 52 240 18" stroke="#eef4dc" strokeWidth="7" fill="none" opacity="0.9" />

    {/* 氣球花圈＋藤蔓 */}
    {[
      [150, 30, 9, "#7cc96a"],
      [162, 22, 8, "#f6b9cb"],
      [174, 30, 9, "#d9d3ee"],
      [186, 22, 8, "#fff"],
      [198, 30, 10, "#c9e27a"],
      [212, 24, 8, "#7cc96a"],
      [224, 32, 9, "#fff"],
      [236, 24, 8, "#d9d3ee"],
      [248, 32, 9, "#c9e27a"],
      [260, 26, 8, "#7cc96a"],
      [140, 36, 7, "#fff"],
      [272, 34, 7, "#f6b9cb"],
    ].map(([cx, cy, r, fill]) => (
      <Balloon key={`${cx}-${cy}`} cx={cx as number} cy={cy as number} r={r as number} fill={fill as string} />
    ))}
    {[120, 138, 156, 230, 262, 284].map((x, i) => (
      <Vine key={x} x={x} y={36} length={18 + (i % 3) * 8} />
    ))}

    {/* 地板（亮面磁磚）＋白色長毛地毯 */}
    <rect y="146" width="400" height="8" fill="#fff" />
    <rect y="154" width="400" height="146" fill="url(#galaxy-floor)" />
    <FloorSeams color="#ddd6d1" />
    <ellipse cx="200" cy="226" rx="188" ry="66" fill="#fff" opacity="0.85" />
    <ellipse
      cx="200"
      cy="226"
      rx="170"
      ry="54"
      fill="none"
      stroke="var(--color-brand-soft)"
      strokeWidth="2"
      strokeDasharray="6 6"
    />
    {/* 地上的小氣球 */}
    <Balloon cx={22} cy={160} r={9} fill="#7cc96a" />
    <Balloon cx={384} cy={162} r={8} fill="#c9e27a" />
  </Svg>
);

// ─── 🌲 森林童話屋：灰牆、拱門、長頸鹿、綠色氣球、草皮、竹篩 ────────
const grass = Array.from({ length: 170 }, (_, i) => ({
  x: (i * 37) % 400,
  y: 160 + ((i * 53) % 138),
  tone: i % 3,
}));

const ForestRoom = () => (
  <Svg>
    <defs>
      <linearGradient id="forest-grass" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#b3cb4c" />
        <stop offset="1" stopColor="#c9dc6e" />
      </linearGradient>
      <pattern id="forest-weave" width="6" height="6" patternUnits="userSpaceOnUse">
        <rect width="6" height="6" fill="#d8b98a" />
        <path d="M0 0 L6 6 M6 0 L0 6" stroke="#b8945f" strokeWidth="0.8" />
      </pattern>
    </defs>

    {/* 灰牆＋右側白色布幔 */}
    <rect width="400" height="152" fill="#cdc9c3" />
    <rect x="290" width="110" height="152" fill="#f4f2ee" />
    {[300, 316, 334, 352, 372, 390].map((x) => (
      <path key={x} d={`M${x} 0 q4 76 -2 152`} stroke="#e2ddd6" strokeWidth="1.2" fill="none" />
    ))}

    {/* 龜背芋掛畫 */}
    <rect x="312" y="38" width="34" height="46" fill="#fff" stroke="#e8e4de" />
    <path d="M329 76 q-12-14 -2-30 q8 10 2 30z" fill="#7fae7a" />
    <path d="M330 78 q12-10 6-26 q-10 8 -6 26z" fill="#9cc292" />
    {/* 垂吊植物 */}
    <Vine x={300} y={20} length={50} fill="#4f8f45" />
    <Vine x={304} y={22} length={42} fill="#6fa35a" />
    <Vine x={372} y={18} length={56} fill="#4f8f45" />
    <Vine x={378} y={20} length={46} fill="#6fa35a" />

    {/* 拱門背板 */}
    <path d={arch(30, 96, 44)} fill="#d9c3ad" />
    <text x="78" y="96" textAnchor="middle" fill="#fff" fontSize="9.5" fontWeight="700">
      生日快樂
    </text>
    <path d={arch(136, 66, 78)} fill="#ecc9c4" />
    <circle cx="169" cy="116" r="9" fill="#f6d8a8" />
    <text x="169" y="138" textAnchor="middle" fill="#c98f8a" fontSize="6" fontStyle="italic">
      welcome
    </text>
    {/* 綠草做的數字 1 */}
    <path d="M86 14 h10 v34 h-10z" fill="#5f9b4c" />
    {Array.from({ length: 14 }, (_, i) => (
      <Leaf key={i} x={86 + (i % 3) * 5} y={16 + i * 2.4} rot={i * 40} fill="#78b25e" />
    ))}

    {/* 長頸鹿立牌 */}
    <g>
      <path d="M220 152 v-30 h6 v30z M238 152 v-30 h6 v30z" fill="#e9c27a" />
      <ellipse cx="232" cy="118" rx="16" ry="11" fill="#e9c27a" />
      <path d="M240 114 l8 -62 h7 l-5 64z" fill="#e9c27a" />
      <ellipse cx="254" cy="50" rx="9" ry="6" fill="#e9c27a" />
      <path d="M250 44 v-6 M256 44 v-6" stroke="#b07c3a" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="257" cy="49" r="1.2" fill="#5a3b22" />
      {[
        [226, 116],
        [236, 122],
        [243, 98],
        [247, 78],
        [250, 62],
        [232, 112],
      ].map(([x, y]) => (
        <ellipse key={`${x}-${y}`} cx={x} cy={y} rx="2.6" ry="2" fill="#c98f45" />
      ))}
    </g>

    {/* 左上氣球 */}
    {[
      [18, 18, 11, "#7cc96a"],
      [36, 12, 10, "#fff"],
      [52, 20, 11, "#e8e070"],
      [68, 12, 10, "#c9e27a"],
      [30, 30, 9, "#f2e58c"],
    ].map(([cx, cy, r, fill]) => (
      <Balloon key={`${cx}-${cy}`} cx={cx as number} cy={cy as number} r={r as number} fill={fill as string} />
    ))}

    {/* 草皮地毯 */}
    <rect y="148" width="400" height="152" fill="url(#forest-grass)" />
    {grass.map((g, i) => (
      <path
        key={i}
        d={`M${g.x} ${g.y} l-1.5 -5 M${g.x} ${g.y} l2 -4.5`}
        stroke={["#9ab83a", "#d5e584", "#a9c447"][g.tone]}
        strokeWidth="1"
        strokeLinecap="round"
      />
    ))}
    {/* 沿著牆邊的地上氣球 */}
    {[
      [70, 150, 10, "#4fb35f"],
      [90, 154, 9, "#f2e58c"],
      [110, 151, 10, "#fff"],
      [130, 155, 9, "#4fb35f"],
      [270, 151, 10, "#7cc96a"],
      [288, 155, 9, "#4fb35f"],
      [306, 151, 10, "#e8e070"],
    ].map(([cx, cy, r, fill]) => (
      <Balloon key={`${cx}-${cy}`} cx={cx as number} cy={cy as number} r={r as number} fill={fill as string} />
    ))}
    {/* 竹篩 */}
    <ellipse cx="200" cy="292" rx="70" ry="15" fill="url(#forest-weave)" />
    <ellipse cx="200" cy="292" rx="70" ry="15" fill="none" stroke="#a9834f" strokeWidth="2" />
  </Svg>
);

// ─── 🐻 奶油寶貝屋：奶油色牆、蛋糕牆貼、木頭小車吊旗、ONE 字卡 ──────
const CreamRoom = () => (
  <Svg>
    <defs>
      <pattern id="cream-bears" width="26" height="20" patternUnits="userSpaceOnUse">
        <circle cx="8" cy="9" r="3.4" fill="#b08868" opacity="0.55" />
        <circle cx="5.4" cy="6" r="1.4" fill="#b08868" opacity="0.55" />
        <circle cx="10.6" cy="6" r="1.4" fill="#b08868" opacity="0.55" />
        <circle cx="21" cy="17" r="1.2" fill="#d9c2a8" />
      </pattern>
      <linearGradient id="cream-floor" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#e9dfd2" />
        <stop offset="1" stopColor="#f4ede4" />
      </linearGradient>
    </defs>

    <rect width="400" height="152" fill="#f3efea" />
    {/* 左邊大拱門＋蛋糕貼紙＋星星 */}
    <path d={arch(18, 150, 20)} fill="#e9e5e0" />
    <g>
      <rect x="66" y="88" width="34" height="12" rx="2" fill="#fff" stroke="#4a3328" strokeWidth="1.4" />
      <rect x="70" y="76" width="26" height="12" rx="2" fill="#fff" stroke="#4a3328" strokeWidth="1.4" />
      <rect x="74" y="65" width="18" height="11" rx="2" fill="#fff" stroke="#4a3328" strokeWidth="1.4" />
      <path d="M66 94 q4 4 8 0 q4 4 8 0 q4 4 8 0 q4 4 10 0" stroke="#4a3328" strokeWidth="1.2" fill="none" />
      <path d="M78 64 v-8 M83 64 v-10 M88 64 v-8" stroke="#4a3328" strokeWidth="1.4" />
      <path d="M78 55 q-2-4 0-6 q2 2 0 6z M83 53 q-2-4 0-6 q2 2 0 6z M88 55 q-2-4 0-6 q2 2 0 6z" fill="#4a3328" />
    </g>
    {[
      [44, 60, 4],
      [120, 52, 3],
      [130, 80, 4],
      [50, 100, 3],
      [112, 110, 2.6],
      [140, 104, 3],
    ].map(([x, y, s]) => (
      <path
        key={`${x}-${y}`}
        d={`M${x} ${y - s} L${x + s * 0.3} ${y - s * 0.3} L${x + s} ${y} L${x + s * 0.3} ${y + s * 0.3} L${x} ${y + s} L${x - s * 0.3} ${y + s * 0.3} L${x - s} ${y} L${x - s * 0.3} ${y - s * 0.3}z`}
        fill="#4a3328"
      />
    ))}
    {/* 右邊房子造型背板 */}
    <path d="M176 152 V44 L272 4 L368 44 V152z" fill="#faf8f5" />
    <text
      x="300"
      y="34"
      textAnchor="middle"
      fill="#c9a882"
      fontSize="12"
      fontStyle="italic"
      style={{ fontFamily: "var(--font-display)" }}
    >
      Happy Birthday
    </text>
    {/* 木頭小車吊旗 */}
    <path d="M170 44 Q280 70 390 44" stroke="#bfb1a2" strokeWidth="0.8" fill="none" />
    {[198, 244, 290, 336].map((x, i) => {
      const y = 50 + Math.sin((i / 3) * Math.PI) * 10;
      return (
        <g key={x}>
          <rect x={x - 12} y={y} width="24" height="11" rx="4" fill={i % 2 ? "#c19366" : "#a8784c"} />
          <rect x={x - 6} y={y - 6} width="12" height="7" rx="2" fill={i % 2 ? "#c19366" : "#a8784c"} />
          <rect x={x - 4} y={y - 4} width="8" height="4" rx="1" fill="#f3e6d4" />
          <circle cx={x - 6} cy={y + 12} r="3.4" fill="#f3e6d4" stroke="#7a5536" />
          <circle cx={x + 6} cy={y + 12} r="3.4" fill="#f3e6d4" stroke="#7a5536" />
        </g>
      );
    })}
    {/* ONE 字卡＋蝴蝶結 */}
    <path d="M200 82 Q272 92 344 82" stroke="#bfb1a2" strokeWidth="0.8" fill="none" />
    {["O", "N", "E"].map((ch, i) => (
      <g key={ch}>
        <rect
          x={226 + i * 32}
          y={86}
          width="24"
          height="26"
          rx="3"
          fill="#fff"
          stroke="#c8a98a"
          strokeWidth="1.4"
          strokeDasharray="2 1.4"
        />
        <text
          x={238 + i * 32}
          y={105}
          textAnchor="middle"
          fill="#8a6446"
          fontSize="15"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {ch}
        </text>
      </g>
    ))}
    <path d="M208 84 q-6-6 0-8 q4 2 0 8 q6-6 8-2 q-2 4 -8 2z" fill="#fff" stroke="#e4d8c8" />
    <path d="M336 84 q-6-6 0-8 q4 2 0 8 q6-6 8-2 q-2 4 -8 2z" fill="#fff" stroke="#e4d8c8" />

    {/* 蘆葦 */}
    {[0, 1, 2, 3, 4].map((i) => (
      <path
        key={i}
        d={`M${10 + i * 3} 152 q${-6 + i * 3} -40 ${-10 + i * 6} -${62 + i * 6}`}
        stroke="#d8c3a2"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        opacity="0.85"
      />
    ))}

    {/* 地板＋小熊印花地毯 */}
    <rect y="146" width="400" height="8" fill="#fff" />
    <rect y="154" width="400" height="146" fill="url(#cream-floor)" />
    <FloorSeams color="#e0d3c3" />
    <ellipse cx="200" cy="226" rx="188" ry="66" fill="#efe4d6" />
    <ellipse cx="200" cy="226" rx="188" ry="66" fill="url(#cream-bears)" />
    <ellipse cx="200" cy="226" rx="188" ry="66" fill="none" stroke="#fff" strokeWidth="3" />
    {/* 白色、奶茶色氣球 */}
    <Balloon cx={40} cy={160} r={14} fill="#fff" />
    <Balloon cx={62} cy={166} r={11} fill="#e6dccf" />
    <Balloon cx={360} cy={160} r={13} fill="#e6dccf" />
    <Balloon cx={382} cy={168} r={11} fill="#fff" />
  </Svg>
);

// ─── 🧧 福氣滿滿屋：紅燈籠、書法掛軸、太師椅、紅底金花地毯 ──────────
const Lantern = ({ cx, cy }: { cx: number; cy: number }) => (
  <g>
    <rect x={cx - 5} y={cy - 15} width="10" height="3" fill="#d9a43b" />
    <ellipse cx={cx} cy={cy} rx="16" ry="13" fill="#d8262e" />
    <path
      d={`M${cx - 8} ${cy - 12} q-3 12 0 24 M${cx} ${cy - 13} v26 M${cx + 8} ${cy - 12} q3 12 0 24`}
      stroke="#b31b22"
      strokeWidth="1"
      fill="none"
    />
    <rect x={cx - 5} y={cy + 12} width="10" height="3" fill="#d9a43b" />
    <path d={`M${cx - 2} ${cy + 15} v8 M${cx} ${cy + 15} v9 M${cx + 2} ${cy + 15} v8`} stroke="#e8b84a" strokeWidth="1" />
  </g>
);

const Scroll = ({
  x,
  width,
  top,
  red,
  children,
}: {
  x: number;
  width: number;
  top: number;
  red?: boolean;
  children?: React.ReactNode;
}) => (
  <g>
    <rect x={x} y={top} width={width} height={128 - top} fill="#c8202a" />
    {!red && (
      <rect x={x + 3} y={top + 4} width={width - 6} height={120 - top} fill="#f3e3c4" />
    )}
    {children}
  </g>
);

const FortuneRoom = () => (
  <Svg>
    <defs>
      <pattern id="fortune-flowers" width="22" height="16" patternUnits="userSpaceOnUse">
        <g fill="#e9b44c" opacity="0.85">
          <circle cx="6" cy="6" r="1.6" />
          <circle cx="3.6" cy="4.6" r="1.4" />
          <circle cx="8.4" cy="4.6" r="1.4" />
          <circle cx="4.4" cy="8" r="1.4" />
          <circle cx="7.6" cy="8" r="1.4" />
        </g>
        <path d="M14 13 q4 -4 7 0" stroke="#e9b44c" strokeWidth="0.8" fill="none" opacity="0.7" />
      </pattern>
      <linearGradient id="fortune-floor" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#d4ac80" />
        <stop offset="1" stopColor="#e5c59e" />
      </linearGradient>
    </defs>

    {/* 白色直條紋牆 */}
    <rect width="400" height="152" fill="#f8f6f2" />
    {Array.from({ length: 20 }, (_, i) => (
      <line key={i} x1={i * 20 + 10} x2={i * 20 + 10} y1="0" y2="152" stroke="#ebe6de" />
    ))}
    {/* 軌道燈 */}
    <rect x="90" y="6" width="250" height="4" rx="2" fill="#2b2b2b" />
    {[110, 150, 190, 230, 270, 310].map((x) => (
      <g key={x}>
        <rect x={x - 4} y="9" width="8" height="7" rx="2" fill="#2b2b2b" />
        <path d={`M${x - 4} 16 L${x - 16} 60 L${x + 16} 60 L${x + 4} 16z`} fill="#fff6d6" opacity="0.35" />
      </g>
    ))}

    {/* 書法掛軸 */}
    <Scroll x={92} width={30} top={22}>
      {["所", "行", "皆", "坦", "途"].map((ch, i) => (
        <text key={ch} x="107" y={40 + i * 17} textAnchor="middle" fontSize="11" fill="#3a2a22">
          {ch}
        </text>
      ))}
    </Scroll>
    <Scroll x={136} width={32} top={22} red>
      <text x="152" y="100" textAnchor="middle" fontSize="22" fill="#f3e3c4" fontWeight="700">
        樂
      </text>
    </Scroll>
    <Scroll x={182} width={36} top={22}>
      <text x="200" y="66" textAnchor="middle" fontSize="20" fill="#3a2a22" fontWeight="700">
        周
      </text>
      <text x="200" y="96" textAnchor="middle" fontSize="20" fill="#3a2a22" fontWeight="700">
        歲
      </text>
    </Scroll>
    <Scroll x={232} width={30} top={22}>
      {["吾", "家", "寶", "貝", "初"].map((ch, i) => (
        <text key={ch} x="247" y={40 + i * 17} textAnchor="middle" fontSize="11" fill="#3a2a22">
          {ch}
        </text>
      ))}
    </Scroll>
    <Scroll x={276} width={34} top={22} red>
      <text x="293" y="70" textAnchor="middle" fontSize="24" fill="#f3e3c4" fontWeight="700">
        喜
      </text>
    </Scroll>

    {/* 左邊一串紅燈籠 */}
    <line x1="34" y1="0" x2="34" y2="130" stroke="#d9a43b" strokeWidth="1.2" />
    {[20, 50, 80, 110].map((y) => (
      <Lantern key={y} cx={34} cy={y} />
    ))}
    {/* 右邊紅色布幔 */}
    <path d="M372 0 h28 v152 h-34 q10-76 6-152z" fill="#c8202a" />

    {/* 太師椅（在地毯後方） */}
    {[128, 272].map((x) => (
      <g key={x} fill="none" stroke="#5a3221" strokeWidth="3" strokeLinecap="round">
        <path d={`M${x - 18} 150 V112 q0-12 18-12 q18 0 18 12 V150`} />
        <path d={`M${x - 12} 116 h24`} />
        <rect x={x - 8} y="112" width="16" height="26" rx="3" fill="#c8202a" stroke="none" />
      </g>
    ))}

    {/* 木地板＋紅底金花圓地毯 */}
    <rect y="146" width="400" height="8" fill="#efe6da" />
    <rect y="154" width="400" height="146" fill="url(#fortune-floor)" />
    <FloorSeams color="#c49b70" />
    <ellipse cx="200" cy="226" rx="190" ry="68" fill="#a8121c" />
    <ellipse cx="200" cy="226" rx="182" ry="62" fill="#cc2129" />
    <ellipse cx="200" cy="226" rx="182" ry="62" fill="url(#fortune-flowers)" />
    <ellipse
      cx="200"
      cy="226"
      rx="182"
      ry="62"
      fill="none"
      stroke="#e9b44c"
      strokeWidth="3"
    />
    <ellipse
      cx="200"
      cy="226"
      rx="170"
      ry="55"
      fill="none"
      stroke="#e9b44c"
      strokeWidth="1"
      strokeDasharray="3 3"
    />
  </Svg>
);

export const ROOM_BACKGROUNDS: Record<RoomThemeId, () => React.ReactElement> = {
  galaxy: GalaxyRoom,
  forest: ForestRoom,
  cream: CreamRoom,
  fortune: FortuneRoom,
};
