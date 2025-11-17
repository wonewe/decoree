import { ReactNode } from "react";
import { useAuth } from "../shared/auth";
import { useI18n } from "../shared/i18n";

type LocalSupportAccessGateProps = {
  children: ReactNode;
};

export default function LocalSupportAccessGate({ children }: LocalSupportAccessGateProps) {
  const { user, isAdmin, isKoraidTeamMember } = useAuth();
  const { t } = useI18n();
  const canAccess = isAdmin || isKoraidTeamMember(user?.email ?? "");

  if (canAccess) {
    return <>{children}</>;
  }

  return (
    <section className="section-container flex min-h-[60vh] flex-col items-center justify-center text-center">
      <div className="max-w-2xl space-y-4 rounded-3xl bg-white p-8 shadow">
        <span className="badge-label inline-block bg-hanBlue/10 text-hanBlue">
          {t("nav.localSupport")}
        </span>
        <h1 className="text-3xl font-bold text-dancheongNavy">
          {t("localSupport.gate.title")}
        </h1>
        <p className="text-sm text-slate-600">{t("localSupport.gate.description")}</p>
      </div>
    </section>
  );
}
