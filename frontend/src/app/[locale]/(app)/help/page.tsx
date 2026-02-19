import { useTranslations } from "next-intl";
import { Mail, Github, BookOpen } from "lucide-react";

export default function HelpPage() {
  const t = useTranslations("help");

  const sections = [
    { icon: BookOpen, titleKey: "gettingStartedTitle", descKey: "gettingStartedDesc" },
    { icon: Github, titleKey: "sourceCodeTitle", descKey: "sourceCodeDesc" },
    { icon: Mail, titleKey: "contactTitle", descKey: "contactDesc" },
  ] as const;

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-2">{t("title")}</h1>
      <p className="text-muted-foreground mb-8">{t("subtitle")}</p>

      <div className="space-y-6">
        {sections.map(({ icon: Icon, titleKey, descKey }) => (
          <div key={titleKey} className="flex gap-4">
            <div className="shrink-0 mt-0.5 h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <Icon className="h-4.5 w-4.5 text-primary" />
            </div>
            <div>
              <h2 className="font-medium mb-1">{t(titleKey)}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t(descKey)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
