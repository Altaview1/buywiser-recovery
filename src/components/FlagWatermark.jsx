export default function FlagWatermark() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1900 1000"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "100%",
          height: "100%",
          opacity: 0.032,
        }}
        preserveAspectRatio="xMidYMid slice"
      >
        {/* 13 stripes */}
        {[...Array(13)].map((_, i) => (
          <rect
            key={i}
            x={0}
            y={(1000 / 13) * i}
            width={1900}
            height={1000 / 13}
            fill={i % 2 === 0 ? "#b22234" : "#ffffff"}
          />
        ))}

        {/* Blue canton */}
        <rect x={0} y={0} width={760} height={538} fill="#3c3b6e" />

        {/* 50 stars arranged in 9 rows (5 cols of 6 + 4 cols of 5) */}
        {(() => {
          const stars = [];
          const starW = 760;
          const starH = 538;
          const rows = 9;
          const cols = [6, 5, 6, 5, 6, 5, 6, 5, 6];
          const rowH = starH / (rows + 1);

          for (let r = 0; r < rows; r++) {
            const count = cols[r];
            const colW = starW / (count + 1);
            const cy = rowH * (r + 1);
            for (let c = 0; c < count; c++) {
              const cx = colW * (c + 1);
              stars.push(
                <text
                  key={`${r}-${c}`}
                  x={cx}
                  y={cy + 11}
                  textAnchor="middle"
                  fontSize={22}
                  fill="#ffffff"
                >
                  ★
                </text>
              );
            }
          }
          return stars;
        })()}
      </svg>
    </div>
  );
}