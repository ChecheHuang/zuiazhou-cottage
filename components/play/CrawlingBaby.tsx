// 側面爬行的嬰兒插畫（面向右）。
// 比例參考真實嬰兒：頭約佔身長 1/4、臉頰飽滿、四肢短而肉；
// 爬行姿勢是膝蓋跪地、小腿平貼地面往後、腳底朝上，手臂直撐在肩膀下方、手掌貼地。
// 動作由外層的 data 屬性 + app/globals.css 的 .crawl-* 樣式驅動：
//   data-crawling="true"  → 對側手腳交替擺動、身體起伏、頭跟著點
//   data-looking="true"   → 停下來左右張望
//   data-reaching="true"  → 近側的手往前伸（抓東西）
// 包屁衣顏色跟著主題色（--color-brand）走；其他衣服（虎衣、吊帶褲、蓬蓬裙）用固定顏色。
// 屁股只是軀幹輪廓的一部分（尿布撐起的圓弧），不另外疊形狀。
// 配件要放在對應的動畫群組裡才會跟著動：帽子、髮帶在頭；尾巴、裙子、領結在身體。

const SKIN = "#f9dcc6";
const SKIN_SHADE = "#efc2a3";
const SKIN_CREASE = "#e3a988";
const HAIR = "#9a6a50";

import type { OutfitId } from "@/lib/play/outfits";

const TIGER = "#f6a640";
const TIGER_STRIPE = "#6b4226";
const TIGER_CREAM = "#fff4e0";
const DENIM = "#5b7fb5";
const DENIM_DARK = "#45689c";
const PINK = "#f7b6c8";
const PINK_LIGHT = "#fde0e9";

// 衣服本體（軀幹、袖子）與鞋子的顏色
const LOOK: Record<OutfitId, { body: string; sleeve: string; shoe?: string }> = {
  onesie: { body: "var(--color-brand)", sleeve: "var(--color-brand)" },
  tiger: { body: TIGER, sleeve: TIGER, shoe: TIGER },
  overalls: { body: DENIM, sleeve: DENIM },
  tutu: { body: PINK, sleeve: PINK },
};

