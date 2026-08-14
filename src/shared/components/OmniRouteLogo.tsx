/**
 * myrouter logo SVG — modern M-shaped router topology with network nodes.
 * Matches the favicon and app icon design.
 */
type OmniRouteLogoProps = {
  size?: number;
  className?: string;
};

export default function OmniRouteLogo({ size = 20, className = "" }: OmniRouteLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Central router core */}
      <circle cx="16" cy="16" r="3" fill="currentColor" />
      {/* Outer nodes forming M shape */}
      <circle cx="7" cy="9" r="2" fill="currentColor" />
      <circle cx="25" cy="9" r="2" fill="currentColor" />
      <circle cx="7" cy="23" r="2" fill="currentColor" />
      <circle cx="25" cy="23" r="2" fill="currentColor" />
      <circle cx="16" cy="6" r="1.5" fill="currentColor" opacity="0.9" />
      {/* Primary routing pathways forming 'M' */}
      <path
        d="M7 23V9L16 16L25 9V23"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Cross routing connections */}
      <path
        d="M16 6V13"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M7 23L16 16L25 23"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.75"
      />
    </svg>
  );
}
