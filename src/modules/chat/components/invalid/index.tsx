import { useNavigate, useParams } from "react-router-dom";
import { Button, Flex, Typography, theme } from "antd";
const { Text, Title } = Typography;
const { useToken } = theme;

function Invalid() {
  const params = useParams();
  const { token } = useToken();
  const navigate = useNavigate();

  const chatId = params?.chatId;

  const handleBackToMainMenuButton = () => {
    navigate("/chat/create-join");
  };

  return (
    <Flex
      justify="center"
      align="center"
      vertical
      style={{
        backgroundColor: token.colorPrimaryBg,
        width: "100dvw",
        height: "100dvh",
      }}
      gap="middle"
    >
      <Title level={2}>Something's Not Quite Right</Title>
      <Text style={{ alignSelf: "center", margin: "0 2rem" }}>
        {`It looks like something went wrong. The chat room ${chatId} may be full or doesn't exist.`}
      </Text>
      <Button type="primary" onClick={handleBackToMainMenuButton}>
        Back to Main Menu
      </Button>
    </Flex>
  );
}

export default Invalid;
