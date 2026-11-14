import { STEP_PHOTOS, THEME_ROOM_PHOTOS } from "@/data/photos";
import { defineBlock } from "../schema";

// baby-party 頁的文字區塊。每個 export 的 defineBlock(...) 會自動出現在後台。

const PAGE = "寶寶派對";

export const partySeo = defineBlock({
  key: "party.seo",
  page: PAGE,
  label: "搜尋引擎與分頁標題",
  description: "瀏覽器分頁上的標題，以及 Google 搜尋結果下方顯示的簡介。",
  fields: [
    { type: "text", key: "title", label: "分頁標題" },
    {
      type: "text",
      key: "description",
      label: "搜尋結果簡介",
      multiline: true,
    },
    {
      type: "image",
      key: "image",
      label: "分享預覽圖",
      hint: "分享到 LINE、Facebook 時顯示的圖片，建議用 1200×630 的橫式照片",
    },
  ],
  defaults: {
    title: "寶寶派對 - Happy 抓周小屋",
    description:
      "桃園平鎮包場寶寶抓週派對、兒童生日派對、性別揭曉派對推薦，從場佈、流程到攝影一站式包辦。",
    image: "/og/party.jpg",
  },
});

export const partyHero = defineBlock({
  key: "party.hero",
  page: PAGE,
  label: "頁面開頭介紹",
  description: "寶寶派對頁最上方的大標題與介紹文字。",
  fields: [
    { type: "text", key: "title", label: "大標題" },
    {
      type: "text",
      key: "body",
      label: "介紹文字",
      multiline: true,
      hint: "換行會照樣顯示在網頁上",
    },
  ],
  defaults: {
    title: "寶寶派對",
    body: `桃園平鎮包場寶寶抓週派對、兒童生日派對、寶寶性別揭曉派對推薦，給正在為此煩惱的家長們一個全新選擇！
從場佈、流程、主持、抓週道具、餐點等，甚至是捕捉小寶貝的每一個經典畫面，我們都會幫您準備好📸
Happy 抓周小屋讓你特別輕鬆，爸爸媽媽寶貝只需要打扮美美人到就好！`,
  },
});

export const partyPlans = defineBlock({
  key: "party.plans",
  page: PAGE,
  label: "主題場地方案",
  description:
    "「四大主題場地」區塊：每個場地的照片輪播、名稱、價格與特色，以及下方「抓周方案通通包含」的說明框。",
  fields: [
    { type: "text", key: "heading", label: "區塊標題" },
    { type: "text", key: "intro", label: "標題下方說明", multiline: true },
    {
      type: "list",
      key: "plans",
      label: "場地方案",
      itemLabel: "場地",
      titleKey: "title",
      hint: "依序左右交錯排列；照片會在左／右側輪播",
      of: [
        {
          type: "text",
          key: "title",
          label: "場地名稱",
          hint: "可在最前面放表情符號，例如「🎆 星河派對屋」",
        },
        {
          type: "text",
          key: "price",
          label: "價格",
          hint: "留空就不顯示價格",
        },
        {
          type: "list",
          key: "features",
          label: "特色說明",
          of: "text",
          itemLabel: "特色",
        },
        { type: "images", key: "images", label: "場地照片（輪播）" },
      ],
    },
    {
      type: "text",
      key: "includesTitle",
      label: "說明框標題",
      hint: "例如「🎁 抓周方案通通包含：」",
    },
    {
      type: "list",
      key: "includes",
      label: "方案包含項目",
      of: "text",
      itemLabel: "項目",
    },
    {
      type: "list",
      key: "notes",
      label: "說明框下方補充",
      of: "text",
      itemLabel: "補充",
      multiline: true,
    },
  ],
  defaults: {
    heading: "四大主題場地",
    intro:
      "四種不同風格的主題空間，不管是溫馨的小家庭聚會，還是熱鬧的大家族派對，都能找到最適合的場地！",
    plans: [
      {
        title: "🎆 星河派對屋",
        price: "$8,880",
        features: [
          "全新開放的 3F 場地，超寬敞的派對空間，適合大家族一起熱鬧慶祝！",
          "推薦 25～100 人",
          "最多容納 150 人",
        ],
        images: THEME_ROOM_PHOTOS.galaxy,
      },
      {
        title: "🌲 森林童話屋",
        price: "$5,980",
        features: [
          "充滿童趣的森林氛圍，陪寶寶展開人生第一場奇妙冒險！",
          "推薦 15～25 人",
        ],
        images: THEME_ROOM_PHOTOS.forest,
      },
      {
        title: "🐻 奶油寶貝屋",
        price: "$5,980",
        features: [
          "溫柔療癒的奶油色系，簡約又溫馨，怎麼拍都可愛！",
          "推薦 15～25 人",
        ],
        images: THEME_ROOM_PHOTOS.cream,
      },
      {
        title: "🧧 福氣滿滿屋",
        price: "$4,980",
        features: [
          "喜氣洋洋的中式抓周風格，給寶寶滿滿的祝福！",
          "推薦 10～15 人",
        ],
        images: THEME_ROOM_PHOTOS.fortune,
      },
    ],
    includesTitle: "🎁 抓周方案通通包含：",
    includes: [
      "1.5 小時專屬包場",
      "全套抓周道具＋專業抓周儀式主持",
      "活動側錄＋拍照紀錄",
      "USB 照片檔案現場交付",
      "寶寶抓周證書、敲金蛋儀式、寶寶腳丫拓印",
      "成長紀念相框、祈福卡、簽到證書夾、紀念手提袋",
    ],
    notes: [
      "🎉 現在預約即贈送全台首創「快樂降福儀式」！",
      "💖 從場地佈置到抓周儀式，通通幫爸爸媽媽準備好，只要帶著寶寶和親朋好友一起開心留下回憶就好啦！",
      "➕ 若有需要 攝影 📷 / 餐點 🍜 / 客製化商品 👶，可再參考加購服務。",
    ],
  },
});

