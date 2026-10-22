import type { Metadata } from "next";
import { ErrorPage } from "@/src/widgets/error-page";

export const metadata: Metadata = {
  title: "Страница не найдена | Менеджер задач",
  description: "Запрашиваемая страница не найдена.",
};

export default function NotFound() {
  return <ErrorPage status="not-found" />;
}
