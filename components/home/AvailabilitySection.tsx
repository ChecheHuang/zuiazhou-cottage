import { AvailabilityCalendar } from "./AvailabilityCalendar";
import { getPublicAvailability } from "@/lib/schedule/server";

// 伺服器端算好每天的狀態（不含客人資料），交給日曆元件顯示
export const AvailabilitySection = async () => (
  <AvailabilityCalendar data={await getPublicAvailability()} />
);