export const partyNotices = defineBlock({
  key: "party.notices",
  page: PAGE,
  label: "注意事項",
  description: "「注意事項」條列，以及下方客製化說明與取消規範的白色框。",
  fields: [
    { type: "text", key: "heading", label: "區塊標題" },
    {
      type: "list",
      key: "bullets",
      label: "注意事項條列",
      of: "text",
      itemLabel: "注意事項",
      multiline: true,
    },
    {
      type: "text",
      key: "customNote",
      label: "客製化說明（白色框上半）",
      multiline: true,
    },
    { type: "text", key: "cancelTitle", label: "取消規範標題（白色框下半）" },
    {
      type: "text",
      key: "cancelBody",
      label: "取消規範內容",
      multiline: true,
    },
  ],
  defaults: {
    heading: "注意事項",
    bullets: [
      "方案皆不含慶生蛋糕，可以自備🍰",
      "當天客製的印刷物都可以帶回家，不可自備空飄氣球",
      "現場如有裝飾用相框，結束後的相片可以帶回家，不附相框",
      "最早入場時間為，預約時間前 10 分鐘抵達",
      "如要加時，一小時 1500 元，但需要看後面是否還有場次預約",
      "加一位寶寶須加價 $2000，因為流程道具皆準備雙份",
      "全面禁帶外食飲料，除了生日蛋糕跟寶寶副食品",
      "如自備餐點，須收場地費 $2000",
      "本場所友善寵物，毛孩可落地活動，但請家長留意不要隨地便溺",
      "本場所全面禁菸禁酒禁檳榔",
      "廁所室內皆不得抽菸，違者最高可處 10000 元罰鍰",
      "場地容納人數依主題場地而定：福氣滿滿屋推薦 10～15 人；森林童話屋、奶油寶貝屋推薦 15～25 人；星河派對屋推薦 25～100 人，最多可容納 150 人",
      "指定主持人須另加 $2000 ❣️ 會由主理人親自執行，需再協助確認是否有可安排的檔期。",
    ],
    customNote:
      "如需客製化的佈置或其他鮮花系列皆可討論，會依照需求調整細節並提供報價，不含餐點的方案價格 $17,800 起（方案包含主持人、抓周道具、虎衣虎鞋、祈福品以及贈送 1-12 月寶寶相框）",
    cancelTitle: "⭐ 包場取消規範",
    cancelBody: "30 日前取消包場，退款 1/2 定金",
  },
});

