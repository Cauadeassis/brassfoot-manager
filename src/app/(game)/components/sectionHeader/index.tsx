import styles from "./sectionHeader.module.css";
interface FormatTitleProps {
  parts?: (string | null | undefined)[];
  defaultPart?: string;
}

export const formatTitle = ({
  parts = [],
  defaultPart,
}: FormatTitleProps = {}) => {
  const filtered = parts.filter((p): p is string => Boolean(p));
  if (filtered.length > 0) return `${filtered.join(" ")}`;
  return defaultPart ? `${defaultPart}` : "";
};
interface SectionHeaderProps {
  title: string;
  meta?: (string | null | undefined)[];
  defaultMeta?: string;
}

const SectionHeader = ({ title, meta, defaultMeta }: SectionHeaderProps) => (
  <header className={styles.sectionHeader}>
    <h2>
      {title}
      <span>
        {formatTitle({
          ...(meta?.length && { parts: meta }),
          ...(defaultMeta && { defaultPart: defaultMeta }),
        })}
      </span>
    </h2>
  </header>
);
export default SectionHeader;
