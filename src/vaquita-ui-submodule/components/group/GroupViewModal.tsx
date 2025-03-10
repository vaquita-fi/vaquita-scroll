import { Modal, ModalBody, ModalContent } from '@nextui-org/react';
import { motion } from 'framer-motion';
import React from 'react';
import { GroupViewPage } from './GroupViewPage';

export const GroupViewModal = ({ groupId, onClose, address }: {
  groupId: string,
  onClose: () => void,
  address: string
}) => {
  return (
    <Modal
      isOpen={!!groupId}
      onOpenChange={() => onClose()}
      className="p-0 border-none shadow-none"
      backdrop="opaque"
      size="full"
      hideCloseButton
    >
      <ModalContent
        as={motion.div}
        // @ts-expect-error because ModalContent doesn't recognize the properties of the motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
        className="w-screen h-screen bg-gradient-to-r from-blue-100 to-purple-200 overflow-auto"
      >
        <ModalBody className="flex-grow p-4">
          <GroupViewPage address={address} groupId={groupId} onExit={onClose} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
