export default function Stats() {
  const stats = [
    { label: "Producers", value: "100+" },
    { label: "Products", value: "2,000+" },
    { label: "Middlemen Cut", value: "0%", color: "brand-color" },
    { label: "Tradition", value: "Infinite" },
  ];

  return (
    <section className="flex flex-wrap justify-between px-10 py-16 border-y border-[rgba(163,59,38,0.25)]">
      {stats.map((stat, index) => (
        <div key={index} className="w-1/2 md:w-1/4 mb-8 md:mb-0">
          <p className="text-gray-600 text-xs uppercase tracking-widest mb-1">{stat.label}</p>
          <h2 className={`text-4xl serif ${stat.color || ""}`}>{stat.value}</h2>
        </div>
      ))}
    </section>
  );
}