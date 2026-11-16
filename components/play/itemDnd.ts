"use client";

import { useRef, useSyncExternalStore } from "react";
import {
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  pointerWithin,
  rectIntersection,
  useSensor,
  useSensors,
  type Announcements,
  type CollisionDetection,
  type ScreenReaderInstructions,
} from "@dnd-kit/core";

// 模擬抓周「拖曳物品換位置」共用的 dnd-kit 設定（房間模式、快速模式都用）

// - 滑鼠：移動 6px 才算拖曳，單純點一下還是 click（開「拿掉／換一個」選單）
// - 手指：長按 0.2 秒才開始拖，平常滑過物品照樣可以捲動頁面
// - 鍵盤：空白鍵拿起／放下、方向鍵移動、Esc 取消；Enter 留給按鈕本身（開選單）
export const useItemSensors = () =>
  useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 200, tolerance: 8 },
    }),
    useSensor(KeyboardSensor, {
      keyboardCodes: { start: ["Space"], cancel: ["Escape"], end: ["Space"] },
    }),
  );

// 先看指標落在哪個投放區；鍵盤拖曳沒有指標，改用拖曳中物品的範圍判斷
export const pointerFirst: CollisionDetection = (args) => {
  const hits = pointerWithin(args);
  return hits.length > 0 ? hits : rectIntersection(args);
};

// 拖曳期間與結束後短時間內的 click 一律吞掉，不要打開「拿掉／換一個」選單：
// - 滑鼠放開時若剛好落在原本的按鈕上，瀏覽器會補一個 click
// - 鍵盤用空白鍵拿起／放下，放開空白鍵時按鈕也會觸發 click（拿起時那次會在畫面更新前就送到）
const SUPPRESS_MS = 300;
export const useSuppressClickAfterDrag = () => {
  const dragging = useRef(false);
  const endedAt = useRef(0);
  return {
    markStart: () => {
      dragging.current = true;
    },
    markDragged: () => {
      dragging.current = false;
      endedAt.current = performance.now();
    },
    onClickCapture: (e: React.MouseEvent) => {
      if (
        !dragging.current &&
        performance.now() - endedAt.current > SUPPRESS_MS
      ) {
        return;
      }
      e.preventDefault();
      e.stopPropagation();
    },
  };
};

// DragOverlay 要 portal 到 body（場景有 overflow-hidden、外層有 transform），只能在瀏覽器端
const noopSubscribe = () => () => {};
export const useIsClient = () =>
  useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );

// 螢幕閱讀器的提示改成中文
export const itemScreenReaderInstructions: ScreenReaderInstructions = {
  draggable:
    "按空白鍵拿起物品，用方向鍵移動到想放的位置，再按一次空白鍵放下；按 Esc 取消。",
};

export const itemAnnouncements = (
  nameOf: (id: string | number) => string,
): Announcements => ({
  onDragStart: ({ active }) => `拿起了${nameOf(active.id)}。`,
  onDragOver: ({ active, over }) =>
    over
      ? `${nameOf(active.id)}移到了${nameOf(over.id)}。`
      : `${nameOf(active.id)}目前不在任何位置上。`,
  onDragEnd: ({ active, over }) =>
    over
      ? `${nameOf(active.id)}放到了${nameOf(over.id)}。`
      : `放下了${nameOf(active.id)}，位置沒有改變。`,
  onDragCancel: ({ active }) => `取消移動${nameOf(active.id)}。`,
});
