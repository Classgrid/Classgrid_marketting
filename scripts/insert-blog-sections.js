const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'app', 'blog', 'BlogClient.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Find the filter section start
const marker = 'flex flex-col items-start justify-between gap-4 py-4 md:flex-row md:items-center';
const markerIdx = content.indexOf(marker);

if (markerIdx === -1) {
  console.log('Marker not found!');
  process.exit(1);
}

// Find the opening <section tag before the marker
const sectionStart = content.lastIndexOf('<section', markerIdx);
console.log('Found filter section at index:', sectionStart);

const insertBefore = content.substring(sectionStart, sectionStart + 20);
console.log('Inserting before:', insertBefore);

const newSections = `{/* FEATURED VIDEO */}
      <section className="py-12 border-t border-border/50">
        <div className="mx-auto max-w-3xl">
          <div className="text-center mb-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-500 mb-2">Watch</p>
            <h2 className="text-2xl font-bold text-foreground">See ClassGrid in Action</h2>
            <p className="mt-2 text-sm text-muted-foreground max-w-xl mx-auto">
              Watch how thousands of institutions are transforming their campus operations with ClassGrid.
            </p>
          </div>
          {/* Replace VIDEO_ID with your YouTube video ID e.g. dQw4w9WgXcQ */}
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-border bg-black shadow-2xl">
            <iframe
              className="absolute inset-0 w-full h-full"
              src="https://www.youtube.com/embed/VIDEO_ID?rel=0&modestbranding=1"
              title="ClassGrid Platform Demo"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      {/* CUSTOMER TESTIMONIALS */}
      <section className="py-12 border-t border-border/50">
        <div className="mx-auto max-w-3xl">
          <div className="text-center mb-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-500 mb-2">Testimonials</p>
            <h2 className="text-2xl font-bold text-foreground">What Our Customers Say</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {[
              { quote: "ClassGrid completely transformed how we manage attendance and exams. Our faculty saves 3+ hours every week.", name: "Dr. Priya Sharma", role: "Principal, Sunrise Academy", initial: "P" },
              { quote: "The parent app keeps our community informed in real time. We have never had better communication.", name: "Rahul Mehta", role: "Director, Bright Future Institute", initial: "R" },
              { quote: "From fee collection to result publishing — ClassGrid handles it all seamlessly. Highly recommended.", name: "Sneha Patil", role: "Admin Officer, GreenLeaf College", initial: "S" },
              { quote: "Implementation was smooth and the support team was always available. Best ERP decision we made.", name: "Prof. Arun Joshi", role: "Vice Principal, Vidya Mandir", initial: "A" },
            ].map((t, i) => (
              <MotionDiv
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="rounded-2xl border border-border bg-card p-6 flex flex-col gap-4 hover:border-emerald-500/30 transition-colors"
              >
                <p className="text-sm leading-relaxed text-muted-foreground flex-grow">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-3 mt-2">
                  <div className="h-9 w-9 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 font-bold text-sm shrink-0">{t.initial}</div>
                  <div>
                    <p className="text-sm font-semibold text-foreground leading-none">{t.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{t.role}</p>
                  </div>
                </div>
              </MotionDiv>
            ))}
          </div>
        </div>
      </section>

      `;

// Insert the new sections before the filter section
content = content.substring(0, sectionStart) + newSections + content.substring(sectionStart);
fs.writeFileSync(filePath, content, 'utf8');
console.log('SUCCESS: Video and testimonials sections added!');
