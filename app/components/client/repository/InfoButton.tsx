import { DatasetInfo, ModelInfo } from '@/interfaces/homePageInterface';
import { Modal, TableData, Table } from '@mantine/core';
import { Info } from 'lucide-react';
import React, { useState } from 'react'

interface InfoButtonProps {
  info?: ModelInfo | DatasetInfo
}
const InfoButton: React.FC<InfoButtonProps> = ({ info }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const activeModal: TableData = {
    body: info
      ? Object.entries(info)
        .filter(([key, value]) => !["id", "name"].includes(key) && value)
        .map(([key, value]) => [key.replace("_", " "), value])
      : [],
  };
  return (
    <>
      <button
        className="table-btn info"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(true);
        }}
      >
        <Info size={18} />
      </button>
      <Modal
        opened={isOpen}
        onClose={() => setIsOpen(false)}
        centered
        size="auto"
        title="File Information"
        styles={{
          title: {
            color: 'black',
            fontWeight: 'bold',
            fontSize: "1.2rem",
          },
        }}
      >
        {info ? (
          <>
            <p style={{ marginBottom: "10px", fontSize: "0.9rem" }}>
              Here below it is possible to read advance information for the file{" "}
              <b>{info.name}</b>.
            </p>
            <Table
              w={"500px"}
              variant="vertical"
              layout="fixed"
              withTableBorder
              data={activeModal}
              className="info-table"
            />
          </>
        ) : (
          <p>No more info to display</p>
        )}
      </Modal>
    </>
  )
}

export default InfoButton