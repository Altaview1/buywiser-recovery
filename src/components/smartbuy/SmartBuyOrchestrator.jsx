import { useState } from "react";
import PrequalificationStage from "./workflow/PrequalificationStage";
import PropertySearchStage from "./workflow/PropertySearchStage";
import TouringStage from "./workflow/TouringStage";
import ConsultationStage from "./workflow/ConsultationStage";
import OfferStage from "./workflow/OfferStage";
import EscrowStage from "./workflow/EscrowStage";
import InspectionStage from "./workflow/InspectionStage";
import FinancingStage from "./workflow/FinancingStage";
import AppraisalStage from "./workflow/AppraisalStage";
import ClosingStage from "./workflow/ClosingStage";

export default function SmartBuyOrchestrator() {
  const [stage, setStage] = useState(1);
  const [data, setData] = useState({
    prequalification: null,
    selectedHome: null,
    consulted: false,
    offerAction: null,
    offerCost: 0,
    coordinatorCost: 550,
    inspectionCost: 0,
    financingCost: 0,
  });

  const handleNext = (newData) => {
    setData(prev => ({ ...prev, ...newData }));
    
    if (stage === 5 && newData.action === 'continue') {
      setStage(2); // Back to property search
    } else {
      setStage(stage + 1);
    }
  };

  const totalTokensSpent = 
    (data.offerCost || 0) + 
    (data.coordinatorCost || 0) + 
    (data.inspectionCost || 0) + 
    (data.financingCost || 0) + 
    50; // touring cost

  const savingsPool = data.prequalification?.savingsPool || 0;

  return (
    <div className="min-h-screen bg-white">
      {stage === 1 && (
        <PrequalificationStage 
          onNext={(prequal) => {
            setData(prev => ({ ...prev, prequalification: prequal }));
            setStage(2);
          }}
        />
      )}

      {stage === 2 && (
        <PropertySearchStage 
          purchasePrice={data.prequalification?.purchasePrice}
          savingsPool={savingsPool}
          onNext={(home) => {
            setData(prev => ({ ...prev, selectedHome: home }));
            setStage(3);
          }}
        />
      )}

      {stage === 3 && (
        <TouringStage 
          home={data.selectedHome?.selectedHome}
          onNext={(tour) => {
            setData(prev => ({ ...prev, toured: tour.toured }));
            setStage(4);
          }}
        />
      )}

      {stage === 4 && (
        <ConsultationStage 
          home={data.selectedHome?.selectedHome}
          savingsPool={savingsPool}
          onNext={(consult) => {
            setData(prev => ({ ...prev, consulted: consult.consulted }));
            setStage(5);
          }}
        />
      )}

      {stage === 5 && (
        <OfferStage 
          home={data.selectedHome?.selectedHome}
          onNext={(offer) => {
            setData(prev => ({ 
              ...prev, 
              offerAction: offer.action,
              offerCost: offer.offerCost || 0
            }));
            if (offer.action === 'offer') {
              setStage(6);
            } else {
              setStage(2); // Back to search
            }
          }}
        />
      )}

      {stage === 6 && (
        <EscrowStage 
          onNext={(escrow) => {
            setStage(7);
          }}
        />
      )}

      {stage === 7 && (
        <InspectionStage 
          onNext={(inspections) => {
            setData(prev => ({ ...prev, inspectionCost: inspections.inspectionCost }));
            setStage(8);
          }}
        />
      )}

      {stage === 8 && (
        <FinancingStage 
          purchasePrice={data.prequalification?.purchasePrice}
          onNext={(financing) => {
            setData(prev => ({ ...prev, financingCost: financing.financingCost }));
            setStage(9);
          }}
        />
      )}

      {stage === 9 && (
        <AppraisalStage 
          onNext={(appraisal) => {
            setStage(10);
          }}
        />
      )}

      {stage === 10 && (
        <ClosingStage 
          savingsPool={savingsPool}
          tokensSpent={totalTokensSpent}
        />
      )}
    </div>
  );
}