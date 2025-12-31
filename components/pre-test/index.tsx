"use client";

import React, { useState, useEffect, useCallback } from "react";
import ReactSignatureCanvas from "react-signature-canvas";
import { useDispatch } from "react-redux";

import { Button } from "@/components";
import { setSig } from "@/redux/slices/drugTest";
import { toast } from "react-toastify";

const Signature = () => {
  const [showClearPrompt, setShowClearPrompt] = useState(false);
  const [clearSignatureConfirmed, setClearSignatureConfirmed] = useState(false);
  const [sigCanvas, setSigCanvas] = useState<any | null>();

  const dispatch = useDispatch();

  const handleClearSignature = () => {
    setShowClearPrompt(true);
    setClearSignatureConfirmed(false);
  };

  const confirmClearSignature = () => {
    setClearSignatureConfirmed(true);
    setShowClearPrompt(false);
  };

  const clearSignature = useCallback(() => {
    sigCanvas?.clear();
  }, [sigCanvas]);

  const saveSignature = () => {
    if (sigCanvas) {
      if (sigCanvas.isEmpty()) {
        toast.error("Signature is required");
        return;
      }
      const sigData = sigCanvas.toDataURL();
      dispatch(setSig(sigData));
      toast.success("Click next to continue");
    } else {
      console.error("Signature Canvas is not available");
    }
  };

  useEffect(() => {
    if (clearSignatureConfirmed) {
      clearSignature();
    }
  }, [clearSignature, clearSignatureConfirmed, sigCanvas]);

  return (
    <div
      className=""
      style={{ height: "100%", width: "97%", position: "absolute" }}
    >
      {showClearPrompt && (
        <div className="overLay">
          <div className="prompt">
            <div className="prompt-item">
              <p>Clear Signature</p>
              <p>Are you sure you want to clear the signature?</p>
            </div>
            <div className="prompt-btn">
              <Button
                classname="prompt-cancel-btn"
                onClick={() => setShowClearPrompt(false)}
              >
                Cancel
              </Button>
              <Button
                classname="prompt-yes-btn"
                onClick={confirmClearSignature}
              >
                Yes
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* <AgreementHeader title=" " /> */}
      <div className="" style={{ height: "80vh", width: "100%" }}>
        <div
          className="signBg-with-img"
          style={{
            backgroundImage: 'url("../images/signBg.png")',
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
          }}
        >
          <p className="sign-text">
            Please Sign in the white box in acceptance of the Agreement and
            Consent and press Next to continue.
          </p>
        </div>
        <div className="" style={{ width: "100%", height: "30%" }}>
          <div style={{ width: "100%", height: "100%" }}>
            <ReactSignatureCanvas
              ref={(data: any) => setSigCanvas(data)}
              penColor="#24527B"
              canvasProps={{ width: 600, height: 250, className: "sigCanvas" }}
            />
          </div>
        </div>
        <div className="signBg-with" style={{ height: "40%" }}></div>
      </div>
    </div>
  );
};

export default Signature;
