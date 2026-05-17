const fs = require('fs');

let code = fs.readFileSync('app/page.tsx', 'utf8');

// 1. Add imports for new components after TeamVisionSection import
code = code.replace(
  `import { WhyClassgridSection } from "@/components/sections/WhyClassgridSection";
import { TeamVisionSection } from "@/components/sections/TeamVisionSection";`,
  `import { WhyClassgridSection } from "@/components/sections/WhyClassgridSection";
import { TeamVisionSection } from "@/components/sections/TeamVisionSection";
import { TurboComparisonSection } from "@/components/sections/TurboComparisonSection";
import { IsometricStackSection } from "@/components/sections/IsometricStackSection";`
);

// 2. Add showTurboComparison and showIsometricStack derivations after showTeamVision block
code = code.replace(
  `  const teamVisionQuotes = Array.isArray(sectionSettings?.teamVisionQuotes) ? sectionSettings.teamVisionQuotes : [];`,
  `  const teamVisionQuotes = Array.isArray(sectionSettings?.teamVisionQuotes) ? sectionSettings.teamVisionQuotes : [];
  const showTurboComparison = sectionSettings?.showTurboComparison === true;
  const showIsometricStack = sectionSettings?.showIsometricStack === true;`
);

// 3. Insert the two new sections after the showTeamVision block and before showIntegrations
code = code.replace(
  `      {showTeamVision ? (
        <Reveal>
          <TeamVisionSection
            title={teamVisionTitle}
            quotes={teamVisionQuotes}
          />
        </Reveal>
      ) : null}

      {showIntegrations ? (`,
  `      {showTeamVision ? (
        <Reveal>
          <TeamVisionSection
            title={teamVisionTitle}
            quotes={teamVisionQuotes}
          />
        </Reveal>
      ) : null}

      {showTurboComparison ? (
        <TurboComparisonSection />
      ) : null}

      {showIsometricStack ? (
        <IsometricStackSection />
      ) : null}

      {showIntegrations ? (`
);

fs.writeFileSync('app/page.tsx', code);
console.log('page.tsx updated successfully');
