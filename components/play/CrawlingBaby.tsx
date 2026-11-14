// 側面爬行的嬰兒插畫（面向右）。
// 動作由外層的 data 屬性 + app/globals.css 的 .crawl-* 樣式驅動：
//   data-crawling="true"  → 對側手腳交替擺動、身體起伏、頭跟著點
//   data-looking="true"   → 停下來左右張望
//   data-reaching="true"  → 近側的手往前伸（抓東西）
// 連身衣顏色跟著主題色（--color-brand）走。

const SKIN = "#f9dcc6";
const SKIN_SHADE = "#efc2a3";
const HAIR = "#8a5a44";

const onesie = { fill: "var(--color-brand)" } as const;
const onesieStroke = { stroke: "var(--color-brand)" } as const;

export const CrawlingBaby = () => (
  <svg
    viewBox="0 0 150 100"
    className="block h-auto w-full overflow-visible"
    aria-hidden
  >
    {/* 地上的影子 */}
    <ellipse cx="70" cy="95" rx="54" ry="4.5" fill="#000" opacity="0.08" />

    {/* 遠側腳（a 組） */}
    <g className="crawl-leg crawl-a">
      <path
        d="M41 52 L48 84"
        style={onesieStroke}
        strokeWidth="15"
        strokeLinecap="round"
        opacity="0.8"
      />
      <path
        d="M48 85 L25 89"
        stroke={SKIN_SHADE}
        strokeWidth="11"
        strokeLinecap="round"
      />
      <ellipse cx="20" cy="88.5" rx="7" ry="4.8" fill={SKIN_SHADE} />
    </g>

    {/* 遠側手（b 組） */}
    <g className="crawl-arm crawl-b">
      <path
        d="M97 54 L100 86"
        stroke={SKIN_SHADE}
        strokeWidth="11"
        strokeLinecap="round"
      />
      <ellipse cx="102" cy="88.5" rx="7" ry="5" fill={SKIN_SHADE} />
    </g>

    {/* 身體＋頭：一起起伏 */}
    <g className="crawl-body">
      {/* 屁股（包著尿布的圓） */}
      <circle cx="33" cy="45" r="20" style={onesie} />
      {/* 軀幹 */}
      <ellipse
        cx="66"
        cy="50"
        rx="40"
        ry="20"
        style={onesie}
        transform="rotate(-4 66 50)"
      />
      {/* 肚子的亮面 */}
      <ellipse cx="70" cy="62" rx="25" ry="6" fill="#fff" opacity="0.28" />
      {/* 衣服上的小愛心 */}
      <path
        d="M60 44 c-2.6-3.4-7.4-1-5.6 2.4 1.2 2.2 5.6 5 5.6 5 s4.4-2.8 5.6-5 c1.8-3.4-3-5.8-5.6-2.4z"
        fill="#fff"
        opacity="0.85"
      />
      {/* 尿布從腿洞露出來一點 */}
      <path
        d="M20 56 q10 8 24 4"
        stroke="#fff"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
        opacity="0.9"
      />

      {/* 頭（張望 → 點頭兩層） */}
      <g className="crawl-look">
        <g className="crawl-head">
          <circle cx="113" cy="38" r="24" fill={SKIN} />
          {/* 耳朵 */}
          <circle cx="100" cy="42" r="6.5" fill={SKIN_SHADE} />
          <circle cx="100.5" cy="42" r="3" fill="#e9ad8c" />
          {/* 頭髮 */}
          <path
            d="M92 32 q4-17 22-18 q14 0 19 9 q-9-4-17-2 q-12 3-24 11z"
            fill={HAIR}
          />
          <path
            d="M112 15 q2-8 9-6 q-5 2-4 7"
            stroke={HAIR}
            strokeWidth="2.6"
            strokeLinecap="round"
            fill="none"
          />
          {/* 眉毛＋眼睛 */}
          <path
            d="M119 29 q3-2 6 0"
            stroke={HAIR}
            strokeWidth="1.6"
            strokeLinecap="round"
            fill="none"
          />
          <ellipse cx="122" cy="36" rx="2.7" ry="3.4" fill="#3b2a25" />
          <circle cx="123" cy="34.8" r="1" fill="#fff" />
          {/* 鼻子、臉頰、嘴巴 */}
          <circle cx="134.5" cy="40" r="2.2" fill={SKIN_SHADE} />
          <ellipse
            cx="122"
            cy="46"
            rx="5.5"
            ry="3.6"
            fill="#f39a92"
            opacity="0.55"
          />
          <path
            d="M128 48 q3.5 3.4 7 0.4"
            stroke="#b5655b"
            strokeWidth="1.8"
            strokeLinecap="round"
            fill="none"
          />
        </g>
      </g>
    </g>

    {/* 近側腳（b 組） */}
    <g className="crawl-leg crawl-b">
      <path
        d="M35 56 L42 86"
        style={onesieStroke}
        strokeWidth="16"
        strokeLinecap="round"
      />
      <path
        d="M42 87 L17 91"
        stroke={SKIN}
        strokeWidth="12.5"
        strokeLinecap="round"
      />
      <ellipse cx="11.5" cy="90.5" rx="7.5" ry="5.4" fill={SKIN} />
      <path
        d="M6 89 q-1 3 1.5 4.5"
        stroke={SKIN_SHADE}
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
      />
    </g>

    {/* 近側手（a 組）：外層負責伸手抓，內層負責爬行擺動 */}
    <g className="crawl-reach">
      <g className="crawl-arm crawl-a">
        <path
          d="M92 61 L95 88"
          stroke={SKIN}
          strokeWidth="12"
          strokeLinecap="round"
        />
        <ellipse cx="97" cy="90" rx="7.5" ry="5.6" fill={SKIN} />
        {/* 短袖 */}
        <circle cx="91.5" cy="56" r="10" style={onesie} />
      </g>
    </g>
  </svg>
);
