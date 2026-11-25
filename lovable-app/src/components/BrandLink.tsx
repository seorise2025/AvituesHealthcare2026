import { useState } from "react";
import { Link } from "react-router-dom";

/**
 * The logo. Put the real logo file at public/images/logo.png.
 * Until it is there, the text wordmark shows instead.
 */
export default function BrandLink() {
  const [failed, setFailed] = useState(false);
  return (
    <Link className="brand" to="/" aria-label="Aviteus Healthcare home">
      {!failed && (
        <img
          src="/images/logo.png"
          alt="Aviteus Healthcare"
          width={160}
          height={44}
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
