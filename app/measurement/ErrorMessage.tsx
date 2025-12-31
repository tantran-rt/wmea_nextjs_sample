import { Paragraph, Modal } from "@nuralogix.ai/web-ui";
import {
  ErrorCodes,
  MeasurementEmbeddedAppError,
} from "@nuralogix.ai/web-measurement-embedded-app";
import type React from "react";
import { isModalErrorCode } from "./constants";
import { toast } from "react-toastify";

type ErrorMessageProps = {
  error: MeasurementEmbeddedAppError;
  onClear: () => void;
};

const ErrorMessage: React.FC<ErrorMessageProps> = ({ error, onClear }) => {
  const { code } = error;

  if (code === ErrorCodes.CAMERA_PERMISSION_DENIED) {
    return toast.warning(`Camera permission denied.`);
  }

  if (isModalErrorCode(code)) {
    return (
      <Modal
        isOpen
        variant="danger"
        onClose={onClear}
        showConfirmButton={false}
      >
        <Paragraph>{code}</Paragraph>
      </Modal>
    );
  }

  return null;
};

export default ErrorMessage;
