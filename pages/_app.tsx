import { config } from "@fortawesome/fontawesome-svg-core";
import { SessionProvider } from "next-auth/react";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "../styles/tailwind.css";
import Navbar from "../components/navbar";
import { useState } from "react";
import { usePathname } from "next/navigation";
config.autoAddCss = false;

function Hondana({ Component, pageProps: { session, ...pageProps } }) {
  const [search, setSearch] = useState("");
  const pathname = usePathname();
  return (
    <div data-theme="catppuccin-latte">
      <SessionProvider session={session}>
        {/* Reader gets its own special navbar */}
        {pathname != "/reader" && <Navbar setSearch={setSearch} />}
        <Component {...pageProps} search={search} />
      </SessionProvider>
    </div>
  );
}

export default Hondana;
