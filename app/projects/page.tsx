import {
  BellIcon,
  FileTextIcon,
  GlobeIcon,
  InputIcon,
} from "@radix-ui/react-icons";
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
 
const features = [
  {
    Icon: FileTextIcon,
    name: "Save your files",
    description: "We automatically save your files as you type.",
    href: "/",
    cta: "Learn more",
    className: "lg:row-start-1 lg:row-end-3 lg:col-start-1 lg:col-end-3",
  },
  {
    Icon: InputIcon,
    name: "Full text search",
    description: "Search through all your files in one place.",
    href: "/",
    cta: "Learn more",
    className: "lg:col-start-3 lg:col-end-4 lg:row-start-1 lg:row-end-3",
  },
  {
    Icon: GlobeIcon,
    name: "Multilingual",
    description: "Supports 100+ languages and counting.",
    href: "/",
    cta: "Learn more",
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
  },
  {
    Icon: BellIcon,
    name: "BellIcon",
    description: "Supports 100+ languages and counting.",
    href: "/",
    cta: "Learn more",
    className: "lg:col-start-2 lg:col-end-4 lg:row-start-3 lg:row-end-4",
  },

];
export default function ProjectsPage() {
  return (
    <div className="max-w-[688px] mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold mb-6">Projects</h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-12 text-balance">
        自己开发着玩玩的一些小项目!
      </p>

      <div className="space-y-8">
      <BentoGrid className="lg:grid-rows-2">
      {features.map((feature) => (
          <BentoCard key={feature.name} {...feature} background={<div className="bg-red-500 h-full w-full"></div>} />
        ))}
      </BentoGrid>
      </div>
    </div>
  );
}
