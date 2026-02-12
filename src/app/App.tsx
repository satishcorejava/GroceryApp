import { RouterProvider } from "react-router";
import { router } from "./routes";
import { TranslationProvider } from "./contexts/TranslationContext";

export default function App() {
  return (
    <TranslationProvider>
      <RouterProvider router={router} />
    </TranslationProvider>
  );
}