export const CrawlingBaby = ({ outfit = "onesie" }: { outfit?: OutfitId }) => {
  const look = LOOK[outfit];
  const farFoot = look.shoe ?? SKIN_SHADE;
  const nearFoot = look.shoe ?? SKIN;
  return (
  <svg
    xmlns="http://www.w3.org/2000/svg"
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
        fill={farFoot}
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
        fill={nearFoot}
        transform="rotate(-25 17 86)"
      />
      {look.shoe ? (
        <>
          {/* 虎鞋：鞋頭的小耳朵＋條紋 */}
          <circle cx="15.5" cy="79.2" r="1.8" fill={TIGER} stroke={TIGER_STRIPE} strokeWidth="0.5" />
          <path
            d="M14 84 q3 1 5 -0.5 M14.5 88 q3 1 5 -0.5"
            stroke={TIGER_STRIPE}
            strokeWidth="1"
            strokeLinecap="round"
            fill="none"
          />
        </>
      ) : (
        <>
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
        </>
      )}
    </g>

    {/* 身體＋頭：一起起伏 */}
    <g className="crawl-body">
      {outfit === "tiger" && (
        // 虎衣的尾巴：從屁股往上翹
        <g>
          <path
            d="M31 49 C19 46 13 35 20 26"
            stroke={TIGER}
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M18.5 41 l3.5 -2 M15.5 34 l4 0 M18 28.5 l3 1.6"
            stroke={TIGER_STRIPE}
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <circle cx="20" cy="25.5" r="2.6" fill={TIGER_STRIPE} />
        </g>
      )}
      {/* 軀幹：背部平、肚子微垂、尿布讓屁股自然圓起來 */}
      <path
        d="M92 41 C76 36 54 37 40 41 C28 45 24 56 30 65 C38 73 66 75 86 69 C97 65 102 54 98 46 C97 43 95 42 92 41 Z"
        style={{ fill: look.body }}
      />
      {/* 肚子的亮面（虎衣是奶油色肚子） */}
      {outfit === "tiger" ? (
        <ellipse cx="64" cy="68" rx="21" ry="5" fill={TIGER_CREAM} opacity="0.95" />
      ) : (
        <ellipse cx="64" cy="67" rx="20" ry="4.5" fill="#fff" opacity="0.25" />
      )}
      {/* 背部的亮面 */}
      <path
        d="M48 42 q20-4 40 0"
        stroke="#fff"
        strokeWidth="2.4"
        strokeLinecap="round"
        fill="none"
        opacity="0.25"
      />
      {(outfit === "onesie" || outfit === "tutu") && (
        // 衣服上的小愛心
        <path
          d="M66 50 c-2.2-2.9-6.3-0.9-4.8 2 1 1.9 4.8 4.3 4.8 4.3 s3.8-2.4 4.8-4.3 c1.5-2.9-2.6-4.9-4.8-2z"
          fill="#fff"
          opacity="0.85"
        />
      )}
      {outfit === "tiger" && (
        // 背上與屁股的虎紋
        <path
          d="M50 39 q2.5 5 -0.5 9.5 M62 38 q2.5 5 -0.5 9.5 M74 38 q2.5 5 -0.5 9.5 M86 39.5 q2.5 4.5 -0.5 8.5 M26.5 51 q5 1.2 8 -2 M25.5 58 q5 1 8 -2"
          stroke={TIGER_STRIPE}
          strokeWidth="2.4"
          strokeLinecap="round"
          fill="none"
        />
      )}
      {outfit === "overalls" && (
        // 吊帶褲：背上的吊帶、釦子、屁股口袋
        <>
          <path
            d="M97 45 q-14 -5 -32 -4.5"
            stroke={DENIM_DARK}
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="96" cy="46" r="1.8" fill="#f2c14e" />
          <path
            d="M29 50 h9 v7 q-4.5 3 -9 0 z"
            fill="none"
            stroke="#8fb0dc"
            strokeWidth="1"
            strokeDasharray="1.6 1.2"
          />
        </>
      )}
      {outfit === "tutu" && (
        // 蓬蓬裙：兩層荷葉邊蓋住屁股
        <>
          <path
            d="M60 41 C46 38 31 42 25 53 C22 61 25 69 32 72 q4.5 4 9 0 q4.5 4 9 0 q4.5 4 9 0 q4 3 7 -1 C63 62 63 49 60 41 Z"
            fill={PINK_LIGHT}
            stroke={PINK}
            strokeWidth="1"
          />
          <path
            d="M57 43 C46 41 34 45 29 54 C27 60 29 65 34 67 q4 3 8 0 q4 3 8 0 q4 3 8 -1 C59 59 59 50 57 43 Z"
            fill="#fff"
            opacity="0.55"
          />
        </>
      )}
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
          {outfit === "tiger" ? (
            // 虎帽：兩個圓耳朵＋額頭虎紋＋毛毛帽緣
            <>
              <circle cx="99" cy="18" r="5.5" fill={TIGER} />
              <circle cx="99" cy="18" r="2.6" fill={TIGER_CREAM} />
              <circle cx="122" cy="12.5" r="5" fill={TIGER} />
              <circle cx="122" cy="12.5" r="2.4" fill={TIGER_CREAM} />
              <path
                d="M92 39 C89 21 103 12.5 116 13 C127 13.5 133.5 20.5 134.5 27.5 C124 24.5 106 28 92 39 Z"
                fill={TIGER}
              />
              <path
                d="M108 15.5 q1.5 4 -1 7.5 M118 14.5 q0.5 4 -2 7 M100 22 q3 2 3 6 M127 18.5 q-1 3.5 -3.5 5.5"
                stroke={TIGER_STRIPE}
                strokeWidth="1.8"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M92.5 38 C106 27.5 124 24.5 134 27"
                stroke={TIGER_CREAM}
                strokeWidth="3.4"
                strokeLinecap="round"
                fill="none"
              />
            </>
          ) : (
            <>
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
            </>
          )}
          {outfit === "tutu" && (
            // 髮帶＋蝴蝶結
            <>
              <path
                d="M97 27 q14 -13 31 -5"
                stroke={PINK}
                strokeWidth="2.6"
                strokeLinecap="round"
                fill="none"
              />
              <ellipse cx="100" cy="20" rx="5" ry="3.2" fill={PINK} transform="rotate(-35 100 20)" />
              <ellipse cx="107" cy="18.5" rx="5" ry="3.2" fill={PINK} transform="rotate(30 107 18.5)" />
              <circle cx="103.5" cy="19.8" r="2" fill="#ef8fab" />
            </>
          )}
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
      {outfit === "overalls" && (
        // 領結（在下巴下方，避開近側手臂）
        <g>
          <path d="M106 58 l-5 -3.4 v6.8 z M106 58 l5 -3.4 v6.8 z" fill="#e05a5a" />
          <circle cx="106" cy="58" r="1.6" fill="#c94444" />
        </g>
      )}
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
        <ellipse
          cx="92.5"
          cy="55"
          rx="9.5"
          ry="9"
          style={{ fill: look.sleeve }}
        />
        {outfit === "tiger" && (
          <path
            d="M88 49 q2 3 1 6.5 M95 48 q2 3 1 6"
            stroke={TIGER_STRIPE}
            strokeWidth="1.6"
            strokeLinecap="round"
            fill="none"
          />
        )}
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
};
