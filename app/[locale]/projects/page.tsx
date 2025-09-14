import DisplayCards from "@/components/ui/display-cards";
import { projectCards } from "@/lib/resume";
import BlurFade from "@/components/ui/blur-fade";

export default function ProjectsPage() {
  return (
    <div className="max-w-[688px] mx-auto px-4 sm:px-6 lg:px-8">
      <BlurFade>
        <h1 className="text-4xl font-bold mb-6">Projects</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-12 text-balance">
          自己开发着玩玩的一些小项目!
        </p>
      </BlurFade>
      <div className="space-y-8">
        <BlurFade delay={0.3}>
          <DisplayCards cards={projectCards} />
        </BlurFade>
      </div>
    </div>
  );
}
