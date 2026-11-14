import "server-only";
import {
  partyCareerItems,
  partyTraditionalItems,
} from "@/lib/site-content/blocks/baby-party";
import { getContent } from "@/lib/site-content/server";
import { mergePlayItems } from "./items";

// 遊戲物品直接讀寶寶派對頁的兩組抓周物品，後台改物品遊戲就跟著變
export const getPlayItems = async () => {
  const [career, traditional] = await Promise.all([
    getContent(partyCareerItems),
    getContent(partyTraditionalItems),
  ]);
  return mergePlayItems(career.items, traditional.items);
};
