// Hình minh họa chuyển động trong banner (robot AI, tay cầm game, sách, bóng đèn, bút chì, ngôi sao, ký hiệu toán)
export default function HeroArt() {
  return (
    <svg className="hbg" viewBox="0 0 1000 360" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs><path id="sp" d="M0 -14L4 -4L14 0L4 4L0 14L-4 4L-14 0L-4 -4z" /></defs>
      <g fill="#fff" fillOpacity=".15">
        <circle cx="110" cy="320" r="100" /><circle cx="910" cy="40" r="120" /><circle cx="520" cy="390" r="70" />
      </g>

      <g transform="translate(70 85)"><g className="fl">
        <line x1="60" y1="0" x2="60" y2="24" stroke="#fff" strokeWidth="5" />
        <circle cx="60" cy="0" r="9" fill="#fde047" />
        <rect y="24" width="120" height="96" rx="28" fill="#fff" />
        <rect x="-12" y="58" width="12" height="30" rx="6" fill="#fff" />
        <rect x="120" y="58" width="12" height="30" rx="6" fill="#fff" />
        <g className="blink">
          <circle cx="38" cy="64" r="13" fill="#ff5a5f" /><circle cx="82" cy="64" r="13" fill="#ff5a5f" />
          <circle cx="42" cy="60" r="4" fill="#fff" /><circle cx="86" cy="60" r="4" fill="#fff" />
        </g>
        <path d="M38 94Q60 110 82 94" stroke="#ff5a5f" strokeWidth="6" fill="none" strokeLinecap="round" />
        <rect x="20" y="126" width="80" height="46" rx="14" fill="#fff" fillOpacity=".85" />
      </g></g>

      <g transform="translate(170 30)"><g className="fl f2">
        <rect width="86" height="50" rx="25" fill="#fde047" />
        <path d="M22 48L14 68L40 50z" fill="#fde047" />
        <text x="43" y="35" textAnchor="middle" fontSize="28" fontWeight="700" fill="#ff5a5f" fontFamily="Patrick Hand,sans-serif">AI</text>
      </g></g>

      <g transform="translate(790 150) rotate(-8 80 50)"><g className="wob">
        <path d="M30 10H130Q170 10 178 60L186 110Q190 135 168 135Q150 135 138 115L128 98H32L22 115Q10 135 -8 135Q-30 135 -26 110L-18 60Q-10 10 30 10z" fill="#fff" />
        <rect x="22" y="44" width="34" height="10" rx="4" fill="#ff8a3d" />
        <rect x="34" y="32" width="10" height="34" rx="4" fill="#ff8a3d" />
        <circle cx="118" cy="40" r="9" fill="#ff5a5f" /><circle cx="142" cy="58" r="9" fill="#14b8a6" />
      </g></g>

      <g transform="translate(860 28)"><g className="gl">
        <circle cy="26" r="24" fill="#fde047" />
        <rect x="-12" y="46" width="24" height="14" rx="5" fill="#fff" />
        <path d="M-8 30Q0 18 8 30" stroke="#ff8a3d" strokeWidth="3" fill="none" />
      </g></g>

      <g transform="translate(30 296)"><g className="fl f4">
        <path d="M0 0Q40 -12 80 0V52Q40 40 0 52z" fill="#fff" />
        <path d="M80 0Q120 -12 160 0V52Q120 40 80 52z" fill="#fff" fillOpacity=".8" />
      </g></g>

      <g transform="translate(850 300) rotate(-30)"><g className="wob">
        <rect width="110" height="20" rx="4" fill="#fde047" />
        <path d="M110 0L136 10L110 20z" fill="#fff" />
        <rect x="-14" width="14" height="20" rx="4" fill="#fff" />
      </g></g>

      <g fill="#fff">
        <use className="tw" href="#sp" x="330" y="318" />
        <use className="tw t2" href="#sp" x="690" y="322" />
        <use className="tw t3" href="#sp" x="60" y="60" fillOpacity=".8" />
        <use className="tw t2" href="#sp" x="300" y="34" fillOpacity=".7" />
        <use className="tw" href="#sp" x="760" y="90" fillOpacity=".8" />
        <use className="tw t3" href="#sp" x="960" y="200" fillOpacity=".7" />
      </g>

      <g fill="#fff" fillOpacity=".4" fontSize="40" fontWeight="700" fontFamily="Patrick Hand,sans-serif">
        <text className="fl" x="290" y="330">+</text>
        <text className="fl f2" x="620" y="338">×</text>
        <text className="fl f3" x="410" y="345">?</text>
        <text className="fl f4" x="960" y="290">7</text>
        <text className="fl f2" x="20" y="215">A</text>
        <text className="fl f3" x="740" y="50">=</text>
      </g>
    </svg>
  );
}
