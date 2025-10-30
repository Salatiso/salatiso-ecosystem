/**
 * Ubuntu Badges Page
 * 
 * Main page for viewing and tracking Ubuntu achievement badges
 */

import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useAuth } from "@/contexts/AuthContext";
import AppLayout from "@/components/layouts/AppLayout";

type ViewMode = "earned" | "available" | "suggested" | "leaderboard";

const BadgesPage: React.FC = () => {
  const { t } = useTranslation("common");
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<ViewMode>("earned");

  return (
    <>
      <Head>
        <title>{t("badges.title", "Ubuntu Badges")} - Salatiso</title>
        <meta
          name="description"
          content="Track and earn Ubuntu achievement badges for demonstrating Respect, Community, Leadership, Sharing, and Harmony"
        />
      </Head>

      <AppLayout>
        <div className="badges-page max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="page-header mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-3 flex items-center gap-3">
              <span className="header-icon text-5xl">🏆</span>
              Ubuntu Achievement Badges
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl">
              Coming Soon - Ubuntu badge system for celebrating family achievements!
            </p>
          </div>
        </div>
      </AppLayout>
    </>
  );
};

export const getStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", ["common"])),
    },
  };
};

export default BadgesPage;
