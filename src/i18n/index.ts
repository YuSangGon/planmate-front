import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enCommon from "./locales/en/common.json";
import enAuth from "./locales/en/auth.json";
import enHome from "./locales/en/home.json";
import enProfile from "./locales/en/profile.json";
import enBrowseRequests from "./locales/en/browseRequests.json";
import enBrowseRequestDetail from "./locales/en/browseRequestDetail.json";
import enCreatePlan from "./locales/en/createPlan.json";
import enPlanDetail from "./locales/en/planDetail.json";
import enPlanList from "./locales/en/planList.json";
import enPlannerDashboard from "./locales/en/plannerDashboard.json";
import enPlannerList from "./locales/en/plannerList.json";
import enPlannerProfile from "./locales/en/plannerProfile.json";
import enPlannerProposals from "./locales/en/plannerProposals.json";
import enPlannerProposalDetail from "./locales/en/plannerProposalDetail.json";
import enPlannerWorkPlan from "./locales/en/plannerWorkPlan.json";
import enProfilePage from "./locales/en/profilePage.json";
import enRequestDetail from "./locales/en/requestDetail.json";
import enRequestList from "./locales/en/requestList.json";
import enRequestCreate from "./locales/en/requestCreate.json";
import enRequestProposals from "./locales/en/requestProposals.json";
import enShop from "./locales/en/shop.json";
import enTravellerPlanPreview from "./locales/en/travellerPlanPreview.json";

import koCommon from "./locales/ko/common.json";
import koAuth from "./locales/ko/auth.json";
import koHome from "./locales/ko/home.json";
import koProfile from "./locales/ko/profile.json";
import koBrowseRequests from "./locales/ko/browseRequests.json";
import koBrowseRequestDetail from "./locales/ko/browseRequestDetail.json";
import koCreatePlan from "./locales/ko/createPlan.json";
import koPlanDetail from "./locales/ko/planDetail.json";
import koPlanList from "./locales/ko/planList.json";
import koPlannerDashboard from "./locales/ko/plannerDashboard.json";
import koPlannerList from "./locales/ko/plannerList.json";
import koPlannerProfile from "./locales/ko/plannerProfile.json";
import koPlannerProposals from "./locales/ko/plannerProposals.json";
import koPlannerProposalDetail from "./locales/ko/plannerProposalDetail.json";
import koPlannerWorkPlan from "./locales/ko/plannerWorkPlan.json";
import koProfilePage from "./locales/ko/profilePage.json";
import koRequestDetail from "./locales/ko/requestDetail.json";
import koRequestList from "./locales/ko/requestList.json";
import koRequestCreate from "./locales/ko/requestCreate.json";
import koRequestProposals from "./locales/ko/requestProposals.json";
import koShop from "./locales/ko/shop.json";
import koTravellerPlanPreview from "./locales/ko/travellerPlanPreview.json";

const resources = {
  en: {
    common: enCommon,
    auth: enAuth,
    home: enHome,
    profile: enProfile,
    browseRequests: enBrowseRequests,
    browseRequestDetail: enBrowseRequestDetail,
    createPlan: enCreatePlan,
    planDetail: enPlanDetail,
    planList: enPlanList,
    plannerDashboard: enPlannerDashboard,
    plannerList: enPlannerList,
    plannerProfile: enPlannerProfile,
    plannerProposals: enPlannerProposals,
    plannerProposalDetail: enPlannerProposalDetail,
    plannerWorkPlan: enPlannerWorkPlan,
    profilePage: enProfilePage,
    requestDetail: enRequestDetail,
    requestList: enRequestList,
    requestCreate: enRequestCreate,
    requestProposals: enRequestProposals,
    shop: enShop,
    travellerPlanPreview: enTravellerPlanPreview,
  },
  ko: {
    common: koCommon,
    auth: koAuth,
    home: koHome,
    profile: koProfile,
    browseRequests: koBrowseRequests,
    browseRequestDetail: koBrowseRequestDetail,
    createPlan: koCreatePlan,
    planDetail: koPlanDetail,
    planList: koPlanList,
    plannerDashboard: koPlannerDashboard,
    plannerList: koPlannerList,
    plannerProfile: koPlannerProfile,
    plannerProposals: koPlannerProposals,
    plannerProposalDetail: koPlannerProposalDetail,
    plannerWorkPlan: koPlannerWorkPlan,
    profilePage: koProfilePage,
    requestDetail: koRequestDetail,
    requestList: koRequestList,
    requestCreate: koRequestCreate,
    requestProposals: koRequestProposals,
    shop: koShop,
    travellerPlanPreview: koTravellerPlanPreview,
  },
} as const;

i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  fallbackLng: "en",
  defaultNS: "common",
  ns: [
    "common",
    "auth",
    "home",
    "profile",
    "browseRequests",
    "browseRequestDetail",
    "createPlan",
    "planDetail",
    "planList",
    "plannerDashboard",
    "plannerList",
    "plannerProfile",
    "plannerProposals",
    "plannerProposalDetail",
    "plannerWorkPlan",
    "profilePage",
    "requestDetail",
    "requestList",
    "requestCreate",
    "requestProposals",
    "shop",
    "travellerPlanPreview",
  ],
  interpolation: {
    escapeValue: false,
  },
  returnNull: false,
});

export function ensureNamespaces(_ns: string | string[]) {
  return Promise.resolve();
}

export default i18n;
