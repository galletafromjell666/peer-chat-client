import { Card, Typography } from 'antd'

import SectionContainer from './SectionContainer'

const { Text} = Typography;

function WhyPeerChat() {
  return (
    <SectionContainer title="Why PeerChat?" isBordered id="why-peer-chat">
    <Card title="Complete Privacy" bordered style={{ width: 250 }}>
      <Text>
        With PeerChat, your messages never touch a server. Your data stays
        between you and your chat partner.
      </Text>
    </Card>
    <Card title="End-to-End Encryption" bordered style={{ width: 250 }}>
      <Text>
        Every conversation is fully encrypted, ensuring only you and your
        partner can read or access your messages.
      </Text>
    </Card>
    <Card title="No Central Storage" bordered style={{ width: 250 }}>
      <Text>
        Unlike traditional chat apps, PeerChat doesn’t store your
        messages, files, or metadata anywhere.
      </Text>
    </Card>
    <Card title="Easy to Use" bordered style={{ width: 250 }}>
      <Text>
        All you need is a browser and a link. No sign-ups, no
        installations, just secure communication.
      </Text>
    </Card>
  </SectionContainer>
  )
}

export default WhyPeerChat