"use client";

import { AlertTriangle, Info, CheckCircle, XCircle } from "lucide-react";

// 信息框组件
interface CalloutProps {
  type?: "note" | "warning" | "tip" | "danger";
  title?: string;
  children: React.ReactNode;
}

export function Callout({ type = "note", title, children }: CalloutProps) {
  const styles = {
    note: {
      container: "bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-800",
      icon: <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
      title: "text-blue-800 dark:text-blue-300",
    },
    warning: {
      container: "bg-yellow-50 border-yellow-200 dark:bg-yellow-950/30 dark:border-yellow-800",
      icon: <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />,
      title: "text-yellow-800 dark:text-yellow-300",
    },
    tip: {
      container: "bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800",
      icon: <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />,
      title: "text-green-800 dark:text-green-300",
    },
    danger: {
      container: "bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800",
      icon: <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />,
      title: "text-red-800 dark:text-red-300",
    },
  };

  const style = styles[type];

  return (
    <div className={`border-l-4 rounded-r-lg p-4 my-6 ${style.container}`}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-0.5">
          {style.icon}
        </div>
        <div className="flex-1">
          {title && (
            <h5 className={`font-semibold mb-2 ${style.title}`}>
              {title}
            </h5>
          )}
          <div className="prose prose-sm max-w-none [&>p:first-child]:mt-0 [&>p:last-child]:mb-0">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

// 改进的引用块组件
export function Blockquote({ children, ...props }: { children?: React.ReactNode; [key: string]: unknown }) {
  return (
    <blockquote 
      className="border-l-4 border-gray-300 dark:border-gray-600 pl-6 py-2 my-6 italic text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/50 rounded-r-lg"
      {...props}
    >
      <div className="prose prose-sm max-w-none [&>p:first-child]:mt-0 [&>p:last-child]:mb-0">
        {children}
      </div>
    </blockquote>
  );
}

// 改进的表格组件
export function Table({ children, ...props }: { children?: React.ReactNode; [key: string]: unknown }) {
  return (
    <div className="my-8 overflow-x-auto">
      <div className="inline-block min-w-full align-middle">
        <div className="overflow-hidden shadow-sm ring-1 ring-gray-300 dark:ring-gray-700 rounded-lg">
          <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700" {...props}>
            {children}
          </table>
        </div>
      </div>
    </div>
  );
}

export function TableHead({ children, ...props }: { children?: React.ReactNode; [key: string]: unknown }) {
  return (
    <thead className="bg-gray-50 dark:bg-gray-800" {...props}>
      {children}
    </thead>
  );
}

export function TableBody({ children, ...props }: { children?: React.ReactNode; [key: string]: unknown }) {
  return (
    <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900" {...props}>
      {children}
    </tbody>
  );
}

export function TableRow({ children, ...props }: { children?: React.ReactNode; [key: string]: unknown }) {
  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors" {...props}>
      {children}
    </tr>
  );
}

export function TableHeader({ children, ...props }: { children?: React.ReactNode; [key: string]: unknown }) {
  return (
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" {...props}>
      {children}
    </th>
  );
}

export function TableCell({ children, ...props }: { children?: React.ReactNode; [key: string]: unknown }) {
  return (
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100" {...props}>
      {children}
    </td>
  );
}

// 分隔线组件
export function Divider() {
  return (
    <hr className="my-8 border-0 border-t border-gray-200 dark:border-gray-800" />
  );
}

// 标题锚点组件
export function HeadingWithAnchor({ 
  level, 
  id, 
  children,
  ...props
}: { 
  level: 1 | 2 | 3 | 4 | 5 | 6; 
  id?: string; 
  children?: React.ReactNode;
  [key: string]: unknown;
}) {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  
  return (
    <Tag 
      id={id} 
      className="group relative scroll-mt-20"
      {...props}
    >
      {children}
      {id && (
        <a 
          href={`#${id}`}
          className="absolute -left-6 top-0 bottom-0 flex items-center opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label={`Link to ${children}`}
        >
          <span className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            #
          </span>
        </a>
      )}
    </Tag>
  );
}