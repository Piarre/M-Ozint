import { Box, CircularProgress } from "@chakra-ui/react";
import { Modal, ModalOverlay, ModalContent, ModalBody } from "@chakra-ui/react";

const LoadingModal = ({
  isOpen,
  onOpen,
  onClose,
  message,
  color,
}: {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  message: string;
  color?: string;
}) => {
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalBody
            textAlign="center"
            alignContent="center"
            alignItems="center"
            justifyItems="center"
            justifyContent="center"
            p="8"
          >
            <p className="pb-4 font-extrabold text-xl">{message}.</p>
            <Box display="flex" alignItems="center" justifyContent="center">
              <CircularProgress isIndeterminate color={color ?? "blue.800"} />
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default LoadingModal;
