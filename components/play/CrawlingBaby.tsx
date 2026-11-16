// 側面爬行的嬰兒插畫（面向右）。
// 比例參考真實嬰兒：頭約佔身長 1/4、臉頰飽滿、四肢短而肉；
// 爬行姿勢是膝蓋跪地、小腿平貼地面往後、腳底朝上，手臂直撐在肩膀下方、手掌貼地。
// 動作由外層的 data 屬性 + app/globals.css 的 .crawl-* 樣式驅動：
//   data-crawling="true"  → 對側手腳交替擺動、身體起伏、頭跟著點
//   data-looking="true"   → 停下來左右張望
//   data-reaching="true"  → 近側的手往前伸（抓東西）
// 包屁衣顏色跟著主題色（--color-brand）走。
// 屁股只是軀幹輪廓的一部分（尿布撐起的圓弧），不另外疊形狀。

const SKIN = "#f9dcc6";
const SKIN_SHADE = "#efc2a3";
const SKIN_CREASE = "#e3a988";
const HAIR = "#9a6a50";

const onesie = { fill: "var(--color-brand)" } as const;

export const CrawlingBaby = () => (
  <svg
    viewBox="0 0 150 100"
    className="block h-auto w-full overflow-visible"
    aria-hidden
  >
    {/* 地上的影子 */}
    <ellipse cx="62" cy="94" rx="54" ry="4" fill="#000" opacity="0.08" />

    {/* 遠側腳（a 組）：大腿往下跪地，小腿平貼地面往後 */}
    <g className="crawl-leg crawl-a">
      <path
        d="M46 60 L53 85"
        stroke={SKIN_SHADE}
        strokeWidth="15"
        strokeLinecap="round"
      />
      <path
        d="M53 87 L30 88"
        stroke={SKIN_SHADE}
        strokeWidth="10"
        strokeLinecap="round"
      />
      {/* 腳底朝上 */}
      <ellipse
        cx="25"
        cy="85.5"
        rx="4.2"
        ry="6"
        fill={SKIN_SHADE}
        transform="rotate(-25 25 85.5)"
      />
    </g>

    {/* 遠側手（b 組） */}
    <g className="crawl-arm crawl-b">
      <path
        d="M87 57 L89 86"
        stroke={SKIN_SHADE}
        strokeWidth="10"
        strokeLinecap="round"
      />
      <ellipse cx="93" cy="90" rx="7" ry="3.6" fill={SKIN_SHADE} />
    </g>

    {/* 近側腳（b 組）：畫在身體後面，大腿根部被包屁衣蓋住，擺動時不會有東西凸出屁股 */}
    <g className="crawl-leg crawl-b">
      <path
        d="M40 61 L47 86"
        stroke={SKIN}
        strokeWidth="17"
        strokeLinecap="round"
      />
      {/* 大腿的肉摺 */}
      <path
        d="M37 74 q5 2.5 10 0.5"
        stroke={SKIN_CREASE}
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
        opacity="0.7"
      />
      <path
        d="M47 88 L23 89.5"
        stroke={SKIN}
        strokeWidth="11.5"
        strokeLinecap="round"
      />
      {/* 腳踝肉摺 */}
      <path
        d="M27 85 q-1.5 4.5 0 8"
        stroke={SKIN_CREASE}
        strokeWidth="1.1"
        strokeLinecap="round"
        fill="none"
        opacity="0.7"
      />
      {/* 腳底朝上＋腳趾 */}
      <ellipse
        cx="17"
        cy="86"
        rx="4.8"
        ry="7"
        fill={SKIN}
        transform="rotate(-25 17 86)"
      />
      <circle cx="16.5" cy="79.3" r="1.6" fill={SKIN} stroke={SKIN_SHADE} strokeWidth="0.6" />
      <circle cx="13.6" cy="80.4" r="1.3" fill={SKIN} stroke={SKIN_SHADE} strokeWidth="0.6" />
      <ellipse
        cx="17"
        cy="87"
        rx="2.4"
        ry="3.6"
        fill={SKIN_SHADE}
        opacity="0.55"
        transform="rotate(-25 17 87)"
      />
    </g>

    {/* 身體＋頭：一起起伏 */}
    <g className="crawl-body">
      {/* 軀幹：背部平、肚子微垂、尿布讓屁股自然圓起來 */}
      <path
        d="M92 41 C76 36 54 37 40 41 C28 45 24 56 30 65 C38 73 66 75 86 69 C97 65 102 54 98 46 C97 43 95 42 92 41 Z"
        style={onesie}
      />
      {/* 肚子的亮面 */}
      <ellipse cx="64" cy="67" rx="20" ry="4.5" fill="#fff" opacity="0.25" />
      {/* 背部的亮面 */}
      <path
        d="M48 42 q20-4 40 0"
        stroke="#fff"
        strokeWidth="2.4"
        strokeLinecap="round"
        fill="none"
        opacity="0.25"
      />
      {/* 衣服上的小愛心 */}
      <path
        d="M66 50 c-2.2-2.9-6.3-0.9-4.8 2 1 1.9 4.8 4.3 4.8 4.3 s3.8-2.4 4.8-4.3 c1.5-2.9-2.6-4.9-4.8-2z"
        fill="#fff"
        opacity="0.85"
      />
      {/* 腿洞的鬆緊邊 */}
      <path
        d="M31 64 q10 6 20 4"
        stroke="#fff"
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
        opacity="0.5"
      />
      {/* 胯下的扣子 */}
      <circle cx="29.5" cy="60" r="1.2" fill="#fff" opacity="0.8" />

      {/* 頭（張望 → 點頭兩層） */}
      <g className="crawl-look">
        <g className="crawl-head">
          {/* 頭＋飽滿的臉頰下巴 */}
          <circle cx="113" cy="37" r="21" fill={SKIN} />
          <ellipse cx="121" cy="47" rx="12" ry="10" fill={SKIN} />
          {/* 脖子的肉摺 */}
          <path
            d="M100 53 q5 4 11 4"
            stroke={SKIN_CREASE}
            strokeWidth="1.3"
            strokeLinecap="round"
            fill="none"
            opacity="0.7"
          />
          {/* 耳朵 */}
          <ellipse cx="104" cy="40" rx="4.6" ry="5.6" fill={SKIN_SHADE} />
          <path
            d="M104.5 37.5 q2 2.5 0 5"
            stroke={SKIN_CREASE}
            strokeWidth="1.2"
            strokeLinecap="round"
            fill="none"
          />
          {/* 稀疏的胎毛 */}
          <path
            d="M95 28 q5-12 19-13 q11 0 16 7 q-7-2.5-14-1.5 q-12 2-21 7.5z"
            fill={HAIR}
            opacity="0.85"
          />
          <path
            d="M113 16 q1-6 7-5.5 q-4 1.5-3.5 5.5"
            stroke={HAIR}
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
          {/* 眉毛（淡）＋眼睛 */}
          <path
            d="M120 28.5 q3-1.6 6 0"
            stroke={HAIR}
            strokeWidth="1.2"
            strokeLinecap="round"
            fill="none"
            opacity="0.6"
          />
          <ellipse cx="123" cy="35" rx="2.4" ry="3" fill="#3b2a25" />
          <circle cx="124" cy="33.9" r="0.9" fill="#fff" />
          {/* 小鼻子 */}
          <path
            d="M132.5 37 q3 2.5 0.5 5"
            stroke={SKIN_CREASE}
            strokeWidth="1.6"
            strokeLinecap="round"
            fill={SKIN}
          />
          {/* 臉頰紅暈 */}
          <ellipse
            cx="122"
            cy="45"
            rx="5.5"
            ry="3.6"
            fill="#f39a92"
            opacity="0.5"
          />
          {/* 張開的小嘴 */}
          <path
            d="M128.5 47.5 q3 2.6 5.5 0.2"
            stroke="#b5655b"
            strokeWidth="1.6"
            strokeLinecap="round"
            fill="#d9837a"
          />
        </g>
      </g>
    </g>

    {/* 近側手（a 組）：外層負責伸手抓，內層負責爬行擺動 */}
    <g className="crawl-reach">
      <g className="crawl-arm crawl-a">
        <path
          d="M93 58 L96 87"
          stroke={SKIN}
          strokeWidth="11"
          strokeLinecap="round"
        />
        {/* 手腕肉摺 */}
        <path
          d="M91.5 80 q4.5 1.6 9 0"
          stroke={SKIN_CREASE}
          strokeWidth="1.1"
          strokeLinecap="round"
          fill="none"
          opacity="0.7"
        />
        {/* 手掌貼地、手指朝前 */}
        <ellipse cx="100" cy="90" rx="7.5" ry="3.8" fill={SKIN} />
        <path
          d="M103 88.5 v3 M105.5 88.8 v2.6"
          stroke={SKIN_SHADE}
          strokeWidth="0.8"
          strokeLinecap="round"
        />
        {/* 短袖 */}
        <ellipse cx="92.5" cy="55" rx="9.5" ry="9" style={onesie} />
        <path
          d="M84 60 q8.5 5 17 0"
          stroke="#fff"
          strokeWidth="1.6"
          strokeLinecap="round"
          fill="none"
          opacity="0.6"
        />
      </g>
    </g>
  </svg>
);
