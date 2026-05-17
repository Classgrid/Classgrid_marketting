const fs = require('fs');

const filePath = 'c:\\Users\\nikhi\\OneDrive\\Documents\\classgrid_marketting\\app\\page.tsx';
let content = fs.readFileSync(filePath, 'utf-8');

const badPart = `            <BentoGrid className="auto-rows-auto gap-6 md:grid-cols-4 lg:grid-cols-4">
              {organizationCards.map((org, index: number) => {
                const colors = [
                  { color: "from-emerald-400/20", iconColor: "#34d399", icon: "School" },
                  { color: "from-indigo-500/20", iconColor: "#4f46e5", icon: "GraduationCap" },
                  { color: "from-cyan-500/20", iconColor: "#0891b2", icon: "Building2" },
                  { color: "from-violet-500/20", iconColor: "#8b5cf6", icon: "BookOpen" },
                ];
            fallbackPosterAlt={productVideoPosterAlt}
            title={videoSectionTitle}
            description={videoSectionDescription}
            useFallbackContent={false}
          />
        </Reveal>
      ) : null}`;

const goodPart = `            <BentoGrid className="auto-rows-auto gap-6 md:grid-cols-4 lg:grid-cols-4">
              {organizationCards.map((org, index: number) => {
                const colors = [
                  { color: "from-emerald-400/20", iconColor: "#34d399", icon: "School" },
                  { color: "from-indigo-500/20", iconColor: "#4f46e5", icon: "GraduationCap" },
                  { color: "from-cyan-500/20", iconColor: "#0891b2", icon: "Building2" },
                  { color: "from-violet-500/20", iconColor: "#8b5cf6", icon: "BookOpen" },
                ];
                const style = colors[index % colors.length];

                return (
                  <BentoCard
                    key={\`\${org.title}-\${index}\`}
                    name={org.title}
                    cta={organizationCardCtaLabel}
                    href={org.href}
                    Icon={hasNonEmptyString(org.icon) ? org.icon : style.icon}
                    color={hasNonEmptyString(org.color) ? org.color : style.color}
                    iconColor={hasNonEmptyString(org.iconColor) ? org.iconColor : style.iconColor}
                    className="min-h-[200px]"
                  />
                );
              })}
            </BentoGrid>
          </section>
        </Reveal>
      ) : null}

      {showModules ? (
        <Reveal>
          <section className="mx-auto w-full max-w-7xl border-t border-foreground/10 px-4 py-10 md:py-14">
            {(modulesTitle || modulesSubtitle) && (
              <div className="mb-10 text-center">
                <div className="mx-auto mb-6 h-1.5 w-24 rounded-full bg-orange-500"></div>
                {modulesTitle ? (
                  <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-foreground md:text-5xl">
                    {modulesTitle}
                  </h2>
                ) : null}
                {modulesSubtitle ? (
                  <p className="mx-auto max-w-2xl text-lg font-medium text-muted-foreground">
                    {modulesSubtitle}
                  </p>
                ) : null}
              </div>
            )}

            <ModulesGrid
              modules={modules}
              audienceTabs={modulesAudienceTabs}
              allTabLabel={modulesAllTabLabel}
              moduleCardCtaLabel={modulesCardCtaLabel}
              showMoreLabel={modulesShowMoreLabel}
              viewAllLabel={modulesViewAllLabel}
              calloutTitle={modulesCalloutTitle}
              calloutBody={modulesCalloutBody}
              calloutCtaLabel={modulesCalloutCtaLabel}
              calloutCtaHref={modulesCalloutCtaHref}
              useFallbackContent={false}
            />
          </section>
        </Reveal>
      ) : null}

      {showTurboComparison ? (
        <Reveal>
          <TurboComparisonSection />
        </Reveal>
      ) : null}

      {showIsometricStack ? (
        <Reveal>
          <IsometricStackSection />
        </Reveal>
      ) : null}

      {showTimeline ? (
        <Reveal>
          <TimelineSection
            title={timelineSectionTitle}
            subtitle={timelineSectionSubtitle}
            tabs={timelineTabs}
            defaultTab={defaultTimelineTab}
          />
        </Reveal>
      ) : null}

      {showVideoSection ? (
        <Reveal>
          <HeroVideoSlider
            videos={testimonialVideos}
            fallbackVideoUrl={productVideoUrl}
            fallbackPosterUrl={productVideoPosterUrl}
            fallbackPosterAlt={productVideoPosterAlt}
            title={videoSectionTitle}
            description={videoSectionDescription}
            useFallbackContent={false}
          />
        </Reveal>
      ) : null}`;

if (content.includes(badPart)) {
    content = content.replace(badPart, goodPart);
    fs.writeFileSync(filePath, content);
    console.log('Fixed page.tsx');
} else {
    console.log('badPart not found in file!');
}