export const partyHostIntro = defineBlock({
  key: "party.hostIntro",
  page: PAGE,
  label: "主理人團隊介紹",
  description:
    "圓形照片旁的主理人介紹文字。照片請到「網站圖片」的「主持人介紹」更換。",
  fields: [
    { type: "text", key: "eyebrow", label: "標題上方小字（英文）" },
    {
      type: "text",
      key: "title",
      label: "標題",
      hint: "也會當作照片的替代文字",
    },
    {
      type: "text",
      key: "body",
      label: "介紹文字",
      multiline: true,
      hint: "換行會照樣顯示在網頁上",
    },
  ],
  defaults: {
    eyebrow: "Meet your host",
    title: "主理人團隊",
    body: `擁有多年活動主持經驗，專注於親子互動與抓周流程引導。
善於用溫柔穩定的節奏，帶領寶寶安心參與、讓家人自在融入，
每一場都是獨一無二、充滿笑聲與感動的紀念時刻。`,
  },
});

export const partyRitual = defineBlock({
  key: "party.ritual",
  page: PAGE,
  label: "抓周派對流程",
  description:
    "左右交錯的時間軸，每個步驟有標題、說明與一張照片。步驟編號會依順序自動產生。",
  fields: [
    { type: "text", key: "eyebrow", label: "標題上方小字（英文）" },
    { type: "text", key: "title", label: "區塊標題" },
    { type: "text", key: "intro", label: "標題下方說明", multiline: true },
    {
      type: "text",
      key: "stepLabel",
      label: "步驟編號前的小字",
      hint: "顯示成「Step 1」「Step 2」…的「Step」",
    },
    {
      type: "list",
      key: "steps",
      label: "流程步驟",
      itemLabel: "步驟",
      titleKey: "title",
      of: [
        { type: "text", key: "title", label: "步驟名稱" },
        { type: "text", key: "desc", label: "步驟說明", multiline: true },
        { type: "image", key: "image", label: "步驟照片" },
      ],
    },
  ],
  defaults: {
    eyebrow: "Ritual Flow",
    title: "抓周派對流程",
    intro:
      "十個步驟、一段珍貴回憶，從穿虎衣到合影留念，由主持人陪伴全家完整走完。",
    stepLabel: "Step",
    steps: [
      {
        title: "穿虎衣、虎鞋",
        desc: "爸爸媽媽幫寶寶穿戴虎帽、穿虎鞋。寓意：在中國傳統習俗認為「老虎」可以避邪保平安，更被人們視為吉祥物、鎮煞之寶。",
        image: STEP_PHOTOS[0],
      },
      {
        title: "摸摸小老虎",
        desc: "寶寶抓周穿虎衣、虎帽、虎鞋，用意便是希望藉此嚇退邪煞，保其平安成長。",
        image: STEP_PHOTOS[1],
      },
      {
        title: "踏紅龜求百歲",
        desc: "爸爸媽媽抱著寶貝踏紅龜。寓意：祝福寶寶長命百歲、頭好壯壯。",
        image: STEP_PHOTOS[2],
      },
      {
        title: "說說吉祥話",
        desc: "準備 6-8 種不同含義的祝福物品（雞腿、蔥、蒜頭、芹菜、蘋果、米餅）。寓意：祝福寶貝未來人生道路平平安安、身體健康。",
        image: STEP_PHOTOS[3],
      },
      {
        title: "開智啟鑼",
        desc: "爸爸媽媽和寶寶一起敲鑼。寓意：一敲智慧打開，二敲及第登科，三敲財運興旺。",
        image: STEP_PHOTOS[4],
      },
      {
        title: "過蔥門",
        desc: "準備一把小青蔥，用紅絲帶鑲在門上面，由爸爸抱著寶寶從門下走過。寓意：青蔥門下過，寶寶聰明又可愛。",
        image: STEP_PHOTOS[5],
      },
      {
        title: "平安滾災",
        desc: "用小掃帚從頭到腳輕輕拍一拍，再以兩顆象徵圓滿的蛋從頭到腳滾一圈。寓意：滾災滾災，災難滾開，寶貝聰明健康、一生平安。",
        image: STEP_PHOTOS[6],
      },
      {
        title: "抓周",
        desc: "重頭戲！由寶寶自己挑選抓周物品，象徵未來人生方向，全家一起留下難忘的回憶。",
        image: STEP_PHOTOS[7],
      },
      {
        title: "生日快樂",
        desc: "邀請所有親友一同為寶貝慶祝人生第一個生日。",
        image: STEP_PHOTOS[8],
      },
      {
        title: "合影留念",
        desc: "家人合影留下紀念。",
        image: STEP_PHOTOS[9],
      },
    ],
  },
});

