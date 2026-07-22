// A few faint drifting particles — extends the portal's original firefly
// motif sparingly to a couple of other pages (Community, About) rather than
// confining it to one spot, so it reads as part of the site's visual
// signature rather than a one-off effect. Deliberately few, faint, and slow.
const FIREFLIES = [
  { left: "8%", top: "72%", delay: "0s", duration: "10s" },
  { left: "23%", top: "38%", delay: "2.6s", duration: "12s" },
  { left: "70%", top: "58%", delay: "4.4s", duration: "11s" },
  { left: "86%", top: "28%", delay: "1.3s", duration: "13s" },
];

export const Fireflies = () => (
  <div aria-hidden className="pointer-events-none fixed inset-0 z-[1] overflow-hidden">
    {FIREFLIES.map((f, i) => (
      <span
        key={i}
        className="absolute h-1 w-1 rounded-full"
        style={{
          left: f.left,
          top: f.top,
          background: "var(--st-turquoise)",
          boxShadow: "0 0 6px 1px rgba(184,150,90,0.5)",
          animation: `firefly-drift ${f.duration} ease-in-out ${f.delay} infinite`,
        }}
      />
    ))}
  </div>
);
