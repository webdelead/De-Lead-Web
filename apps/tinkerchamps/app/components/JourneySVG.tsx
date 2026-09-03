// "use client";

// import { useEffect, useRef } from "react";
// import gsap from "gsap";

// interface Props {
//   activeIndex: number;
// }

// export default function JourneySVG({ activeIndex }: Props) {
//   const svgRef = useRef<SVGSVGElement | null>(null);

//   // each step moves the svg up
//   useEffect(() => {
//     if (!svgRef.current) return;

//     gsap.to(svgRef.current, {
//       y: -activeIndex * 80, // 🔥 controls movement per step
//       duration: 0.6,
//       ease: "power2.out",
//     });
//   }, [activeIndex]);

//   return (
//     <div className="relative h-55 overflow-hidden flex items-center justify-center">
//       {/* MASKED VIEWPORT */}
//       <svg ref={svgRef} viewBox="0 0 300 500" className="w-65">
//         {/* FULL PATH */}
//         <path
//           d="M150 50 L230 120 L70 190 L230 260 L70 330"
//           stroke="#facc15"
//           strokeWidth="2"
//           fill="none"
//         />

//         {/* NODE 1 */}
//         <g>
//           <circle cx="150" cy="50" r="22" fill="#6d28d9" />
//           <text x="185" y="55" fill="white" fontSize="12">
//             Unfreeze
//           </text>
//         </g>

//         {/* NODE 2 */}
//         <g>
//           <circle cx="230" cy="120" r="22" fill="#6d28d9" />
//           <text x="150" y="125" fill="white" fontSize="12">
//             Ignite
//           </text>
//         </g>

//         {/* NODE 3 */}
//         <g>
//           <circle cx="70" cy="190" r="22" fill="#6d28d9" />
//           <text x="100" y="195" fill="white" fontSize="12">
//             Discover
//           </text>
//         </g>

//         {/* NODE 4 */}
//         <g>
//           <circle cx="230" cy="260" r="22" fill="#6d28d9" />
//           <text x="150" y="265" fill="white" fontSize="12">
//             Build
//           </text>
//         </g>

//         {/* NODE 5 */}
//         <g>
//           <circle cx="70" cy="330" r="22" fill="#6d28d9" />
//           <text x="100" y="335" fill="white" fontSize="12">
//             Transform
//           </text>
//         </g>
//       </svg>
//     </div>
//   );
// }
