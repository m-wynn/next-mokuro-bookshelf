import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "../styles/tailwind.css";
import Navbar from "../components/navbar";
import { useState } from "react";
config.autoAddCss = false;

function MyApp({ Component, pageProps }) {
  const [search, setSearch] = useState("");
  return (
    <div data-theme="catppuccin-latte">
      <Navbar setSearch={setSearch} />
      <Component {...pageProps} search={search} />
    </div>
  );
}

export default MyApp;