const zhuazhouItemFields = [
  {
    type: "text" as const,
    key: "emoji",
    label: "圖示（表情符號）",
    hint: "顯示在方框中央的大圖示，例如 ✈️",
  },
  { type: "text" as const, key: "name", label: "物品名稱" },
  {
    type: "text" as const,
    key: "meaning",
    label: "象徵意義",
    hint: "顯示在名稱下方的小字，留空就不顯示",
  },
];

export const partyCareerItems = defineBlock({
  key: "party.careerItems",
  page: PAGE,
  label: "抓周職業物品",
  description: "抓周物品區的第一組：職業道具圖示格。",
  fields: [
    { type: "text", key: "eyebrow", label: "標題上方小字（英文）" },
    { type: "text", key: "title", label: "區塊標題" },
    {
      type: "text",
      key: "description",
      label: "標題下方說明",
      hint: "新增或刪除物品時記得一併修改這裡的數量；留空就不顯示",
    },
    {
      type: "list",
      key: "items",
      label: "職業物品",
      itemLabel: "物品",
      titleKey: "name",
      of: zhuazhouItemFields,
    },
  ],
  defaults: {
    eyebrow: "Career Items",
    title: "抓周職業物品",
    description: "共 21 種職業道具，象徵寶寶未來無限可能。",
    items: [
      { emoji: "✈️", name: "飛機", meaning: "機師、航空業" },
      { emoji: "🧮", name: "算盤", meaning: "商人、會計" },
      { emoji: "📷", name: "相機", meaning: "攝影師" },
      { emoji: "🎥", name: "攝影機", meaning: "導演、媒體" },
      { emoji: "🪮", name: "梳子", meaning: "美容造型師" },
      { emoji: "🎨", name: "畫架", meaning: "畫家、藝術家" },
      { emoji: "🧑‍🚀", name: "太空人", meaning: "太空科學家" },
      { emoji: "🔨", name: "槌子", meaning: "工程師、法官" },
      { emoji: "🚗", name: "汽車", meaning: "工程師、賽車手" },
      { emoji: "🩺", name: "聽診器", meaning: "醫師、護理" },
      { emoji: "🔫", name: "手槍", meaning: "軍警、保家衛國" },
      { emoji: "🎤", name: "麥克風", meaning: "歌手、主持人" },
      { emoji: "💻", name: "電腦", meaning: "工程師、程式設計" },
      { emoji: "🪙", name: "元寶", meaning: "財運亨通" },
      { emoji: "🥟", name: "蒸籠", meaning: "廚師、餐飲業" },
      { emoji: "⚽", name: "藤球", meaning: "運動員" },
      { emoji: "📏", name: "尺", meaning: "建築師、設計師" },
      { emoji: "🔭", name: "望遠鏡", meaning: "探險家、天文" },
      { emoji: "🎹", name: "鋼琴", meaning: "音樂家" },
      { emoji: "🔍", name: "放大鏡", meaning: "研究員、科學家" },
      { emoji: "🖌️", name: "毛筆", meaning: "文學家、書法家" },
    ],
  },
});

export const partyTraditionalItems = defineBlock({
  key: "party.traditionalItems",
  page: PAGE,
  label: "抓周傳統物品",
  description: "抓周物品區的第二組：傳統祈福物品圖示格。",
  fields: [
    { type: "text", key: "eyebrow", label: "標題上方小字（英文）" },
    { type: "text", key: "title", label: "區塊標題" },
    {
      type: "text",
      key: "description",
      label: "標題下方說明",
      hint: "留空就不顯示",
    },
    {
      type: "list",
      key: "items",
      label: "傳統物品",
      itemLabel: "物品",
      titleKey: "name",
      of: zhuazhouItemFields,
    },
  ],
  defaults: {
    eyebrow: "Traditional Items",
    title: "抓周傳統物品",
    description: "承載家族祝福的傳統祈福物品。",
    items: [
      { emoji: "🧺", name: "籐籃", meaning: "盛裝祝福，事事如意" },
      { emoji: "🐢", name: "紅龜粿", meaning: "長命百歲、平安健康" },
      { emoji: "🌿", name: "蔥", meaning: "聰明伶俐" },
      { emoji: "🍗", name: "雞腿", meaning: "豐衣足食" },
      { emoji: "💰", name: "金元寶", meaning: "財運亨通、富貴吉祥" },
      { emoji: "🧄", name: "蒜", meaning: "會精打細算" },
      { emoji: "🍎", name: "蘋果", meaning: "平平安安" },
      { emoji: "🥬", name: "芹菜", meaning: "勤奮努力" },
      { emoji: "🍘", name: "米香", meaning: "好人緣、人見人愛" },
      { emoji: "🥜", name: "花生", meaning: "長生不老、福氣綿延" },
    ],
  },
});

