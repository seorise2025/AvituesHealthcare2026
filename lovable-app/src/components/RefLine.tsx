import { useSearchParams } from "react-router-dom";

/** Shows the enquiry reference on thank-you pages, for example AV-20261125-K7Q2M. */
export default function RefLine() {
  const [params] = useSearchParams();
  const ref = params.get("ref") || "";
  if (!/^AV-\d{8}-[A-Z0-9]{5}$/.test(ref)) return null;
  return (
    <p className="intro">
      Your reference is <span className="ref-line">{ref}</span>.
    </p>
  );
}
