"use client";

import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface DisplayCardProps {
  className?: string;
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  date?: string;
  iconClassName?: string;
  titleClassName?: string;
  href?: string;
  image?: string;
}

function DisplayCard({
  className,
  icon = <Sparkles className="size-4 text-blue-300" />,
  title = "Featured",
  description = "Discover amazing content",
  date = "Just now",
  titleClassName = "text-blue-500",
  href,
  image,
}: DisplayCardProps) {
  const CardWrapper = href ? Link : "div";

  return (
    <CardWrapper
      href={href || ""}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "relative flex min-h-[28rem] w-[26rem] -skew-y-[8deg] select-none flex-col gap-4 rounded-xl border-2 bg-muted/70 backdrop-blur-sm px-6 py-4 transition-all duration-700 after:absolute after:-right-1 after:top-[-5%] after:h-[110%] after:w-[20rem] after:bg-gradient-to-l after:from-background after:to-transparent after:content-[''] hover:border-white/20 hover:bg-muted hover:cursor-pointer",
        className
      )}
    >
      <div className="flex items-center gap-2 shrink-0">
        <span className="relative inline-block rounded-full bg-blue-800 p-1">
          {icon}
        </span>
        <p className={cn("text-xl font-medium", titleClassName)}>{title}</p>
      </div>
      {image && (
        <div className="relative w-full h-[200px] rounded-lg overflow-hidden shrink-0">
          <Image src={image} alt={title} fill className="object-contain" />
        </div>
      )}
      <p className="text-lg leading-tight">{description}</p>
      <p className="text-muted-foreground mt-auto">{date}</p>
    </CardWrapper>
  );
}

interface DisplayCardsProps {
  cards?: DisplayCardProps[];
}

export default function DisplayCards({ cards }: DisplayCardsProps) {
  const defaultCards = [
    {
      className:
        "[grid-area:stack] hover:-translate-y-10 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration:700 hover:grayscale-0 before:left-0 before:top-0",
    },
    {
      className:
        "[grid-area:stack] translate-x-16 translate-y-10 hover:-translate-y-1 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration:700 hover:grayscale-0 before:left-0 before:top-0",
    },
    {
      className:
        "[grid-area:stack] translate-x-32 translate-y-20 hover:translate-y-10",
    },
  ];

  const displayCards = cards || defaultCards;

  return (
    <div className="grid [grid-template-areas:'stack'] place-items-center opacity-100 animate-in fade-in-0 duration-700">
      {displayCards.map((cardProps, index) => (
        <DisplayCard key={index} {...cardProps} />
      ))}
    </div>
  );
}
