"use client";

import RetroGrid from "@/components/ui/retro-grid";
import SparklesText from "@/components/ui/sparkles-text";
import Image from "next/image";
import BlurFade from "@/components/ui/blur-fade";
import { Tilt } from "@/components/ui/tilt";
import { useTranslation } from "react-i18next";

import { porfolio } from "@/lib/resume";

export default function HomePage() {
  const { t } = useTranslation();
  const descriptions = [t("description1"), t("description2")];
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="relative flex h-[800px] w-full flex-col items-center justify-center overflow-hidden rounded-lg">
        <div className="absolute top-0 right-0 w-[400px] h-[200px] perspective-1000">
          <Tilt rotationFactor={10} isRevese>
            <BlurFade delay={0.1}>
              <Image
                src="/eva_01.png"
                alt="EVA01"
                width={400}
                height={200}
                className="object-contain"
              />
            </BlurFade>
          </Tilt>
        </div>
        <div className="mt-20">
          <BlurFade>
            <h1 className="text-4xl font-bold text-black dark:text-white mb-4">
              {t("intro")}
              <SparklesText className="inline-block" text={porfolio.name} />
            </h1>
          </BlurFade>
          <h1 className="text-2xl font-bold text-gray-600 dark:text-gray-300 ">
            {descriptions.map((desc, index) => (
              <BlurFade delay={0.3 + index * 0.1} key={index}>
                <p>{desc}</p>
              </BlurFade>
            ))}
          </h1>
        </div>
        <div className="absolute bottom-0 left-0 w-[300px] h-[200px] perspective-1000">
          <Tilt rotationFactor={20} isRevese>
            <BlurFade delay={0.6}>
              <Image
                src="/eva_02.png"
                alt="EVA02"
                width={400}
                height={200}
                className="object-contain"
              />
            </BlurFade>
          </Tilt>
        </div>
        <RetroGrid />
      </div>
    </div>
  );
}
