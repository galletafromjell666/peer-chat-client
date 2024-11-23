import { useState } from "react";
import { FileAddOutlined, SendOutlined } from "@ant-design/icons";
import { useRTCPeerConnectionContextValue } from "@common/hooks/useRTCConnectionContextValue";
import { useSocketIoClientContextValue } from "@common/hooks/useSocketIOContextValue";
import { useIsSendingFile, useStoreActions } from "@common/store";
import { CHUNK_SIZE } from "@common/utils/constants";
import { getDataDownloadUrl } from "@common/utils/files";
import {
  transformDataChannelFileMessagesToPeerChatMessage,
  transformDataChannelMessageToPeerChatMessage,
} from "@common/utils/messaging";
import {
  PeerChatDataChannelMessage,
  PeerChatFileData,
} from "@peer-chat-types/index";
import {
  Button,
  Flex,
  Input,
  Space,
  Tag,
  theme,
  Typography,
  Upload,
} from "antd";
import { RcFile } from "antd/es/upload/interface";
import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint";

const { Text } = Typography;
const { useToken } = theme;

function MessageComposer() {
  const { token } = useToken();
  const screens = useBreakpoint();

  const [message, setMessage] = useState("");
  const [fileList, setFileList] = useState<RcFile[]>([]);

  const { addMessage, updateMessage, updateIsSendingFile } = useStoreActions();
  const { dataChannelRef } = useRTCPeerConnectionContextValue();
  const { client: socketIOClient } = useSocketIoClientContextValue();
  const isSendingFile = useIsSendingFile();

  const sendFileToPeer = () => {
    const dataChannel = dataChannelRef.current;
    const fileId = crypto.randomUUID() as string;
    const originatorId = socketIOClient?.socket.id ?? "";

    try {
      const file = fileList[0];
      // First send the file metadata on the payload
      const payload: Partial<PeerChatFileData> = {
        id: fileId,
        name: file.name,
        type: file.type,
        size: file.size,
      };

      const fileMetadata: PeerChatDataChannelMessage = {
        payload,
        originatorId,
        timestamp: Date.now(),
        action: "start",
      };

      // Sending file metadata
      dataChannel.send(JSON.stringify(fileMetadata));
      // Add to sender state
      addMessage(
        transformDataChannelFileMessagesToPeerChatMessage(
          fileMetadata,
          socketIOClient!
        )
      );
      setFileList([]);
      updateIsSendingFile(true);
      // Set up file reading
      const reader = new FileReader();
      let offset = 0;

      const readAndSendChunk = () => {
        const slice = file.slice(offset, offset + CHUNK_SIZE);
        reader.readAsArrayBuffer(slice);
      };

      reader.onload = (e) => {
        const chunk = e.target!.result as ArrayBuffer;
        dataChannel.send(chunk);
        offset += chunk.byteLength;

        // Calculate and log progress
        const progress = ((offset / file.size) * 100).toFixed(2);
        console.log(`Send progress: ${progress}%`);

        // Continue if there's more to send
        if (offset < file.size) {
          // Check channel buffering
          if (
            dataChannel.bufferedAmount > dataChannel.bufferedAmountLowThreshold
          ) {
            dataChannel.onbufferedamountlow = () => {
              dataChannel.onbufferedamountlow = null;
              readAndSendChunk();
            };
          } else {
            readAndSendChunk();
          }
        } else {
          // Send completion message
          const completeMessage: PeerChatDataChannelMessage = {
            action: "complete",
            originatorId,
            timestamp: Date.now(),
            payload: {
              id: fileId,
            },
          };
          dataChannel.send(JSON.stringify(completeMessage));
          setFileList([]);
          console.log("File send complete");
          const url = getDataDownloadUrl(file);
          const updatedMessage = {
            fileData: { status: "complete", url } as PeerChatFileData,
          };
          updateMessage(fileId, updatedMessage);
          updateIsSendingFile(false);
        }
      };

      reader.onerror = (error) => {
        // TODO: Show error notification
        console.error("Error reading file:", error);

        const errorMessage: PeerChatDataChannelMessage = {
          action: "error",
          originatorId,
          timestamp: Date.now(),
          payload: {},
        };

        dataChannel.send(JSON.stringify(errorMessage));
        updateIsSendingFile(false);
      };

      // Start the transfer
      readAndSendChunk();
    } catch (error) {
      console.error("Error in file transfer:", error);
      const errorMessage: PeerChatDataChannelMessage = {
        action: "error",
        originatorId,
        timestamp: Date.now(),
        payload: {},
      };
      dataChannel.send(JSON.stringify(errorMessage));
      updateIsSendingFile(false);
    }
  };

  const sendMessageToPeer = () => {
    const craftedMessage: PeerChatDataChannelMessage = {
      originatorId: socketIOClient?.socket.id ?? "",
      action: "message",
      payload: {
        id: crypto.randomUUID(),
        message,
      },
      timestamp: Date.now(),
    };

    const serializedCraftedMessage = JSON.stringify(craftedMessage);
    dataChannelRef.current.send(serializedCraftedMessage);
    addMessage(
      transformDataChannelMessageToPeerChatMessage(
        craftedMessage,
        socketIOClient!
      )
    );
    setMessage("");
  };

  const handleSendMessage = () => {
    if (fileList.length > 0) {
      sendFileToPeer();
      return;
    }
    sendMessageToPeer();
  };

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSendMessage();
  };

  const hasFileUploaded = fileList.length > 0;

  return (
    <Flex
      justify="center"
      style={{
        alignSelf: "flex-start",
        width: "100vw",
        backgroundColor: token.colorBgContainerDisabled,
        borderTopWidth: "0.125rem",
        borderTopStyle: "solid",
        borderColor: token.colorBorder,
      }}
      data-test-id="input-section"
    >
      <Flex
        style={{
          width: "100%",
          maxWidth: "1450px",
        }}
      >
        <Flex
          style={{
            padding: "0.65rem 0.5rem",
            width: "100%",
            gap: screens.xs ? "0.5rem" : "1rem",
          }}
        >
          <Upload
            disabled={isSendingFile}
            maxCount={1}
            beforeUpload={(file) => {
              setFileList([file]);
              return false;
            }}
            fileList={fileList}
            showUploadList={false}
          >
            <Button shape="circle" icon={<FileAddOutlined />} />
          </Upload>
          <form onSubmit={handleSubmit}>
            <Space.Compact
              style={{
                width: "100%",
                justifyContent: "end",
                alignItems: "center",
              }}
            >
              {!hasFileUploaded ? (
                <Input
                  placeholder="Type a message..."
                  onChange={(e) => {
                    setMessage(e.target.value);
                  }}
                  value={message}
                />
              ) : (
                <div>
                  <Tag closable onClose={() => setFileList([])}>
                    <Text>{fileList[0].name}</Text>
                  </Tag>
                </div>
              )}
              <Button
                iconPosition="end"
                icon={screens.xs ? <SendOutlined /> : null}
                type="primary"
                onClick={handleSendMessage}
              >
                {!screens.xs ? "Submit" : null}
              </Button>
            </Space.Compact>
          </form>
        </Flex>
      </Flex>
    </Flex>
  );
}

export default MessageComposer;
