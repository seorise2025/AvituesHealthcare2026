import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

/**
 * The official logo (src/assets/logo.png). If it ever fails to load,
 * the text wordmark shows instead.
 */
export default function BrandLink() {
  const [failed, setFailed] = useState(false);
  return (
    <Link className="brand" to="/" aria-label="Aviteus Healthcare home">
      {!failed && (
        <img
          src={logo}
          alt="Aviteus Healthcare"
          width={108}
          height={56}
          className="brand-logo"
          onError={() => setFailed(true)}
        />
      )}
      <span className="brand-text" hidden={!failed}>
        Aviteus <b>Healthcare</b>
      </span>
    </Link>
  );
}
