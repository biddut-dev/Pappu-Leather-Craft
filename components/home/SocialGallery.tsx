import React from "react";
import Image from "next/image";


export default function SocialGallery() {
  const images = [
    {
      src: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=600&auto=format&fit=crop",
      alt: "Loafers on street",
      tag: "#PappuLoafers",
    },
    {
      src: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=600&auto=format&fit=crop",
      alt: "Formal oxford details",
      tag: "#OxfordsDhaka",
    },
    {
      src: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=600&auto=format&fit=crop",
      alt: "Leather boots lifestyle",
      tag: "#HeritageBoots",
    },
    {
      src: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=600&auto=format&fit=crop",
      alt: "Casual sneakers",
      tag: "#UrbanLeather",
    },
    {
      src: "https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=600&auto=format&fit=crop",
      alt: "Full grain accessories",
      tag: "#LeatherCraftBD",
    },
  ];

  return (
    <section className="py-20 bg-[#0E0E0E] border-b border-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#8B5E3C]">
            Community & Lifestyle
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif text-[#F3EDE3] font-bold">
            Follow @pappuleathercraft
          </h2>
          <p className="text-xs text-zinc-400">
            Tag us in your moments across Dhaka, Chittagong, and beyond.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {images.map((item, idx) => (
            <a
              key={idx}
              href="https://instagram.com/pappuleathercraft"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square rounded-lg overflow-hidden bg-[#161616] border border-[#222222]"
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 640px) 50vw, 20vw"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-3 text-center">
                <svg
                  className="w-5 h-5 text-white mb-1.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
                <span className="text-[11px] text-zinc-300 font-mono">{item.tag}</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
