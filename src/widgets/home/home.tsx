import { Login } from "@/src/features/login";

export function Home() {
  return (
    <div>
      Приложение для управления задачами.Для работы с задачами войдите в учетную
      запись:
      <Login />
    </div>
  );
}