export const partyPlayEntry = defineBlock({
  key: "party.playEntry",
  page: PAGE,
  label: "模擬抓周入口",
  description: "抓周物品區下方，連到線上模擬抓周小遊戲的按鈕。",
  fields: [
    { type: "text", key: "text", label: "說明文字" },
    { type: "text", key: "button", label: "按鈕文字" },
  ],
  defaults: {
    text: "想先猜猜寶寶會抓到什麼嗎？",
    button: "線上模擬抓周 →",
  },
});

export const partyGallery = defineBlock({
  key: "party.gallery",
  page: PAGE,
  label: "攝影作品",
  description: "照片牆上方的標題文字。照片請到「網站圖片」的攝影作品相簿更換。",
  fields: [
    { type: "text", key: "eyebrow", label: "標題上方小字（英文）" },
    { type: "text", key: "title", label: "區塊標題" },
    { type: "text", key: "intro", label: "標題下方說明", multiline: true },
  ],
  defaults: {
    eyebrow: "Photo Gallery",
    title: "攝影作品",
    intro: "從佈置到寶寶笑容，每一刻都值得珍藏。",
  },
});

export const partyMemories = defineBlock({
  key: "party.memories",
  page: PAGE,
  label: "滿版背景輪播文字",
  description:
    "照片牆下方、背景照片自動輪播的滿版區塊上的白色文字。背景照片請到「網站圖片」的「滿版背景輪播」更換。",
  fields: [
    { type: "text", key: "eyebrow", label: "標題上方小字（英文）" },
    { type: "text", key: "title", label: "大標題" },
    { type: "text", key: "body", label: "說明文字", multiline: true },
  ],
  defaults: {
    eyebrow: "Forever Memories",
    title: "紀錄每個美好瞬間",
    body: "從寶寶第一次穿上虎衣，到全家圍著生日蛋糕的笑容，我們替您留住所有值得珍藏的細節。",
  },
});

export const partyBirthdayPlan = defineBlock({
  key: "party.birthdayPlan",
  page: PAGE,
  label: "兒童生日派對方案",
  description:
    "頁面最下方的兒童生日派對介紹。照片請到「網站圖片」的「兒童生日方案」更換。",
  fields: [
    { type: "text", key: "eyebrow", label: "標題上方小字（英文）" },
    {
      type: "text",
      key: "title",
      label: "標題",
      hint: "也會用來產生照片的替代文字",
    },
    { type: "text", key: "intro", label: "標題下方說明", multiline: true },
    {
      type: "list",
      key: "features",
      label: "方案內容（圓點條列）",
      of: "text",
      itemLabel: "內容",
    },
    {
      type: "list",
      key: "notes",
      label: "注意事項（下方小字）",
      of: "text",
      itemLabel: "注意事項",
      multiline: true,
      hint: "每一條前面會自動加上「・」",
    },
  ],
  defaults: {
    eyebrow: "Birthday Party",
    title: "兒童生日派對",
    intro: "寶貝的每個生日都很重要，爸爸媽媽只想陪著你過每個美好瞬間！",
    features: [
      "場地包場 2.5 小時",
      "背板公版佈置",
      "生日氣球（空飄數字氣球）",
      "拍照佈置",
      "指定主持人，需另加 $2000",
    ],
    notes: [
      "此方案限定 2-9 歲，10 歲以上價格 +300（多一組生日氣球柱）",
      "此方案不包含餐點和攝影師，如有需要攝影服務或餐點，皆以加購服務",
      "如自帶外食或外匯餐點，酌收 2000 元清潔費",
      "場地容納人數依主題場地而定：福氣滿滿屋推薦 10～15 人；森林童話屋、奶油寶貝屋推薦 15～25 人；星河派對屋推薦 25～100 人，最多可容納 150 人",
    ],
  },
});
