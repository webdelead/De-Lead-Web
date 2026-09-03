import Image from "next/image";

export default function BeBoldSection() {
  return (
    <section className="w-full py-20 md:py-32 bg-primary-purple text-secondary-white flex flex-col items-center justify-center px-4 overflow-hidden">
      <div className=" w-full flex flex-col items-center gap-6 md:gap-10 text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-center">
        {/* Row 1 */}
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 w-full">
          <span>Be Bold.</span>
          <div className="relative w-24 h-12 md:w-40 md:h-20 lg:w-48 lg:h-24 rounded-full overflow-hidden shrink-0 -rotate-3 border-2 border-secondary-white/20 shadow-lg">
            <Image
              src="/assets/images/bold-1.jpg"
              alt="Student looking up"
              fill
              className="object-cover"
            />
          </div>
          <span>Be Curious.</span>
          <div className="relative w-20 h-10 md:w-32 md:h-16 lg:w-40 lg:h-20 shrink-0 rotate-3">
            <Image
              src="/assets/icons/sticker-1.svg"
              alt="Tinkerchamps Sticker"
              fill
              className="object-contain"
            />
          </div>
        </div>

        {/* Row 2 */}
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 w-full mt-2">
          <div className="relative w-24 h-12 md:w-40 md:h-20 shrink-0 -rotate-6">
            <Image
              src="/assets/icons/sticker-2.svg"
              alt="Tinkerchamps Sticker 2"
              fill
              className="object-contain"
            />
          </div>
          <span>Be a Tinkerchampion.</span>
          <div className="relative w-16 h-16 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-2xl overflow-hidden shrink-0 rotate-6 border-2 border-secondary-white/20 shadow-lg">
            <Image
              src="/assets/images/bold-2.jpg"
              alt="Activity"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
