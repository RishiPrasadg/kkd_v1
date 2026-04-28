"use client";

import { motion } from "framer-motion";
import Image from "next/image";

// Questions that have a real image in /public/poses/
const IMAGE_POSES: Record<number, string> = {
  1: "/poses/q1.png",
  2: "/poses/q2.png",
  3: "/poses/q3.png",
  4: "/poses/q4.png",
  5: "/poses/q5.png",
  6: "/poses/q6.png",
  8: "/poses/q8.png",
  10: "/poses/q10.png",
  11: "/poses/q11.png",
};

const skin          = "#E8C4A0";
const skinShadow    = "#D4AD8A";
const hair          = "#2C2018";
const hairHighlight = "#3D2E22";
const pinkTop       = "#F0A8A0";
const pinkTopShadow = "#E0928A";
const greyPants     = "#4A4A4A";
const greyPantsShadow = "#3A3A3A";
const shoe          = "#2C2018";
const mintSocks     = "#A8C8B8";

// ─────────────────────────────────────────────────────────────────────────────
// HEAD  (unchanged — this part looked fine)
// ─────────────────────────────────────────────────────────────────────────────
function Head({
  x, y, tilt = 0, expression = "neutral", scale = 1, facing = "front",
}: {
  x: number; y: number; tilt?: number; expression?: string;
  scale?: number; facing?: "front" | "left" | "right";
}) {
  const fx = facing === "left" ? -3 : facing === "right" ? 3 : 0;
  return (
    <g transform={`translate(${x},${y}) rotate(${tilt}) scale(${scale})`}>
      <ellipse cx="0" cy="-2" rx="22" ry="24" fill={hair} />
      <circle cx="0" cy="-26" r="10" fill={hair} />
      <circle cx="0" cy="-27" r="7" fill={hairHighlight} opacity={0.3} />
      <path d="M-18 4 Q-22 -2 -20 -10" fill="none" stroke={hair} strokeWidth="3" strokeLinecap="round" />
      <path d="M18 4 Q22 -2 20 -10" fill="none" stroke={hair} strokeWidth="3" strokeLinecap="round" />
      <ellipse cx={fx} cy="4" rx="17" ry="19" fill={skin} />
      <ellipse cx={fx - 8} cy="10" rx="4" ry="2.5" fill="#E8A8A0" opacity={0.35} />
      <ellipse cx={fx + 8} cy="10" rx="4" ry="2.5" fill="#E8A8A0" opacity={0.35} />

      {expression === "happy" || expression === "peaceful" ? (
        <>
          <path d={`M${fx-8} 1 Q${fx-5.5} -2.5 ${fx-3} 1`} fill="none" stroke={hair} strokeWidth="1.8" strokeLinecap="round" />
          <path d={`M${fx+3} 1 Q${fx+5.5} -2.5 ${fx+8} 1`} fill="none" stroke={hair} strokeWidth="1.8" strokeLinecap="round" />
        </>
      ) : expression === "sleepy" ? (
        <>
          <path d={`M${fx-8} 0 Q${fx-5.5} -1.5 ${fx-3} 0.5`} fill="none" stroke={hair} strokeWidth="1.8" strokeLinecap="round" />
          <path d={`M${fx+3} 0 Q${fx+5.5} -1.5 ${fx+8} 0.5`} fill="none" stroke={hair} strokeWidth="1.8" strokeLinecap="round" />
        </>
      ) : expression === "surprised" ? (
        <>
          <circle cx={fx - 5.5} cy="0" r="2.5" fill={hair} />
          <circle cx={fx + 5.5} cy="0" r="2.5" fill={hair} />
        </>
      ) : expression === "looking_down" ? (
        <>
          <ellipse cx={fx - 5.5} cy="2" rx="2" ry="2.5" fill={hair} />
          <ellipse cx={fx + 5.5} cy="2" rx="2" ry="2.5" fill={hair} />
        </>
      ) : expression === "laughing" ? (
        <>
          <path d={`M${fx-8} 0 Q${fx-5.5} -3 ${fx-3} 0`} fill="none" stroke={hair} strokeWidth="1.8" strokeLinecap="round" />
          <path d={`M${fx+3} 0 Q${fx+5.5} -3 ${fx+8} 0`} fill="none" stroke={hair} strokeWidth="1.8" strokeLinecap="round" />
        </>
      ) : expression === "puffed" ? (
        <>
          <circle cx={fx - 5.5} cy="0" r="2" fill={hair} />
          <circle cx={fx + 5.5} cy="0" r="2" fill={hair} />
        </>
      ) : (
        <>
          <ellipse cx={fx - 5.5} cy="0" rx="2" ry="2.2" fill={hair} />
          <ellipse cx={fx + 5.5} cy="0" rx="2" ry="2.2" fill={hair} />
          <circle cx={fx - 4.5} cy="-0.8" r="0.8" fill="white" opacity={0.6} />
          <circle cx={fx + 6.5} cy="-0.8" r="0.8" fill="white" opacity={0.6} />
        </>
      )}

      {expression !== "happy" && expression !== "peaceful" && expression !== "sleepy" && expression !== "laughing" && (
        <>
          <path d={`M${fx-8} -4 Q${fx-5.5} -6 ${fx-3} -4.5`} fill="none" stroke={hair} strokeWidth="1.2" strokeLinecap="round" opacity={0.5} />
          <path d={`M${fx+3} -4.5 Q${fx+5.5} -6 ${fx+8} -4`} fill="none" stroke={hair} strokeWidth="1.2" strokeLinecap="round" opacity={0.5} />
        </>
      )}

      <path d={`M${fx} 5 Q${fx+1.5} 7.5 ${fx} 8`} fill="none" stroke={skinShadow} strokeWidth="1" strokeLinecap="round" />

      {expression === "happy" || expression === "peaceful" ? (
        <path d={`M${fx-3} 11 Q${fx} 14 ${fx+3} 11`} fill="none" stroke={hair} strokeWidth="1.3" strokeLinecap="round" />
      ) : expression === "surprised" ? (
        <ellipse cx={fx} cy="12" rx="2" ry="2.5" fill={hair} opacity={0.7} />
      ) : expression === "laughing" ? (
        <path d={`M${fx-4} 10 Q${fx} 16 ${fx+4} 10`} fill="white" stroke={hair} strokeWidth="1.2" />
      ) : expression === "puffed" ? (
        <>
          <ellipse cx={fx - 8} cy="8" rx="4" ry="3" fill={skinShadow} opacity={0.25} />
          <ellipse cx={fx + 8} cy="8" rx="4" ry="3" fill={skinShadow} opacity={0.25} />
          <line x1={`${fx-2}`} y1="12" x2={`${fx+2}`} y2="12" stroke={hair} strokeWidth="1.2" strokeLinecap="round" />
        </>
      ) : expression === "sleepy" || expression === "looking_down" ? (
        <line x1={`${fx-2}`} y1="12" x2={`${fx+2}`} y2="12" stroke={hair} strokeWidth="1.2" strokeLinecap="round" />
      ) : (
        <path d={`M${fx-2.5} 11 Q${fx} 13 ${fx+2.5} 11`} fill="none" stroke={hair} strokeWidth="1.2" strokeLinecap="round" />
      )}
    </g>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SHARED LEG HELPERS
// Legs use organic bezier curves: wider at thigh, taper at calf/ankle.
// Shoes are rounded dark shapes that extend slightly beyond the ankle.
// ─────────────────────────────────────────────────────────────────────────────

// Standard straight standing legs for 200×300 viewBox.
// lx/rx = left/right leg inner edge x at hip. Both legs ~20px wide tapering to 17px ankle.
function StandingLegs({
  hipY = 172,
  leftHipX = 76,   // left edge of left leg at hip
  rightHipX = 104, // left edge of right leg at hip (right leg = rightHipX to rightHipX+20)
  floorY = 272,
}: {
  hipY?: number; leftHipX?: number; rightHipX?: number; floorY?: number;
}) {
  const lL = leftHipX;           // left leg left edge
  const lR = leftHipX + 20;      // left leg right edge
  const rL = rightHipX;          // right leg left edge
  const rR = rightHipX + 20;     // right leg right edge
  const lC = lL + 10;            // left leg center
  const rC = rL + 10;            // right leg center
  const ankleY = floorY - 4;
  const shoeY  = floorY + 8;

  return (
    <>
      {/* ── Left leg ── wide thigh → taper to calf */}
      <path
        d={`M ${lL},${hipY}
            C ${lL-3},${hipY+24} ${lL-4},${hipY+52} ${lL-2},${hipY+76}
            C ${lL-1},${hipY+90} ${lL},${hipY+100} ${lL},${ankleY}
            L ${lR},${ankleY}
            C ${lR},${hipY+100} ${lR+1},${hipY+90} ${lR+2},${hipY+76}
            C ${lR+4},${hipY+52} ${lR+3},${hipY+24} ${lR},${hipY} Z`}
        fill={greyPants}
      />
      {/* Left leg inner shadow */}
      <path
        d={`M ${lL},${hipY} C ${lL-2},${hipY+40} ${lL-2},${hipY+80} ${lL},${ankleY}
            L ${lC},${ankleY} L ${lC},${hipY} Z`}
        fill={greyPantsShadow} opacity={0.5}
      />

      {/* ── Right leg ── */}
      <path
        d={`M ${rL},${hipY}
            C ${rL-3},${hipY+24} ${rL-4},${hipY+52} ${rL-2},${hipY+76}
            C ${rL-1},${hipY+90} ${rL},${hipY+100} ${rL},${ankleY}
            L ${rR},${ankleY}
            C ${rR},${hipY+100} ${rR+1},${hipY+90} ${rR+2},${hipY+76}
            C ${rR+4},${hipY+52} ${rR+3},${hipY+24} ${rR},${hipY} Z`}
        fill={greyPants}
      />

      {/* Crotch connector — fills the gap between the two legs */}
      <path
        d={`M ${lR},${hipY} Q ${lR+(rL-lR)/2},${hipY+14} ${rL},${hipY}
            L ${rL},${hipY+12} Q ${lR+(rL-lR)/2},${hipY+22} ${lR},${hipY+12} Z`}
        fill={greyPants}
      />

      {/* ── Left shoe ── */}
      <path
        d={`M ${lL-3},${ankleY} L ${lR+2},${ankleY}
            L ${lR+3},${shoeY} Q ${lC},${shoeY+6} ${lL-8},${shoeY+2}
            Q ${lL-14},${shoeY-2} ${lL-10},${ankleY} Z`}
        fill={shoe}
      />
      {/* ── Right shoe ── */}
      <path
        d={`M ${rL-3},${ankleY} L ${rR+2},${ankleY}
            L ${rR+3},${shoeY} Q ${rC},${shoeY+6} ${rL-8},${shoeY+2}
            Q ${rL-14},${shoeY-2} ${rL-10},${ankleY} Z`}
        fill={shoe}
      />
    </>
  );
}

// Single straight leg — used for split-position poses (stairs, walking)
function SingleLeg({
  topX, topY, botX, botY, width = 18, shadow = false,
}: {
  topX: number; topY: number; botX: number; botY: number;
  width?: number; shadow?: boolean;
}) {
  const hw = width / 2;
  const dx = botX - topX;
  const dy = botY - topY;
  const len = Math.sqrt(dx * dx + dy * dy);
  // perpendicular offset
  const px = (-dy / len) * hw;
  const py = ( dx / len) * hw;
  // control point midway with slight outward bow for thigh volume
  const mx = (topX + botX) / 2 + px * 0.3;
  const my = (topY + botY) / 2 + py * 0.3;

  return (
    <path
      d={`M ${topX - px},${topY - py}
          Q ${mx - px},${my - py} ${botX - px},${botY - py}
          L ${botX + px},${botY + py}
          Q ${mx + px},${my + py} ${topX + px},${topY + py} Z`}
      fill={shadow ? greyPantsShadow : greyPants}
      opacity={shadow ? 0.55 : 1}
    />
  );
}

// Shoe ellipse — a rounded shoe at a given ankle point
function Shoe({ cx, cy, angle = 0 }: { cx: number; cy: number; angle?: number }) {
  return (
    <ellipse cx={cx} cy={cy} rx="14" ry="7"
      fill={shoe} transform={`rotate(${angle} ${cx} ${cy})`} />
  );
}

// Mint sock band — thin strip above the shoe
function Sock({ cx, cy }: { cx: number; cy: number }) {
  return <ellipse cx={cx} cy={cy} rx="11" ry="5" fill={mintSocks} />;
}

// ─────────────────────────────────────────────────────────────────────────────
// POSE 1: Bending Forward  (viewBox 220×300)
// Person bent forward at hips; legs are vertical and visible
// ─────────────────────────────────────────────────────────────────────────────
function BendingForward() {
  return (
    <svg viewBox="0 0 220 300" fill="none" className="w-full h-full">
      {/* Legs — straight down, hip at y=120, cx≈95 & cx≈125 */}
      <SingleLeg topX={95} topY={120} botX={93} botY={238} width={20} />
      <SingleLeg topX={95} topY={120} botX={93} botY={238} width={10} shadow />
      <SingleLeg topX={123} topY={120} botX={121} botY={238} width={20} />

      {/* Crotch */}
      <path d="M 105,120 Q 110,132 115,120 L 115,130 Q 110,138 105,130 Z" fill={greyPants} />

      {/* Shoes */}
      <path d="M 80,236 L 106,236 L 107,244 Q 95,250 76,246 Q 68,242 72,236 Z" fill={shoe} />
      <path d="M 108,236 L 134,236 L 135,244 Q 123,250 104,246 Q 96,242 100,236 Z" fill={shoe} />

      {/* Torso bent forward */}
      <path d="M90 120 C88 118 86 128 92 142 C100 155 120 160 140 150 C148 146 150 138 148 128 L142 120 C140 132 136 142 126 148 C114 152 100 148 96 140 C92 134 92 126 94 120 Z" fill={pinkTop} />
      <path d="M90 120 C88 118 86 128 92 142 C96 148 100 150 104 150 L100 120 Z" fill={pinkTopShadow} />

      {/* Arms dangling */}
      <path d="M96 140 C92 155 86 180 80 205 L74 205 C78 178 84 152 90 138 Z" fill={skin} />
      <path d="M130 148 C132 165 128 185 124 205 L130 205 C134 182 136 162 134 146 Z" fill={skin} />
      <ellipse cx="77" cy="208" rx="5" ry="4" fill={skin} />
      <ellipse cx="127" cy="208" rx="5" ry="4" fill={skin} />

      <ellipse cx="148" cy="124" rx="6" ry="7" fill={skin} />
      <Head x={156} y={118} tilt={40} expression="looking_down" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// POSE 2: Hand on Chest  (viewBox 200×300)
// ─────────────────────────────────────────────────────────────────────────────
function HandOnChest() {
  // Torso bottom: x=78-122 at y=176
  return (
    <svg viewBox="0 0 200 300" fill="none" className="w-full h-full">
      <Head x={100} y={42} expression="peaceful" />
      <rect x="94" y="58" width="12" height="14" rx="5" fill={skin} />

      <path d="M70 72 C70 72 68 76 68 84 L68 168 C68 172 72 176 78 176 L122 176 C128 176 132 172 132 168 L132 84 C132 76 130 72 130 72 Z" fill={pinkTop} />
      <path d="M70 72 L100 72 L100 176 L78 176 C72 176 68 172 68 168 L68 84 Z" fill={pinkTopShadow} />
      <path d="M68 78 L56 82 L54 96 L68 92 Z" fill={pinkTop} />
      <path d="M132 78 L144 82 L146 96 L132 92 Z" fill={pinkTop} />

      <path d="M56 92 C52 100 52 114 60 124 L68 124 C62 116 60 104 62 96 Z" fill={skin} />
      <path d="M60 124 C68 128 82 132 98 132 L98 124 C84 124 72 120 64 116 Z" fill={skin} />
      <ellipse cx="98" cy="128" rx="6" ry="5" fill={skin} />

      <path d="M146 92 C150 100 150 114 142 130 L134 130 C140 116 142 104 140 96 Z" fill={skin} />
      <path d="M142 130 C136 136 124 142 108 144 L108 136 C122 136 132 132 138 126 Z" fill={skin} />
      <ellipse cx="108" cy="140" rx="6" ry="5" fill={skin} />

      <motion.path d="M60 110 Q52 108 48 112" fill="none" stroke="#C4B8A8" strokeWidth="1.2" strokeLinecap="round"
        animate={{ opacity: [0.5, 0, 0.5], x: [-2, -6, -2] }} transition={{ duration: 2.5, repeat: Infinity }} />
      <motion.path d="M58 100 Q50 98 46 102" fill="none" stroke="#C4B8A8" strokeWidth="1" strokeLinecap="round"
        animate={{ opacity: [0, 0.5, 0], x: [-2, -6, -2] }} transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }} />

      {/* Legs — torso bottom y=176, leftHipX=78, rightHipX=104, legs 20px wide */}
      <StandingLegs hipY={176} leftHipX={78} rightHipX={104} floorY={270} />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// POSE 3: Neck Tilt  (viewBox 200×300)
// ─────────────────────────────────────────────────────────────────────────────
function NeckTilt() {
  // Torso bottom: x=74-126 at y=180
  return (
    <svg viewBox="0 0 200 300" fill="none" className="w-full h-full">
      <Head x={115} y={40} tilt={22} expression="peaceful" facing="right" />
      <path d="M100 56 L112 52 L114 68 L98 68 Z" fill={skin} />

      <path d="M70 68 L130 68 C132 68 134 72 134 76 L134 172 C134 176 130 180 126 180 L74 180 C70 180 66 176 66 172 L66 76 C66 72 68 68 70 68 Z" fill={pinkTop} />
      <path d="M70 68 L100 68 L100 180 L74 180 C70 180 66 176 66 172 L66 76 Z" fill={pinkTopShadow} />
      <path d="M66 74 L54 78 L52 92 L66 88 Z" fill={pinkTop} />
      <path d="M134 74 L146 78 L148 92 L134 88 Z" fill={pinkTop} />

      <path d="M52 92 C48 108 46 130 48 155 L56 155 C54 132 56 112 58 96 Z" fill={skin} />
      <path d="M148 92 C152 108 154 130 152 155 L144 155 C146 132 144 112 142 96 Z" fill={skin} />

      <path d="M85 30 Q75 25 72 32" fill="none" stroke="#666" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M72 32 L70 28 M72 32 L76 30" stroke="#666" strokeWidth="1.5" strokeLinecap="round" />

      {/* Torso bottom y=180, leftHipX=74, rightHipX=106 */}
      <StandingLegs hipY={180} leftHipX={74} rightHipX={106} floorY={274} />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// POSE 4: Slouched / seated  (viewBox 220×300)
// Legs hang straight down from seat; thighs are mostly hidden under torso
// ─────────────────────────────────────────────────────────────────────────────
function Slouched() {
  return (
    <svg viewBox="0 0 220 300" fill="none" className="w-full h-full">
      {/* Chair */}
      <path d="M125 120 L130 120 L130 260 L125 260 Z" fill="#B8A080" />
      <path d="M60 200 L138 200 L138 206 L60 206 Z" fill="#B8A080" />
      <path d="M62 206 L62 260 L57 260 L57 206 Z" fill="#B8A080" />
      <path d="M135 206 L135 260 L130 260 L130 206 Z" fill="#B8A080" />
      <path d="M125 110 L134 110 L134 200 L125 200 Z" fill="#C4AA88" />

      <Head x={95} y={75} tilt={15} expression="looking_down" />
      <path d="M90 92 L100 90 L102 105 L88 105 Z" fill={skin} />

      <path d="M68 105 C72 125 72 148 70 172 L70 198 L126 198 L126 172 C130 148 134 125 138 105 Z" fill={pinkTop} />
      <path d="M68 105 C72 125 72 148 70 172 L70 198 L98 198 L98 172 C100 148 102 125 106 105 Z" fill={pinkTopShadow} />
      <path d="M66 110 L54 114 L52 128 L66 124 Z" fill={pinkTop} />

      <path d="M54 128 C50 142 52 158 58 170 L66 168 C62 156 60 144 62 132 Z" fill={skin} />
      <path d="M58 170 L72 172 L80 172 L80 166 L72 166 L62 164 Z" fill={skin} />
      <rect x="72" y="162" width="12" height="18" rx="2" fill="#444" />
      <rect x="73" y="164" width="10" height="14" rx="1" fill="#8AC" opacity={0.5} />

      {/* Seated legs — hanging down from seat at y=198 */}
      {/* Left leg */}
      <path d="M 72,198 C 70,214 68,232 70,248 C 71,256 70,264 71,270 L 90,270 C 90,264 90,256 91,248 C 93,232 93,214 92,198 Z" fill={greyPants} />
      <path d="M 72,198 C 71,214 70,232 71,248 L 71,270 L 80,270 L 80,198 Z" fill={greyPantsShadow} opacity={0.45} />
      {/* Right leg */}
      <path d="M 108,198 C 106,214 104,232 106,248 C 107,256 106,264 107,270 L 126,270 C 126,264 126,256 127,248 C 129,232 129,214 128,198 Z" fill={greyPants} />

      {/* Shoes */}
      <path d="M 69,268 L 92,268 L 93,276 Q 80,282 62,278 Q 56,274 60,268 Z" fill={shoe} />
      <path d="M 105,268 L 128,268 L 129,276 Q 116,282 98,278 Q 92,274 96,268 Z" fill={shoe} />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// POSE 5: On Stairs  (viewBox 220×300)
// Two legs on different step heights
// ─────────────────────────────────────────────────────────────────────────────
function OnStairs() {
  return (
    <svg viewBox="0 0 220 300" fill="none" className="w-full h-full">
      <rect x="80" y="235" width="120" height="16" rx="2" fill="#E8DDD0" />
      <rect x="100" y="212" width="100" height="16" rx="2" fill="#EDE3D6" />
      <rect x="120" y="189" width="80" height="16" rx="2" fill="#F2E9DC" />
      <path d="M195 90 L195 255" stroke="#B8A080" strokeWidth="4" strokeLinecap="round" />
      <path d="M195 90 L180 155" stroke="#B8A080" strokeWidth="3" strokeLinecap="round" />

      <Head x={130} y={62} expression="neutral" />
      <rect x="124" y="78" width="12" height="14" rx="5" fill={skin} />

      <path d="M104 92 L156 92 L152 180 L108 180 Z" fill={pinkTop} />
      <path d="M104 92 L130 92 L128 180 L108 180 Z" fill={pinkTopShadow} />
      <path d="M104 96 L92 100 L90 114 L104 110 Z" fill={pinkTop} />
      <path d="M156 96 L168 100 L170 114 L156 110 Z" fill={pinkTop} />

      <path d="M90 114 C86 128 84 145 86 162 L94 162 C92 146 94 132 96 118 Z" fill={skin} />
      <path d="M170 114 C174 128 178 145 182 162 L190 158 C186 142 180 126 174 112 Z" fill={skin} />

      {/* Front (left) leg — on lower step at y≈240 */}
      <SingleLeg topX={112} topY={180} botX={98} botY={236} width={22} />
      <SingleLeg topX={112} topY={180} botX={98} botY={236} width={11} shadow />

      {/* Back (right) leg — on higher step at y≈216 */}
      <SingleLeg topX={144} topY={180} botX={138} botY={214} width={20} />

      {/* Shoes */}
      <Shoe cx={94} cy={238} angle={-8} />
      <Shoe cx={136} cy={216} angle={-4} />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// POSE 6: Floating  (viewBox 200×300)
// ─────────────────────────────────────────────────────────────────────────────
function Floating() {
  return (
    <svg viewBox="0 0 200 300" fill="none" className="w-full h-full">
      <motion.g animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
        <Head x={100} y={50} expression="happy" />
        <rect x="94" y="66" width="12" height="14" rx="5" fill={skin} />

        <path d="M70 80 L130 80 L126 175 L74 175 Z" fill={pinkTop} />
        <path d="M70 80 L100 80 L98 175 L74 175 Z" fill={pinkTopShadow} />
        <path d="M70 84 L56 88 L54 102 L70 98 Z" fill={pinkTop} />
        <path d="M130 84 L144 88 L146 102 L130 98 Z" fill={pinkTop} />

        <path d="M54 102 C46 108 38 118 34 132 L42 134 C44 122 50 114 56 108 Z" fill={skin} />
        <path d="M146 102 C154 108 162 118 166 132 L158 134 C156 122 150 114 144 108 Z" fill={skin} />
        <ellipse cx="36" cy="134" rx="5" ry="4" fill={skin} />
        <ellipse cx="164" cy="134" rx="5" ry="4" fill={skin} />

        {/* Legs — torso bottom y=175, leftHipX=74, rightHipX=104 */}
        <StandingLegs hipY={175} leftHipX={74} rightHipX={104} floorY={268} />
      </motion.g>
      <ellipse cx="100" cy="280" rx="30" ry="5" fill="#00000006" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// POSE 7: Cross Legged  (viewBox 200×300)
// ─────────────────────────────────────────────────────────────────────────────
function CrossLegged() {
  return (
    <svg viewBox="0 0 200 300" fill="none" className="w-full h-full">
      <ellipse cx="100" cy="255" rx="58" ry="11" fill="#EDE3D6" />

      <Head x={100} y={68} expression="peaceful" />
      <rect x="94" y="84" width="12" height="14" rx="5" fill={skin} />

      <path d="M72 98 L128 98 L124 192 L76 192 Z" fill={pinkTop} />
      <path d="M72 98 L100 98 L98 192 L76 192 Z" fill={pinkTopShadow} />
      <path d="M72 102 L58 106 L56 120 L72 116 Z" fill={pinkTop} />
      <path d="M128 102 L142 106 L144 120 L128 116 Z" fill={pinkTop} />

      {/* Arms resting on knees */}
      <path d="M56 120 C50 132 48 148 52 168 L60 166 C58 148 58 136 62 126 Z" fill={skin} />
      <path d="M144 120 C150 132 152 148 148 168 L140 166 C142 148 142 136 138 126 Z" fill={skin} />

      {/* Cross-legged: right leg sweeps left-to-right, left leg right-to-left */}
      {/* Back (right) leg */}
      <path d="M 120,192 C 134,208 146,224 136,240 C 128,253 103,256 80,246
               Q 76,244 75,240 C 80,228 86,192 88,192 Z" fill={greyPantsShadow} opacity={0.7} />
      {/* Front (left) leg — overlaps */}
      <path d="M 80,192 C 66,208 54,224 64,240 C 72,253 97,256 120,246
               Q 124,244 125,240 C 120,228 114,192 112,192 Z" fill={greyPants} />

      {/* Feet visible at sides */}
      <Shoe cx={70} cy={244} angle={-15} />
      <Shoe cx={130} cy={244} angle={15} />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// POSE 8: Sleepy  (viewBox 220×300)  — mostly horizontal, minimal legs
// ─────────────────────────────────────────────────────────────────────────────
function Sleepy() {
  return (
    <svg viewBox="0 0 220 300" fill="none" className="w-full h-full">
      <rect x="18" y="195" width="184" height="42" rx="10" fill="#EDE3D6" />
      <rect x="14" y="190" width="192" height="10" rx="5" fill="#DDD6CC" />
      <ellipse cx="60" cy="186" rx="30" ry="12" fill="#F5EFE6" />

      <Head x={60} y={174} tilt={-10} expression="sleepy" />

      <path d="M80 172 C100 169 130 169 168 172 L168 192 C130 189 100 189 80 192 Z" fill={pinkTop} />
      <path d="M80 172 C100 169 120 169 140 170 L140 186 C120 185 100 185 80 186 Z" fill={pinkTopShadow} />

      <rect x="90" y="164" width="75" height="30" rx="8" fill="#DDD6CC" opacity={0.4} />

      <motion.text x="145" y="155" fontSize="14" fill="#A09890" fontWeight="bold"
        animate={{ opacity: [0, 1, 0], y: [155, 140, 125] }} transition={{ duration: 2.5, repeat: Infinity }}>z</motion.text>
      <motion.text x="156" y="138" fontSize="18" fill="#A09890" fontWeight="bold"
        animate={{ opacity: [0, 1, 0], y: [138, 122, 106] }} transition={{ duration: 2.5, repeat: Infinity, delay: 0.4 }}>z</motion.text>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// POSE 9: Arms Up  (viewBox 200×300)
// ─────────────────────────────────────────────────────────────────────────────
function ArmsUp() {
  // Torso bottom: x=76-124 at y=185
  return (
    <svg viewBox="0 0 200 300" fill="none" className="w-full h-full">
      <Head x={100} y={60} expression="happy" />
      <rect x="94" y="76" width="12" height="14" rx="5" fill={skin} />

      <path d="M72 90 L128 90 L124 185 L76 185 Z" fill={pinkTop} />
      <path d="M72 90 L100 90 L98 185 L76 185 Z" fill={pinkTopShadow} />
      <path d="M72 94 L58 98 L56 112 L72 108 Z" fill={pinkTop} />
      <path d="M128 94 L142 98 L144 112 L128 108 Z" fill={pinkTop} />

      <path d="M56 112 C48 98 46 76 50 48 C52 38 56 32 60 32 L66 36 C62 40 60 48 60 58 C60 76 62 94 66 106 Z" fill={skin} />
      <path d="M144 112 C152 98 154 76 150 48 C148 38 144 32 140 32 L134 36 C138 40 140 48 140 58 C140 76 138 94 134 106 Z" fill={skin} />
      <ellipse cx="62" cy="30" rx="5" ry="4" fill={skin} />
      <ellipse cx="138" cy="30" rx="5" ry="4" fill={skin} />

      <StandingLegs hipY={185} leftHipX={76} rightHipX={104} floorY={278} />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// POSE 10: Rising From Chair  (viewBox 220×300)
// ─────────────────────────────────────────────────────────────────────────────
function RisingFromChair() {
  return (
    <svg viewBox="0 0 220 300" fill="none" className="w-full h-full">
      <path d="M60 195 L140 195 L140 202 L60 202 Z" fill="#B8A080" />
      <path d="M60 105 L65 105 L65 195 L60 195 Z" fill="#C4AA88" />
      <path d="M56 202 L61 202 L61 262 L56 262 Z" fill="#B8A080" />
      <path d="M137 202 L142 202 L142 262 L137 262 Z" fill="#B8A080" />

      <Head x={112} y={52} expression="surprised" />
      <rect x="106" y="68" width="12" height="14" rx="5" fill={skin} />

      <path d="M86 82 L138 82 L134 188 L90 188 Z" fill={pinkTop} />
      <path d="M86 82 L112 82 L110 188 L90 188 Z" fill={pinkTopShadow} />
      <path d="M86 86 L74 90 L72 104 L86 100 Z" fill={pinkTop} />
      <path d="M138 86 L150 90 L152 104 L138 100 Z" fill={pinkTop} />

      <path d="M72 104 C68 118 66 136 68 155 L76 155 C74 138 76 122 78 108 Z" fill={skin} />
      <path d="M152 104 C156 118 158 136 156 155 L148 155 C150 138 148 122 146 108 Z" fill={skin} />

      {/* Legs — torso bottom y=188, leftHipX=90, rightHipX=114 */}
      <StandingLegs hipY={188} leftHipX={90} rightHipX={114} floorY={254} />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// POSE 11: Shoulder Press  (viewBox 200×300)
// ─────────────────────────────────────────────────────────────────────────────
function ShoulderPress() {
  return (
    <svg viewBox="0 0 200 300" fill="none" className="w-full h-full">
      <Head x={100} y={42} tilt={-5} expression="surprised" />
      <rect x="94" y="58" width="12" height="14" rx="5" fill={skin} />

      <path d="M72 72 L128 72 L124 172 L76 172 Z" fill={pinkTop} />
      <path d="M72 72 L100 72 L98 172 L76 172 Z" fill={pinkTopShadow} />
      <path d="M72 76 L58 80 L56 94 L72 90 Z" fill={pinkTop} />
      <path d="M128 76 L142 80 L144 94 L128 90 Z" fill={pinkTop} />

      <path d="M144 94 C140 94 120 88 100 86 L100 94 C118 96 138 100 142 100 Z" fill={skin} />
      <ellipse cx="82" cy="86" rx="6" ry="5" fill={skin} />
      <motion.circle cx="82" cy="84" r="10" fill="none" stroke="#E88" strokeWidth="1.2" opacity={0.4}
        animate={{ r: [10, 18, 10], opacity: [0.4, 0, 0.4] }} transition={{ duration: 1.5, repeat: Infinity }} />
      <path d="M56 94 C52 110 50 132 52 158 L60 158 C58 134 60 114 62 100 Z" fill={skin} />

      <StandingLegs hipY={172} leftHipX={76} rightHipX={104} floorY={266} />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// POSE 12: Walking  (viewBox 200×300)
// Legs in stride — front leg angled forward, back leg angled back
// ─────────────────────────────────────────────────────────────────────────────
function Walking() {
  return (
    <svg viewBox="0 0 200 300" fill="none" className="w-full h-full">
      <Head x={108} y={38} expression="happy" />
      <rect x="102" y="54" width="12" height="14" rx="5" fill={skin} />

      <path d="M80 68 L136 68 L132 168 L84 168 Z" fill={pinkTop} />
      <path d="M80 68 L108 68 L106 168 L84 168 Z" fill={pinkTopShadow} />
      <path d="M80 72 L66 76 L64 90 L80 86 Z" fill={pinkTop} />
      <path d="M136 72 L150 76 L152 90 L136 86 Z" fill={pinkTop} />

      <path d="M64 90 C60 104 58 122 60 145 L68 145 C66 124 68 108 70 96 Z" fill={skin} />
      <path d="M152 90 C156 104 158 118 156 135 L148 135 C150 120 148 106 146 94 Z" fill={skin} />

      {/* Front (left) leg — angled forward-left */}
      <SingleLeg topX={90} topY={168} botX={72} botY={266} width={22} />
      <SingleLeg topX={90} topY={168} botX={72} botY={266} width={11} shadow />

      {/* Back (right) leg — angled back-right */}
      <SingleLeg topX={120} topY={168} botX={144} botY={260} width={20} />

      {/* Hip join */}
      <path d="M 100,168 Q 108,178 118,168 L 118,178 Q 108,186 100,178 Z" fill={greyPants} />

      <Shoe cx={70} cy={267} angle={-12} />
      <Shoe cx={147} cy={261} angle={14} />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// POSE 13: Looking Behind  (viewBox 200×300)
// ─────────────────────────────────────────────────────────────────────────────
function LookingBehind() {
  return (
    <svg viewBox="0 0 200 300" fill="none" className="w-full h-full">
      <Head x={82} y={42} tilt={-28} expression="neutral" facing="left" />
      <path d="M90 58 L104 56 L106 72 L88 72 Z" fill={skin} transform="rotate(-12, 97, 65)" />

      <path d="M72 72 L128 72 L124 172 L76 172 Z" fill={pinkTop} />
      <path d="M72 72 L100 72 L98 172 L76 172 Z" fill={pinkTopShadow} />
      <path d="M72 76 L58 80 L56 94 L72 90 Z" fill={pinkTop} />
      <path d="M128 76 L142 80 L144 94 L128 90 Z" fill={pinkTop} />

      <path d="M56 94 C52 110 50 132 52 158 L60 158 C58 134 60 114 62 100 Z" fill={skin} />
      <path d="M144 94 C148 110 150 132 148 158 L140 158 C142 134 140 114 138 100 Z" fill={skin} />
      <path d="M62 35 Q46 42 54 60" fill="none" stroke="#C4B8A8" strokeWidth="1.5" strokeDasharray="4 3" />

      <StandingLegs hipY={172} leftHipX={76} rightHipX={104} floorY={266} />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// POSE 14: Puffed Cheeks  (viewBox 200×300)
// ─────────────────────────────────────────────────────────────────────────────
function PuffedCheeks() {
  return (
    <svg viewBox="0 0 200 300" fill="none" className="w-full h-full">
      <Head x={100} y={42} expression="puffed" />
      <rect x="94" y="58" width="12" height="14" rx="5" fill={skin} />

      <path d="M72 72 L128 72 L124 172 L76 172 Z" fill={pinkTop} />
      <path d="M72 72 L100 72 L98 172 L76 172 Z" fill={pinkTopShadow} />
      <path d="M72 76 L58 80 L56 94 L72 90 Z" fill={pinkTop} />
      <path d="M128 76 L142 80 L144 94 L128 90 Z" fill={pinkTop} />

      <path d="M56 94 C52 110 50 132 52 158 L60 158 C58 134 60 114 62 100 Z" fill={skin} />
      <path d="M144 94 C148 110 150 132 148 158 L140 158 C142 134 140 114 138 100 Z" fill={skin} />

      <StandingLegs hipY={172} leftHipX={76} rightHipX={104} floorY={266} />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// POSE 15: Laughing  (viewBox 200×300)
// ─────────────────────────────────────────────────────────────────────────────
function Laughing() {
  return (
    <svg viewBox="0 0 200 300" fill="none" className="w-full h-full">
      <Head x={100} y={42} expression="laughing" />
      <rect x="94" y="58" width="12" height="14" rx="5" fill={skin} />

      <path d="M72 72 L128 72 L124 172 L76 172 Z" fill={pinkTop} />
      <path d="M72 72 L100 72 L98 172 L76 172 Z" fill={pinkTopShadow} />
      <path d="M72 76 L58 80 L56 94 L72 90 Z" fill={pinkTop} />
      <path d="M128 76 L142 80 L144 94 L128 90 Z" fill={pinkTop} />

      <path d="M56 94 C52 106 56 122 68 136 L74 132 C64 120 62 108 64 98 Z" fill={skin} />
      <path d="M144 94 C148 106 144 122 132 136 L126 132 C136 120 138 108 136 98 Z" fill={skin} />
      <ellipse cx="71" cy="134" rx="5" ry="4" fill={skin} />
      <ellipse cx="129" cy="134" rx="5" ry="4" fill={skin} />

      <StandingLegs hipY={172} leftHipX={76} rightHipX={104} floorY={266} />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FALLBACK: Standing Neutral
// ─────────────────────────────────────────────────────────────────────────────
function StandingNeutral() {
  return (
    <svg viewBox="0 0 200 300" fill="none" className="w-full h-full">
      <Head x={100} y={42} />
      <rect x="94" y="58" width="12" height="14" rx="5" fill={skin} />

      <path d="M72 72 L128 72 L124 172 L76 172 Z" fill={pinkTop} />
      <path d="M72 72 L100 72 L98 172 L76 172 Z" fill={pinkTopShadow} />
      <path d="M72 76 L58 80 L56 94 L72 90 Z" fill={pinkTop} />
      <path d="M128 76 L142 80 L144 94 L128 90 Z" fill={pinkTop} />

      <path d="M56 94 C52 110 50 132 52 158 L60 158 C58 134 60 114 62 100 Z" fill={skin} />
      <path d="M144 94 C148 110 150 132 148 158 L140 158 C142 134 140 114 138 100 Z" fill={skin} />

      <StandingLegs hipY={172} leftHipX={76} rightHipX={104} floorY={266} />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// POSE MAP
// ─────────────────────────────────────────────────────────────────────────────
const POSE_MAP: Record<number, React.ComponentType> = {
  1: BendingForward,
  2: HandOnChest,
  3: NeckTilt,
  4: Slouched,
  5: OnStairs,
  6: Floating,
  7: CrossLegged,
  8: Sleepy,
  9: ArmsUp,
  10: RisingFromChair,
  11: ShoulderPress,
  12: Walking,
  13: LookingBehind,
  14: PuffedCheeks,
  15: Laughing,
};

// ─────────────────────────────────────────────────────────────────────────────
// QUIZ CHARACTER  (main export)
// ─────────────────────────────────────────────────────────────────────────────
export default function QuizCharacter({ questionId }: { questionId: number }) {
  const imageSrc = IMAGE_POSES[questionId];
  const Illustration = POSE_MAP[questionId] || StandingNeutral;

  return (
    <motion.div
      key={questionId}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className="w-48 h-64 sm:w-64 sm:h-80 lg:w-72 lg:h-96 mx-auto"
    >
      {imageSrc ? (
        <div className="relative w-full h-full">
          <Image src={imageSrc} alt={`Question ${questionId} illustration`} fill className="object-contain" priority />
        </div>
      ) : (
        <Illustration />
      )}
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// RESULT MASCOT
// ─────────────────────────────────────────────────────────────────────────────
function ResultMascotSVG({ expression, shirtColor, shirtShadow }: {
  expression: string; shirtColor: string; shirtShadow: string;
}) {
  // viewBox 120×170 — scale ≈ 0.6 of full figure
  // Torso bottom: x=40-80 at y=112
  // Left leg center ≈ x=46, right leg center ≈ x=74
  return (
    <svg viewBox="0 0 120 170" fill="none">
      <Head x={60} y={32} expression={expression} scale={0.82} />
      <rect x="55" y="47" width="10" height="10" rx="4" fill={skin} />

      <path d="M38 57 L82 57 L80 112 L40 112 Z" fill={shirtColor} />
      <path d="M38 57 L60 57 L59 112 L40 112 Z" fill={shirtShadow} />
      <path d="M38 60 L30 62 L28 72 L38 70 Z" fill={shirtColor} />
      <path d="M82 60 L90 62 L92 72 L82 70 Z" fill={shirtColor} />

      <path d="M28 72 C26 80 26 90 28 100 L33 100 C31 90 32 82 33 75 Z" fill={skin} />
      <path d="M92 72 C94 80 94 90 92 100 L87 100 C89 90 88 82 87 75 Z" fill={skin} />

      {/* Left leg — 12px wide, organic curve */}
      <path d="M 38,112 C 36,120 35,130 36,138 C 37,143 36,148 37,152 L 50,152 C 50,148 50,143 51,138 C 52,130 52,120 50,112 Z" fill={greyPants} />
      <path d="M 38,112 C 37,120 36,130 37,138 L 37,152 L 43,152 L 43,112 Z" fill={greyPantsShadow} opacity={0.45} />

      {/* Right leg */}
      <path d="M 70,112 C 68,120 67,130 68,138 C 69,143 68,148 69,152 L 82,152 C 82,148 82,143 83,138 C 84,130 84,120 82,112 Z" fill={greyPants} />

      {/* Crotch */}
      <path d="M 50,112 Q 60,120 70,112 L 70,118 Q 60,126 50,118 Z" fill={greyPants} />

      {/* Left shoe */}
      <path d="M 35,150 L 52,150 L 53,156 Q 44,160 30,157 Q 25,154 28,150 Z" fill={shoe} />
      {/* Right shoe */}
      <path d="M 67,150 L 84,150 L 85,156 Q 76,160 62,157 Q 57,154 60,150 Z" fill={shoe} />
    </svg>
  );
}

export function ResultMascot({ resultKey }: { resultKey: string }) {
  const config: Record<string, { expression: string; shirt: string; shadow: string }> = {
    mast:    { expression: "happy",    shirt: "#A8C8B8", shadow: "#90B0A0" },
    chalti:  { expression: "peaceful", shirt: "#F0A8A0", shadow: "#E0928A" },
    signals: { expression: "surprised",shirt: "#E8C888", shadow: "#D4B470" },
    badi:    { expression: "sleepy",   shirt: "#C4A898", shadow: "#B09484" },
  };
  const c = config[resultKey] || config.chalti;
  return (
    <div className="w-20 h-28">
      <ResultMascotSVG expression={c.expression} shirtColor={c.shirt} shirtShadow={c.shadow} />
    </div>
  );
}
