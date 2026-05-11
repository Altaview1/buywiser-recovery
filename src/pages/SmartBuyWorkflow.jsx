import { useState } from "react";
import StageIndicator from "@/components/smartbuy/workflow/StageIndicator";
import HomeSearchStage from "@/components/smartbuy/workflow/HomeSearchStage";
import TourStage from "@/components/smartbuy/workflow/TourStage";
import ConsultationStage from "@/components/smartbuy/workflow/ConsultationStage";
import OfferStage from "@/components/smartbuy/workflow/OfferStage";
import { usePageTitle } from "@/lib/usePageTitle";

export default function SmartBuyWorkflow() {
  usePageTitle("SmartBuy™ Guided Workflow | BuyWiser");
  
  const [currentStage, setCurrentStage] = useState("search");
  const [propertyData, setPropertyData] = useState(null);

  const handlePropertySubmit = (data) => {
    setPropertyData(data);
    setCurrentStage("tour");
  };

  const handleTourComplete = () => {
    setCurrentStage("consultation");
  };

  const handleConsultationComplete = () => {
    setCurrentStage("offer");
  };

  return (
    <div className="min-h-screen bg-white">
      <StageIndicator currentStage={currentStage} />

      {currentStage === "search" && (
        <HomeSearchStage onPropertySubmit={handlePropertySubmit} />
      )}

      {currentStage === "tour" && (
        <TourStage onContinue={handleTourComplete} />
      )}

      {currentStage === "consultation" && (
        <ConsultationStage onContinue={handleConsultationComplete} />
      )}

      {currentStage === "offer" && (
        <OfferStage />
      )}
    </div>
  );
}