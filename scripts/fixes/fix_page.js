import fs from 'fs';

const filePath = 'c:\\Users\\nikhi\\OneDrive\\Documents\\classgrid_marketting\\app\\page.tsx';
let content = fs.readFileSync(filePath, 'utf-8');

const badPart = `                  <BentoCard
                    key={\`\${org.title}-\${index}\`}
                    name={org.title}
        </Reveal>
      ) : null}

      {showVideoSection ? (`

const goodPart = `                  <BentoCard
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

      {showVideoSection ? (`

content = content.replace(badPart, goodPart);
fs.writeFileSync(filePath, content);
console.log('Fixed page.tsx');
